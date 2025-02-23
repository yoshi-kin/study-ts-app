import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.qstash.qstashUrl,
  token: config.env.qstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.qstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resend.token }),
    },
    body: {
      from: "",
      to: [""],
      subject: "hello world",
      html: message,
    },
  });
};
