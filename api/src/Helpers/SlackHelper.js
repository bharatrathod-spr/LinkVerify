const { WebClient } = require("@slack/web-api");
require("dotenv").config();

const token = process.env.SLACK_TOKEN_KEY;

if (!token) {
  console.error(
    "Slack token is missing. Please check your environment variables."
  );
  process.exit(1);
}

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
    if (error.data) {
      switch (error.data.error) {
        case "invalid_auth":
          return {
            success: false,
            statusCode: 401,
            message:
              "Slack authentication failed. The token is invalid or expired.",
          };
        case "users_not_found":
          return {
            success: false,
            statusCode: 404,
            message: `User with Email ${EmailAddress} is not found in Slack.`,
          };
        case "ratelimited":
          return {
            success: false,
            statusCode: 429,
            message: "Slack API rate limit exceeded. Please try again later.",
          };
        default:
          return {
            success: false,
            statusCode: 500,
            message: `Slack API error: ${error.data.error}`,
          };
      }
    } else {
      return {
        success: false,
        statusCode: 500,
        message: `Unexpected error while fetching user by Email: ${error.message}`,
      };
    }
  }
}

// Function to send Slack message
async function sendSlackNotificationToUser(EmailAddress, messageText) {
  const userResult = await getUserIdByEmail(EmailAddress);

  if (!userResult.success) {
    console.error("Slack Notification Error:", userResult.message);
    return userResult;
  }

  const userId = userResult.userId;

  try {
    const result = await web.chat.postMessage({
      channel: userId,
      text: messageText,
    });

    return {
      success: true,
      statusCode: 200,
      message: "Message sent successfully!",
      timestamp: result.ts,
    };
  } catch (error) {
    if (error.data) {
      switch (error.data.error) {
        case "invalid_auth":
          return {
            success: false,
            statusCode: 401,
            message:
              "Slack authentication failed. The token is invalid or expired.",
          };
        case "ratelimited":
          return {
            success: false,
            statusCode: 429,
            message: "Slack API rate limit exceeded. Please try again later.",
          };
        case "channel_not_found":
          return {
            success: false,
            statusCode: 404,
            message: `Slack channel for user ${EmailAddress} not found.`,
          };
        default:
          return {
            success: false,
            statusCode: 500,
            message: `Slack API error: ${error.data.error}`,
          };
      }
    } else {
      return {
        success: false,
        statusCode: 500,
        message: `Unexpected error while sending Slack message: ${error.message}`,
      };
    }
  }
}

module.exports = { sendSlackNotificationToUser };
