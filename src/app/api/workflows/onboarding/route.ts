import { serve } from "@upstash/workflow/nextjs";
import { InitialPayload, UserState } from "../../../../../types";
import { THIRTY_DAYS_IN_MS, THREE_DAYS_IN_MS } from "@/constants";
import { sendEmail } from "@/lib/email";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { qSendEmail } from "@/lib/workflow";

export const { POST } = serve<InitialPayload>(async (context) => {
  const { email, name } = context.requestPayload;

  await context.run("new-signup", async () => {
    await qSendEmail({
      to: email,
      name: name,
      subject: "Welcome to our platform",
      text: `Hello ${name}`,
    });
  });

  await context.sleep("wait-for-3-days", THREE_DAYS_IN_MS);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await qSendEmail({
          to: email,
          name: name,
          subject: "Are you still there?",
          text: `Hello ${name}`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await qSendEmail({
          to: email,
          name: name,
          subject: "Welcome back",
          text: `Welcome ${name}`,
        });
      });
    }
    await context.sleep("wait-for-1-month", THIRTY_DAYS_IN_MS);
  }
});

export const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return "non-active";
  }

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - lastActivityDate.getTime();

  if (timeDifference > THREE_DAYS_IN_MS && timeDifference < THIRTY_DAYS_IN_MS) {
    return "non-active";
  }
  return "active";
};
