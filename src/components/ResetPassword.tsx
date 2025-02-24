"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Loader2 } from "lucide-react";
import { validateResetPassword } from "@/actions/validateActions";
import { resetPasswordSchema } from "@/lib/validations";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { redirect } from "next/navigation";

const ResetPassword = () => {
  const token = new URLSearchParams(window.location.search).get("token");
  const [lastResult, formAction, isPending] = useActionState<
    Awaited<ReturnType<typeof validateResetPassword> | null>,
    FormData
  >(async (prev, formData) => {
    console.log("action");
    if (!token) return null;
    return await validateResetPassword(prev, formData, token);
  }, null);
  const [form, fields] = useForm({
    // constraint: getZodConstraint(resetPasswordSchema),
    lastResult,
    defaultValue: {
      newPassword: "",
      confirmPassword: "",
    },
    onValidate({ formData }) {
      console.log(parseWithZod(formData, { schema: resetPasswordSchema }));
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
  });

  useEffect(() => {
    if (lastResult?.status === "success") redirect("/sign-in");
  }, [lastResult]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
      <form {...getFormProps(form)} action={formAction} className="space-y-6 ">
        <div>
          <Label className="mb-10">New Password</Label>
          <Input
            {...getInputProps(fields.newPassword, { type: "password" })}
            key={fields.newPassword.key}
            className="form-input"
          />
          <p className="text-xs text-destructive">
            {fields.newPassword.errors || lastResult?.error?.messages?.join("")}
          </p>
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input
            {...getInputProps(fields.confirmPassword, { type: "password" })}
            key={fields.confirmPassword.key}
            className="form-input"
          />
          <p className="text-xs text-destructive">
            {fields.confirmPassword.errors ||
              lastResult?.error?.messages?.join("")}
          </p>
        </div>
        <Button type="submit" className="form-btn" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size={40} />}
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
