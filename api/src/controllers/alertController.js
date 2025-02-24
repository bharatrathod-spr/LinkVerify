const Alert = require("../models/alertModel");
const moment = require("moment");
const {
  updateAlertById,
  getAllAlert,
  createAlertData,
  updateAlertsByUserId,
} = require("../services/alertService");
const { sendSlackNotificationToUser } = require("../Helpers/SlackHelper");
const AlertSubscription = require("../models/alertModel");
const sendFailureReasonsMail = require("../Helpers/EmailHelper");
const MailConfiguration = require("../models/mailConfigModel");
const { logActivity } = require("../utils/commonUtils");

// ===== CREATE ALERT =====
const createAlert = async (data) => {
  try {
    const { UserId } = data;
    const newAlert = await createAlertData(data);

    const profile = newAlert.alert;

    await logActivity(
      UserId,
      "CREATE",
      "ALERT SUBSCRIPTION",
      profile.AlertId,
      "POST",
      {
        NewData: profile,
      },
      "user"
    );

    return {
      success: true,
      statusCode: 201,
    };
  } catch (error) {
    console.error("Error in creating alert:", error);
    return {
      success: false,
      statusCode: 500,
      error,
    };
  }
};

// ===== GET ALERTS BY USER =====
const getAlerts = async (req, res, next) => {
  try {
    const { UserId } = req.user;

    if (!UserId) {
      return res.status(404).json({
        success: false,
        message: "No users found!",
        Role: req?.user?.Role,
      });
    }

    // Get all alerts
    const alerts = await getAllAlert(UserId);

    if (alerts.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User alerts retrieved successfully.",
        alerts,
        Role: req?.user?.Role,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No user alerts found!",
        alerts,
        Role: req?.user?.Role,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ===== SLACK,MAIL INTEGRATION =====

const postFailureAlerts = async (
  email,
  sourceUrl,
  searchUrl,
  failureReasons,
  userId,
  alertTypes
) => {
  try {
    const userAlert = await AlertSubscription.findOne({
      UserId: userId,
      "Alerts.Type": { $in: alertTypes },
    });

    if (!userAlert) {
      return { success: false, message: "No alerts configured for this user." };
    }

    let alertSent = false;

    if (alertTypes.includes("slack")) {
      const slackMessage = `Source Link: ${sourceUrl}\nSearch Link: ${searchUrl}\nFailure Reasons:\n- ${failureReasons.join(
        "\n- "
      )}`;

      const slackResult = await sendSlackNotificationToUser(
        email,
        slackMessage
      );

      if (slackResult.success) {
        alertSent = true;
      } else {
        console.error(
          `Failed to send Slack notification: ${slackResult.message}`
        );
      }
    }

    if (alertTypes.includes("email")) {
      try {
        const mailConfigId = userAlert.MailConfigurationId;
        if (!mailConfigId) {
          console.error(`No mail configuration ID found for user ${userId}`);
        } else {
          const mailConfig = await MailConfiguration.findOne({
            MailConfigurationId: mailConfigId,
            IsDelete: false,
          });
          if (mailConfig) {
            await sendFailureReasonsMail(
              email,
              sourceUrl,
              searchUrl,
              failureReasons,
              mailConfig
            );
            alertSent = true;
          } else {
            console.error(`No mail configuration found for ID ${mailConfigId}`);
          }
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError.message);
      }
    }

    if (alertSent) {
      await userAlert.save();
    }

    return { success: true, message: "Notifications processed successfully." };
  } catch (error) {
    console.error("Error sending notifications:", error.message);
    return { success: false, message: error.message };
  }
};

const updateAlerts = async (req, res, next) => {
  try {
    const { UserId } = req.user;
    const { Alerts } = req.body;

    if (!UserId || !Alerts || !Array.isArray(Alerts)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const updatedAlerts = await updateAlertsByUserId(UserId, Alerts);

    if (updatedAlerts) {
      await logActivity(
        UserId,
        "UPDATE",
        "ALERT SUBSCRIPTION",
        updatedAlerts.AlertId,
        "PATCH",
        { OldData: req.body, NewData: updatedAlerts },
        "user"
      );
    }

    return res.status(updatedAlerts ? 200 : 404).json({
      success: !!updatedAlerts,
      data: updatedAlerts || null,
    });
  } catch (error) {
    next(error);
  }
};

const addMailConfiguration = async (req, res) => {
  const { MailConfigurationId } = req.body;

  const mailConfigId =
    MailConfigurationId?.selectedConfigId || MailConfigurationId;

  if (!MailConfigurationId) {
    return res
      .status(400)
      .json({ message: "Mail Configuration ID is required" });
  }

  try {
    const UserId = req.user.UserId;

    const updatedAlert = await Alert.findOneAndUpdate(
      { UserId },
      { $set: { MailConfigurationId: mailConfigId } },
      { new: true, upsert: true }
    );

    await logActivity(
      UserId,
      "UPDATE",
      "ALERT SUBSCRIPTION",
      updatedAlert.AlertId,
      "PATCH",
      {
        OldData: { MailConfigurationId: updatedAlert.MailConfigurationId },
        NewData: { MailConfigurationId: mailConfigId },
      },
      "user"
    );

    return res.status(200).json({
      message: "Mail configuration updated successfully",
      alert: updatedAlert,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating the mail configuration: " + error.message,
    });
  }
};

const toggleSubscription = async (req, res, next) => {
  try {
    const { UserId } = req.user;
    const { Type } = req.body;

    if (!UserId || !["slack", "email"].includes(Type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    const userAlert = await AlertSubscription.findOne({
      UserId,
      "Alerts.Type": Type,
    });

    if (!userAlert) {
      return res.status(404).json({
        success: false,
        message: `${
          Type.charAt(0).toUpperCase() + Type.slice(1)
        } alert not found`,
      });
    }

    const currentAlert = userAlert.Alerts.find((alert) => alert.Type === Type);
    const newSubscriberStatus = !currentAlert.Subscriber;

    const updatedAlert = await AlertSubscription.findOneAndUpdate(
      { UserId, "Alerts.Type": Type },
      { $set: { "Alerts.$.Subscriber": newSubscriberStatus } },
      { new: true }
    );

    if (!updatedAlert) {
      return res.status(500).json({
        success: false,
        message: "Failed to update subscription",
      });
    }

    await logActivity(
      UserId,
      "UPDATE",
      "ALERT SUBSCRIPTION",
      updatedAlert.AlertId,
      "PATCH",
      {
        OldData: { Subscriber: currentAlert.Subscriber },
        NewData: { Subscriber: newSubscriberStatus },
      },
      "user"
    );

    return res.status(200).json({
      success: true,
      message: `${Type.charAt(0).toUpperCase() + Type.slice(1)} Subscription ${
        newSubscriberStatus ? "Subscribed" : "Unsubscribed"
      } Successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

const setAlertFrequency = async (req, res, next) => {
  try {
    const { UserId } = req.user;
    const { Type, Frequency } = req.body;

    if (!UserId || !["slack", "email"].includes(Type) || !Frequency) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    const updatedAlert = await AlertSubscription.findOneAndUpdate(
      { UserId, "Alerts.Type": Type },
      { $set: { "Alerts.$.Frequency": Frequency } },
      { new: true }
    );

    if (!updatedAlert) {
      return res.status(500).json({
        success: false,
        message: "Failed to update frequency",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Frequency updated to ${Frequency} for ${Type}.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlerts,
  postFailureAlerts,
  addMailConfiguration,
  setAlertFrequency,
  toggleSubscription,
};
