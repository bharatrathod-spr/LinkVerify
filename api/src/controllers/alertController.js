const Alert = require("../models/alertModel");
const {
  updateAlertById,
  getAllAlert,
  createAlertData,
  updateAlertsByUserId,
} = require("../services/alertService");
const {
  sendSlackNotificationToUser,
  getUserIdByEmail,
} = require("../Helpers/SlackHelper");
const AlertSubscription = require("../models/alertModel");
const sendFailureReasonsMail = require("../Helpers/EmailHelper");

// ===== CREATE ALERT =====
const createAlert = async (data) => {
  try {
    await createAlertData(data);

    return {
      success: true,
      statusCode: 201,
    };
  } catch (error) {
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

// ===== SLACK INTEGRATION =====

// const postFailureAlerts = async (email, failureReasons, userId) => {
//   try {
// const userAlert = await AlertSubscription.findOne({
//   UserId: userId,
//   "Alerts.Type": "slack",
// });

// if (!userAlert) {
//   console.log(`No Slack alert found for user ${userId}.`);
//   return { success: false, message: "Slack alert not found." };
// }

// const slackAlert = userAlert.Alerts.find((alert) => alert.Type === "slack");
// if (!slackAlert || !slackAlert.Subscriber) {
//   console.log(
//     `User ${email} is not subscribed. Skipping Slack notification.`
//   );
//   return { success: false, message: "User not subscribed." };
// }

//     const messageText = `User: ${email}\nFailure Reasons:\n- ${failureReasons.join(
//       "\n- "
//     )}`;
//     console.log(messageText, "messageText");

//     const slackResult = await sendSlackNotificationToUser(email, messageText);
//     console.log(slackResult, "slackResult");

//     if (!slackResult.success) {
//       console.error(
//         `Failed to send Slack notification for ${email}: ${slackResult.message}`
//       );
//       return { success: false, message: slackResult.message };
//     }

//     return { success: true, message: "Slack notification sent successfully." };
//   } catch (error) {
//     console.error("Error sending Slack notification:", error.message);
//     return { success: false, message: error.message };
//   }
// };

//working slack integration api

// const postFailureAlerts = async (
//   email,
//   sourceUrl,
//   searchUrl,
//   failureReasons,
//   userId
// ) => {
//   try {
//     const userAlert = await AlertSubscription.findOne({
//       UserId: userId,
//       "Alerts.Type": "slack",
//     });

//     if (!userAlert) {
//       console.log(`No Slack alert found for user ${userId}.`);
//       return { success: false, message: "Slack alert not found." };
//     }

//     const slackAlert = userAlert.Alerts.find((alert) => alert.Type === "slack");
//     if (!slackAlert || !slackAlert.Subscriber) {
//       console.log(
//         `User ${email} is not subscribed. Skipping Slack notification.`
//       );
//       return { success: false, message: "User not subscribed." };
//     }

//     const messageText = `Source URL: ${sourceUrl}\nSearch URL: ${searchUrl}\nFailure Reasons:\n- ${failureReasons.join(
//       "\n- "
//     )}`;

//     const slackResult = await sendSlackNotificationToUser(email, messageText);

//     if (!slackResult.success) {
//       console.error(
//         `Failed to send Slack notification for source URL ${sourceUrl}: ${slackResult.message}`
//       );
//       return { success: false, message: slackResult.message };
//     }

//     return { success: true, message: "Slack notification sent successfully." };
//   } catch (error) {
//     console.error("Error sending Slack notification:", error.message);
//     return { success: false, message: error.message };
//   }
// };

const postFailureAlerts = async (
  email,
  sourceUrl,
  searchUrl,
  failureReasons,
  userId
) => {
  try {
    const userAlert = await AlertSubscription.findOne({
      UserId: userId,
      "Alerts.Type": { $in: ["slack", "email"] },
    });

    if (!userAlert) {
      console.log(`No alerts found for user ${userId}.`);
      return { success: false, message: "No alerts configured for this user." };
    }

    const slackAlert = userAlert.Alerts.find((alert) => alert.Type === "slack");
    if (slackAlert?.Subscriber) {
      const slackMessage = `Source URL: ${sourceUrl}\nSearch URL: ${searchUrl}\nFailure Reasons:\n- ${failureReasons.join(
        "\n- "
      )}`;

      const slackResult = await sendSlackNotificationToUser(
        email,
        slackMessage
      );
      if (!slackResult.success) {
        console.error(
          `Failed to send Slack notification for source URL ${sourceUrl}: ${slackResult.message}`
        );
      }
    }

    const emailAlert = userAlert.Alerts.find((alert) => alert.Type === "email");
    if (emailAlert?.Subscriber) {
      try {
        await sendFailureReasonsMail(
          email,
          sourceUrl,
          searchUrl,
          failureReasons
        );
        console.log(`Email notification sent successfully to ${email}.`);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError.message);
      }
    }

    return { success: true, message: "Notifications processed successfully." };
  } catch (error) {
    console.error("Error sending notifications:", error.message);
    return { success: false, message: error.message };
  }
};

//Subrscribe or Unsubscribe
// const postSlackAlerts = async (req, res, next) => {
//   try {
//     const { UserId } = req.user;
//     const { Type } = req.body;

//     if (!UserId || Type !== "slack") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid request data" });
//     }

//     const userAlert = await AlertSubscription.findOne({
//       UserId,
//       "Alerts.Type": "slack",
//     });

//     if (!userAlert) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Slack alert not found" });
//     }

//     const currentAlert = userAlert.Alerts.find(
//       (alert) => alert.Type === "slack"
//     );
//     const newSubscriberStatus = !currentAlert.Subscriber;

//     const updatedAlert = await AlertSubscription.findOneAndUpdate(
//       { UserId, "Alerts.Type": "slack" },
//       { $set: { "Alerts.$.Subscriber": newSubscriberStatus } },
//       { new: true }
//     );

//     if (!updatedAlert) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to update subscription" });
//     }

//     if (newSubscriberStatus) {
//       const SlackDetails = {
//         EmailAddress: req.user.EmailAddress,
//         MessageText: "Testing Slack notification",
//       };

//       const slackResult = await sendSlackNotificationToUser(
//         SlackDetails.EmailAddress,
//         SlackDetails.MessageText
//       );

//       if (!slackResult.success) {
//         return res.status(slackResult.statusCode).json({
//           success: false,
//           message: slackResult.message,
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Slack Subscription Subscribe Successfully.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Slack Subscription Unsubscribe Successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//working api for slack
// const postSlackAlerts = async (req, res, next) => {
//   try {
//     const { UserId } = req.user;
//     const { Type } = req.body;

//     if (!UserId || Type !== "slack") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid request data" });
//     }

//     const userAlert = await AlertSubscription.findOne({
//       UserId,
//       "Alerts.Type": "slack",
//     });

//     if (!userAlert) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Slack alert not found" });
//     }

//     const currentAlert = userAlert.Alerts.find(
//       (alert) => alert.Type === "slack"
//     );
//     const newSubscriberStatus = !currentAlert.Subscriber;

//     const updatedAlert = await AlertSubscription.findOneAndUpdate(
//       { UserId, "Alerts.Type": "slack" },
//       { $set: { "Alerts.$.Subscriber": newSubscriberStatus } },
//       { new: true }
//     );

//     if (!updatedAlert) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to update subscription" });
//     }

//     if (newSubscriberStatus) {
//       const slackResult = await sendSlackNotificationToUser(
//         req.user.EmailAddress,
//         "You have successfully subscribed to Slack alerts."
//       );

//       if (!slackResult.success) {
//         return res.status(slackResult.statusCode).json({
//           success: false,
//           message: slackResult.message,
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: "Slack Subscription Subscribe Successfully.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Slack Subscription Unsubscribe Successfully.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//working api for both slack and email

const postSlackAlerts = async (req, res, next) => {
  try {
    const { UserId } = req.user;
    const { Type } = req.body;

    if (!UserId || !["slack", "email"].includes(Type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
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

    if (Type === "slack") {
      const slackIntegrationCheck = await getUserIdByEmail(
        req.user.EmailAddress
      );

      if (!slackIntegrationCheck.success) {
        return res.status(slackIntegrationCheck.statusCode).json({
          success: false,
          message: slackIntegrationCheck.message,
        });
      }
    }

    const newSubscriberStatus = !currentAlert.Subscriber;

    const updatedAlert = await AlertSubscription.findOneAndUpdate(
      { UserId, "Alerts.Type": Type },
      { $set: { "Alerts.$.Subscriber": newSubscriberStatus } },
      { new: true }
    );

    if (!updatedAlert) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update subscription" });
    }

    if (Type === "slack" && newSubscriberStatus) {
      const slackResult = await sendSlackNotificationToUser(
        req.user.EmailAddress,
        "You have successfully subscribed to Slack alerts."
      );

      if (!slackResult.success) {
        return res.status(slackResult.statusCode).json({
          success: false,
          message: slackResult.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${Type.charAt(0).toUpperCase() + Type.slice(1)} Subscription ${
        newSubscriberStatus ? "Subscribe" : "Unsubscribe"
      } Successfully.`,
    });
  } catch (error) {
    next(error);
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

    return res.status(updatedAlerts ? 200 : 404).json({
      success: !!updatedAlerts,
      data: updatedAlerts || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlerts,
  postSlackAlerts,
  postFailureAlerts,
};
