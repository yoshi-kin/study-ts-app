import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import config from "./config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.qstash.qstashUrl,
  token: config.env.qstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.qstash.qstashToken,
});

export const qSendEmail = async ({
  to,
  name,
  subject,
  text,
}: {
  to: string;
  name?: string;
  subject: string;
  text: string;
}) => {
  await qstashClient.publishJSON({
    url: `${config.env.apiEndpoint}/api/workflows/email`,
    body: {
      name: name,
      to: to,
      subject: subject,
      text: text,
    },
  });
};
