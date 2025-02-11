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
//       "Alerts.Type": { $in: ["slack", "email"] },
//     });

//     if (!userAlert) {
//       console.log(`No alerts found for user ${userId}.`);
//       return { success: false, message: "No alerts configured for this user." };
//     }

//     const slackAlert = userAlert.Alerts.find((alert) => alert.Type === "slack");
//     if (slackAlert?.Subscriber) {
//       const slackMessage = `Source URL: ${sourceUrl}\nSearch URL: ${searchUrl}\nFailure Reasons:\n- ${failureReasons.join(
//         "\n- "
//       )}`;

//       const slackResult = await sendSlackNotificationToUser(
//         email,
//         slackMessage
//       );
//       if (!slackResult.success) {
//         console.error(
//           `Failed to send Slack notification for source URL ${sourceUrl}: ${slackResult.message}`
//         );
//       }
//     }

//     const emailAlert = userAlert.Alerts.find((alert) => alert.Type === "email");
//     if (emailAlert?.Subscriber) {
//       try {
//         await sendFailureReasonsMail(
//           email,
//           sourceUrl,
//           searchUrl,
//           failureReasons
//         );
//         console.log(`Email notification sent successfully to ${email}.`);
//       } catch (emailError) {
//         console.error("Failed to send email notification:", emailError.message);
//       }
//     }

//     return { success: true, message: "Notifications processed successfully." };
//   } catch (error) {
//     console.error("Error sending notifications:", error.message);
//     return { success: false, message: error.message };
//   }
// };

const shouldSendAlert = (lastAlertTime, frequency) => {
  if (!lastAlertTime) return true;

  const now = moment();
  const lastSent = moment(lastAlertTime);

  switch (frequency) {
    case "only_one_time":
      return false;
    case "per_hour":
      return now.diff(lastSent, "hours") >= 1;
    case "per_5_hours":
      return now.diff(lastSent, "hours") >= 5;
    case "per_day":
      return now.diff(lastSent, "days") >= 1;
    case "per_minute":
      return now.diff(lastSent, "minutes") >= 1;
    default:
      return true;
  }
};

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

    let alertSent = false;

    for (const alert of userAlert.Alerts) {
      if (alert.Subscriber) {
        const lastAlertTime = alert.LastSentAt || null;
        const shouldSend = shouldSendAlert(lastAlertTime, alert.Frequency);

        if (!shouldSend) {
          console.log(
            `Skipping ${alert.Type} alert for ${email} due to frequency settings.`
          );
          continue;
        }

        if (alert.Type === "slack") {
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
          } else {
            alert.LastSentAt = new Date();
            alertSent = true;
          }
        }

        if (alert.Type === "email") {
          try {
            await sendFailureReasonsMail(
              email,
              sourceUrl,
              searchUrl,
              failureReasons
            );
            console.log(`Email notification sent successfully to ${email}.`);
            alert.LastSentAt = new Date();
            alertSent = true;
          } catch (emailError) {
            console.error(
              "Failed to send email notification:",
              emailError.message
            );
          }
        }
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

// const postSlackAlerts = async (req, res, next) => {
//   try {
//     const { UserId } = req.user;  // Ensure UserId is available from the authenticated user
//     const { Type, Frequency } = req.body;  // Getting Type and Frequency from request body

//     // Validate the incoming data
//     if (!UserId || !["slack", "email"].includes(Type)) {
//       return res.status(400).json({ success: false, message: "Invalid Type" });
//     }

//     if (!Frequency) {
//       return res.status(400).json({ success: false, message: "Frequency is required" });
//     }

//     // Find existing alert subscription for the user and specified type
//     const userAlert = await AlertSubscription.findOne({
//       UserId,
//       "Alerts.Type": Type,
//     });

//     if (!userAlert) {
//       return res.status(404).json({
//         success: false,
//         message: `${Type.charAt(0).toUpperCase() + Type.slice(1)} alert not found`,
//       });
//     }

//     // Find the current alert
//     const currentAlert = userAlert.Alerts.find((alert) => alert.Type === Type);

//     // Handle Slack-specific logic (if it's a Slack subscription)
//     if (Type === "slack") {
//       const slackIntegrationCheck = await getUserIdByEmail(req.user.EmailAddress);
//       if (!slackIntegrationCheck.success) {
//         return res.status(slackIntegrationCheck.statusCode).json({
//           success: false,
//           message: slackIntegrationCheck.message,
//         });
//       }
//     }

//     // Toggle subscription status (subscribe/unsubscribe)
//     const newSubscriberStatus = !currentAlert.Subscriber;

//     // Update the subscription status in the database
//     const updatedAlert = await AlertSubscription.findOneAndUpdate(
//       { UserId, "Alerts.Type": Type },
//       {
//         $set: {
//           "Alerts.$.Subscriber": newSubscriberStatus,
//           "Alerts.$.Frequency": Frequency,  // Update frequency as well
//         },
//       },
//       { new: true }
//     );

//     if (!updatedAlert) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to update subscription",
//       });
//     }

//     // Send Slack notification if the subscription is successful and it's for Slack
//     if (Type === "slack" && newSubscriberStatus) {
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
//     }

//     // Return success response
//     return res.status(200).json({
//       success: true,
//       message: `${Type.charAt(0).toUpperCase() + Type.slice(1)} Subscription ${
//         newSubscriberStatus ? "Subscribed" : "Unsubscribed"
//       } Successfully.`,
//     });

//   } catch (error) {
//     next(error);  // Pass errors to the next middleware (error handler)
//   }
// };

const postSlackAlerts = async (req, res, next) => {
  try {
    const { UserId } = req.user;
    const { Type, Frequency } = req.body;

    console.log("Received Type:", Type);
    console.log("Received Frequency:", Frequency);

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
      {
        $set: {
          "Alerts.$.Subscriber": newSubscriberStatus,
          "Alerts.$.Frequency": Frequency,
        },
      },
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
        newSubscriberStatus ? "Subscribed" : "Unsubscribed"
      } Successfully. Frequency set to ${Frequency}.`,
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
