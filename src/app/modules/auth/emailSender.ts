import nodemailer from "nodemailer";
import config from "../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.senderEmail,
      pass: config.app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Health Care" <programarreza@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Your Password - Link Valid for 10 Minutes", // Subject line
    // text: "Hello world?", // plain text body
    html,
  });

  //   console.log("Message sent: %s", info.messageId);
};

export default emailSender;
