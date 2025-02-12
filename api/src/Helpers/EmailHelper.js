const nodemailer = require("nodemailer");
require("dotenv").config();

const sendFailureReasonsMail = async (
  email,
  sourceUrl,
  searchUrl,
  failureReasons
) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "mail.keybrainstech.com",
      port: 465,
      secure: true,
      auth: {
        user: "shivamshukla@keybrainstech.com",
        pass: "4Y=&_kC+z!kH",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "shivamshukla@keybrainstech.com",
      to: email,
      subject: "SEO Validation: Failure Reasons",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="text-align: center; color: #e74c3c; margin-bottom: 20px;">🚨 SEO Validation Failure</h2>
    <p style="font-size: 16px; margin-bottom: 10px;">
      The validation process for the following links encountered issues:
    </p>
    <div style="margin-bottom: 15px;">
      <p style="font-size: 15px; margin: 5px 0;">
        <b>Source URL:</b> <a href="${sourceUrl}" style="color: #3498db; text-decoration: none;">${sourceUrl}</a>
      </p>
      <p style="font-size: 15px; margin: 5px 0;">
        <b>Search URL:</b> <a href="${searchUrl}" style="color: #3498db; text-decoration: none;">${searchUrl}</a>
      </p>
    </div>
    <p style="font-size: 15px; margin-bottom: 10px;">Failure Reasons:</p>
    <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 20px;">
      ${failureReasons
        .map(
          (reason) =>
            `<li style="font-size: 14px; margin-bottom: 5px; color: #555;">${reason}</li>`
        )
        .join("")}
    </ul>

    <footer style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">
      ©${new Date().getFullYear()}. All rights reserved.
    </footer>
  </div>
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
};

module.exports = sendFailureReasonsMail;

// const nodemailer = require("nodemailer");
// const MailConfiguration = require("../models/mailConfigModel");

// const sendFailureReasonsMail = async (
//   userId,
//   email,
//   sourceUrl,
//   searchUrl,
//   failureReasons
// ) => {
//   try {
//     const userMailConfig = await MailConfiguration.findOne({ UserId: userId });

//     if (!userMailConfig) {
//       console.log("No mail configuration found for user. Email not sent.");
//       return { success: false, message: "Mail configuration not set." };
//     }

//     let transporter = nodemailer.createTransport({
//       host: userMailConfig.host,
//       port: userMailConfig.port,
//       secure: userMailConfig.secure,
//       auth: {
//         user: userMailConfig.user,
//         pass: userMailConfig.pass,
//       },
//       tls: { rejectUnauthorized: false },
//     });

//     const mailOptions = {
//       from: userMailConfig.user,
//       to: email,
//       subject: "SEO Validation: Failure Reasons",
//       html: `<div>
//         <h2>🚨 SEO Validation Failure</h2>
//         <p>The validation process for the following links encountered issues:</p>
//         <p><b>Source URL:</b> <a href="${sourceUrl}">${sourceUrl}</a></p>
//         <p><b>Search URL:</b> <a href="${searchUrl}">${searchUrl}</a></p>
//         <p><b>Failure Reasons:</b></p>
//         <ul>${failureReasons
//           .map((reason) => `<li>${reason}</li>`)
//           .join("")}</ul>
//       </div>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.response);
//     return { success: true, message: "Email sent successfully." };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return { success: false, message: "Failed to send email." };
//   }
// };

// module.exports = sendFailureReasonsMail;
