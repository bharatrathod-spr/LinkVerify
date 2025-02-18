const axios = require("axios");
const cheerio = require("cheerio");
const robotsParser = require("robots-parser");
const moment = require("moment");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const cron = require("node-cron");

// Models
const Users = require("../models/userModel");
const Profiles = require("../models/profileModel");
const ProfileCount = require("../models/profileCountModel");
const AlertSubscription = require("../models/alertModel");

// Controllers
const { createLog } = require("../controllers/logsController");
const { postFailureAlerts } = require("../controllers/alertController");

// Winston logger setup
const logTransport = new DailyRotateFile({
  filename: "logs/validation-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "14d",
  debug: true,
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [logTransport, new winston.transports.Console()],
});

// Function to log messages
function log(message, title = "LinkValidation") {
  const timestamp = new Date().toISOString();
  const formattedMessage = `
Title: ${title}
Log: ${message}
Time: ${timestamp}
==================================================
  `;
  logger.info(formattedMessage);
}

// Update Profile Count
async function updateProfileCount(
  UserId,
  ValidationProfileId,
  isSuccess,
  responseTime
) {
  const formattedDate = moment().format("MMM DD");

  const profileCount = await ProfileCount.findOne({
    UserId,
    ValidationProfileId,
    Date: formattedDate,
  });

  const adjustedResponseTime = responseTime / 2;

  if (profileCount) {
    if (isSuccess) {
      profileCount.SuccessCount = (profileCount.SuccessCount || 0) + 1;
    } else {
      profileCount.FailureCount = (profileCount.FailureCount || 0) + 1;
    }
    profileCount.ResponseTime = adjustedResponseTime;
    await profileCount.save();
  } else {
    const newProfileCount = new ProfileCount({
      UserId,
      ValidationProfileId,
      SuccessCount: isSuccess ? 1 : 0,
      FailureCount: isSuccess ? 0 : 1,
      ResponseTime: adjustedResponseTime,
      Date: formattedDate,
    });

    await newProfileCount.save();
  }
}

// SEO and Link Validation
async function seoAndLinkValidate(url, searchUrl, UserId, ValidationProfileId) {
  const startTime = Date.now();
  let success = true;
  let failureReasons = [];

  try {
    console.log(`Validating URL: ${url} | Searching for: ${searchUrl}`);
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    console.log(`Response Status: ${response.status}`);

    if (response.status !== 200) {
      failureReasons.push(`HTTP error: ${response.status}`);
      success = false;
    }

    const $ = cheerio.load(response.data);

    const metaRobots = $('meta[name="robots"]').attr("content") || "not set";
    console.log("Meta Robots:", metaRobots);

    const hasNoFollowMeta = metaRobots
      ? metaRobots.includes("nofollow")
      : false;
    const hasNoIndexMeta = metaRobots ? metaRobots.includes("noindex") : false;

    const normalizeUrl = (inputUrl) => {
      return new URL(inputUrl, url)
        .toString()
        .replace(/\/$/, "")
        .replace("http://", "https://");
    };

    let linkExists = false;
    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        const absoluteUrl = normalizeUrl(href);
        const expectedUrl = normalizeUrl(searchUrl);
        if (absoluteUrl === expectedUrl) {
          linkExists = true;
        }
      }
    });

    if (!linkExists) {
      failureReasons.push(`Link to ${searchUrl} not found.`);
      success = false;
    }

    const robotsTxtUrl = new URL("/robots.txt", url).toString();
    try {
      const robotsTxtResponse = await axios.get(robotsTxtUrl);
      console.log(`Fetched robots.txt from: ${robotsTxtUrl}`);
      console.log("robots.txt Content:", robotsTxtResponse.data);
      const robots = robotsParser(robotsTxtUrl, robotsTxtResponse.data);
      if (!robots.isAllowed(url)) {
        failureReasons.push("URL is disallowed by robots.txt");
        success = false;
      }
    } catch (err) {
      console.log("Robots.txt not found or inaccessible.");
      failureReasons.push("Robots.txt not found or inaccessible.");
    }

    const responseTime = Date.now() - startTime;

    // Log Validation Result
    createLog({
      UserId,
      ValidationProfileId,
      IsSuccess: success,
      FailureReasons: failureReasons,
      ResponseTime: responseTime,
      MetaRobotsTags: {
        Follow: !hasNoFollowMeta,
        Index: !hasNoIndexMeta,
      },
      LastErrorAt: success ? null : new Date().toISOString(),
      LastSuccessAt: success ? new Date().toISOString() : null,
    });

    // Update Profile Count
    await updateProfileCount(
      UserId,
      ValidationProfileId,
      success,
      responseTime
    );

    return {
      LastErrorAt: success ? null : new Date().toISOString(),
      LastSuccessAt: success ? new Date().toISOString() : null,
      failureReasons,
    };
  } catch (error) {
    console.error("Validation Error:", error.message);

    const responseTime = Date.now() - startTime;

    createLog({
      UserId,
      ValidationProfileId,
      IsSuccess: false,
      FailureReasons: [error.message],
      ResponseTime: responseTime,
      MetaRobotsTags: { Follow: false, Index: false },
      LastErrorAt: new Date().toISOString(),
      LastSuccessAt: null,
    });

    await updateProfileCount(UserId, ValidationProfileId, false, responseTime);

    return {
      LastErrorAt: new Date().toISOString(),
      LastSuccessAt: null,
      failureReasons: [error.message],
    };
  }
}

function shouldSendAlert(lastAlertTime, frequency) {
  if (!lastAlertTime) return true;

  const now = new Date();
  const lastSent = new Date(lastAlertTime);
  const diff = now - lastSent;

  switch (frequency) {
    case "only_one_time":
      return false;
    case "per_minute":
      return diff >= 57 * 1000;
    case "per_hour":
      return diff >= 59 * 60 * 1000;
    case "per_5_hours":
      return diff >= 4.95 * 60 * 60 * 1000;
    case "per_day":
      return diff >= 23.9 * 60 * 60 * 1000;
    default:
      return true;
  }
}

const cronjob = async () => {
  try {
    log("Starting cron job...");

    const users = await Users.find({
      IsDelete: false,
      IsActive: true,
      Role: "user",
    });

    log(`Found ${users.length} active users to process.`);

    for (const user of users) {
      const profiles = await Profiles.find({
        UserId: user.UserId,
        IsDelete: false,
      });

      for (const profile of profiles) {
        const { SourceLink, SearchLink } = profile;

        const { LastSuccessAt, LastErrorAt, failureReasons } =
          await seoAndLinkValidate(
            SourceLink,
            SearchLink,
            user.UserId,
            profile.ValidationProfileId
          );

        if (failureReasons.length > 0) {
          const alertSettings = await AlertSubscription.findOne({
            UserId: user.UserId,
          });

          if (alertSettings && Array.isArray(alertSettings.Alerts)) {
            const alertTypes = [];

            for (const alert of alertSettings.Alerts) {
              if (alert.Subscriber) {
                const canSendAlert = shouldSendAlert(
                  alert.LastAlertTime,
                  alert.Frequency
                );
                if (canSendAlert && !alertTypes.includes(alert.Type)) {
                  alertTypes.push(alert.Type);
                }
              }
            }

            if (alertTypes.length > 0) {
              const alertResponse = await postFailureAlerts(
                user.EmailAddress,
                SourceLink,
                SearchLink,
                failureReasons,
                user.UserId,
                alertTypes
              );

              if (!alertResponse.success) {
                log(
                  `Alert failed for ${user.EmailAddress}: ${alertResponse.message}`
                );
              } else {
                for (const alert of alertSettings.Alerts) {
                  if (alertTypes.includes(alert.Type)) {
                    alert.LastAlertTime = new Date();
                  }
                }
                await alertSettings.save();
              }
            }
          } else {
            log(`No alerts found for user ${user.EmailAddress}.`);
          }
        }

        profile.LastErrorAt = LastErrorAt;
        profile.LastSuccessAt = LastSuccessAt;
        await profile.save();
      }
    }

    log("Cron job completed successfully.");
  } catch (error) {
    log(`Error during cron job: ${error.message}`);
  }
};

// cron.schedule("*/1 * * * *", () => {
//   cronjob();
// });

module.exports = cron;
