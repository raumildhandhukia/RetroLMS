const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (mailOptions) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_GMAIL,
      pass: process.env.SENDER_GMAIL_APP_PASSWORD,
    },
  });
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {}
};

module.exports = {
  sendMail,
};
