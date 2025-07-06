const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendInviteEmail = async (toEmail, wishlistName) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `You're invited to ${wishlistName}`,
    text: `Join wishlist "${wishlistName}"!`
  });
};

module.exports = { sendInviteEmail };
