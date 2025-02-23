import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/email";
type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  name: string;
};

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const THIRTY_DAYS_IN_MS = ONE_DAY_IN_MS * 30;

const getUserState = async (email: string): Promise<UserState> => {
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

export const { POST } = serve<InitialData>(async (context) => {
  const { email, name } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
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
        await sendEmail({
          to: email,
          name: name,
          subject: "Are you still there?",
          text: `Hello ${name}`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
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
