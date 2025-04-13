import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const email = process.env.APP_EMAIL;
const password = process.env.APP_PASSWORD;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass: password,
  },
});

export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: email,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};