const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error("No recipients defined");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Cửa hàng điện tử" <${process.env.EMAIL_NAME}>`,
    to,
    subject: subject || "Thông báo quên mật khẩu",
    html: html || "<b>Đây là nội dung email dạng HTML.</b>",
  });

  return info;
};

module.exports = sendMail;
