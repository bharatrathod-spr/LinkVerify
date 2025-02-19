const nodemailer = require("nodemailer");
require("dotenv").config();

const sendFailureReasonsMail = async (
  email,
  sourceUrl,
  searchUrl,
  failureReasons,
  mailConfig
) => {
  return new Promise((resolve, reject) => {
    if (
      !mailConfig ||
      !mailConfig.Host ||
      !mailConfig.Port ||
      !mailConfig.User ||
      !mailConfig.Password ||
      !mailConfig.Mail
    ) {
      console.error("Mail configuration is missing or incomplete.");
      reject(new Error("Mail configuration is missing or incomplete."));
      return;
    }

    let transporter = nodemailer.createTransport({
      host: mailConfig.Host,
      port: mailConfig.Port,
      secure: mailConfig.Secure,
      auth: {
        user: mailConfig.User,
        pass: mailConfig.Password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: mailConfig.Mail,
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
              <b>Source Link:</b> <a href="${sourceUrl}" style="color: #3498db; text-decoration: none;">${sourceUrl}</a>
            </p>
            <p style="font-size: 15px; margin: 5px 0;">
              <b>Search Link:</b> <a href="${searchUrl}" style="color: #3498db; text-decoration: none;">${searchUrl}</a>
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
