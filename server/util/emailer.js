import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export const sendEmail = async (to, subject, text) => {
    try {
      const info = await transporter.sendMail({
        from: `<no-reply@bingoloids.com>`,
        to,
        subject,
        text, 
      });
   
      console.log("Message sent: %s", info.messageId);
      console.log("Preview Email: %s", nodemailer.getTestMessageUrl(info));
      return { success: true, message: "Email sent successfully", previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
      console.error("Error sending email: ", error);
      return { success: false, message: "Failed to send email" };
    }
  };