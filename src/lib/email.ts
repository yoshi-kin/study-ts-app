"use server";

// import { Resend } from "resend";
// import EmailTemplate from "@/components/EmailTemplate";
// import config from "./config";
// import { ReactNode } from "react";
import nodemailer from "nodemailer";
import { SendMailOptions } from "nodemailer";

interface Email {
  name: string;
  to: string;
  subject: string;
  text: string;
}
// Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "26243ac3bdeff1",
    pass: "fc26f3c8abf1a0",
  },
});

export async function sendEmail({ name, to, subject, text }: Email) {
  const mailOptions: SendMailOptions = {
    from: "from@example.com",
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// const resend = new Resend(config.env.resend.token);
// export async function sendEmail({ name, to, subject, text }: Email) {
//   const { data, error } = await resend.emails.send({
//     from: "smtp.resend.com",
//     to: to,
//     subject: subject,
//     react: EmailTemplate({ name: name, text: text }) as ReactNode,
//   });

//   console.log("メール送信データ", data);

//   if (error) {
//     console.error("メール送信エラー", error);
//     return {
//       status: 400,
//       message: "Error sending email",
//     };
//   }

//   return data;
// }
