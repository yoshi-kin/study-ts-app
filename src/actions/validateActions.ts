"use server";

import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";
import { parseWithZod } from "@conform-to/zod";
import { auth } from "@/lib/auth";
import { type SubmissionResult } from "@conform-to/react";

export async function validateResetPassword(
  _: unknown,
  formData: FormData,
  token: string
) {
  console.log("action validation");
  const submission = parseWithZod(formData, { schema: resetPasswordSchema });
  if (submission.status !== "success") {
    console.log("Invalid form submission", submission.error);
    return submission.reply();
  }

  try {
    const { status } = await auth.api.resetPassword({
      body: {
        newPassword: formData.get("newPassword") as string,
        token,
      },
    });

    if (!status) {
      throw new Error("Error resetting password");
    }
    console.log("Password reset successfully");
    return submission.reply();
  } catch (error: any) {
    console.log("Error resetting password", error);
    return {
      status: "error",
      payload: formData,
      error: { messages: [error] },
    } as SubmissionResult<string[]>;
  }
}

export async function validateForgotPassword(_: unknown, formData: FormData) {
  console.log("action forgot validation");
  const submission = parseWithZod(formData, { schema: forgotPasswordSchema });
  if (submission.status !== "success") {
    console.log("Invalid form submission", submission.error);
    return submission.reply();
  }

  try {
    const { status } = await auth.api.forgetPassword({
      body: {
        email: formData.get("email") as string,
        redirectTo: "/reset-password",
      },
    });

    if (!status) throw new Error("Error sending email");

    console.log("Password reset successfully");
    return submission.reply();
  } catch (error) {
    console.log("Error sending email");
    return {
      status: "error",
      payload: formData,
      error: { messages: ["Error sending email"] },
    } as SubmissionResult<string[]>;
  }
}
