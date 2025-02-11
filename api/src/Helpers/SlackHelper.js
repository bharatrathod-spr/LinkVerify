const { WebClient } = require("@slack/web-api");
require("dotenv").config();

const token = process.env.SLACK_TOKEN_KEY;

const web = new WebClient(token);

// Function to get User ID by Email Address
async function getUserIdByEmail(EmailAddress) {
  try {
    const result = await web.users.lookupByEmail({ email: EmailAddress });

    if (result.user && result.user.is_email_confirmed) {
      return {
        success: true,
        statusCode: 200,
        userId: result.user.id,
        message: `User ID for ${EmailAddress} fetched successfully.`,
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        message: `Email ${EmailAddress} exists but is not confirmed in Slack.`,
      };
    }
  } catch (error) {
    if (error.data && error.data.error === "users_not_found") {
      return {
        success: false,
        statusCode: 404,
        message: `User with EmailAddress ${EmailAddress} is not integrated with Slack. Cannot send Slack message`,
      };
    } else {
      return {
        success: false,
        statusCode: 500,
        message: `Error fetching user by EmailAddress: ${error.message}`,
      };
    }
  }
}

async function sendSlackNotificationToUser(EmailAddress, messageText) {
  const userResult = await getUserIdByEmail(EmailAddress);

  if (!userResult.success) {
    console.log("Slack Notification Error:", userResult.message);
    return userResult;
  }

  const userId = userResult.userId;

  try {
    const result = await web.chat.postMessage({
      channel: userId,
      text: messageText,
    });

    const successMessage = "Message sent successfully!";

    return {
      success: true,
      statusCode: 200,
      message: successMessage,
      timestamp: result.ts,
    };
  } catch (error) {
    const errorMessage = `Error sending message: ${error.message}`;
    console.error(errorMessage);

    return {
      success: false,
      statusCode: 500,
      message: errorMessage,
    };
  }
}

module.exports = { sendSlackNotificationToUser, getUserIdByEmail };
