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
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "302prop@keybrains.in",
        pass: "prdiobhkbueguwzt",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: "302prop@keybrains.in",
      to: email,
      subject: "SEO Validation: Failure Reasons",
      //   html: `
      //       <h1>🚨 SEO Validation Failure</h1>
      //       <p>The validation process for the following links encountered issues:</p>
      //       <p><strong>Source URL:</strong> ${sourceUrl}</p>
      //       <p><strong>Search URL:</strong> ${searchUrl}</p>
      //       <p><strong>Failure Reasons:</strong></p>
      //       <ul>
      //         ${failureReasons.map((reason) => `<li>${reason}</li>`).join("")}
      //       </ul>
      //     `,
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
