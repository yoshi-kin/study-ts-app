"use client";
import { validateForgotPassword } from "@/actions/validateActions";
import { forgotPasswordSchema } from "@/lib/validations";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import React, { useActionState, useEffect } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [lastResult, formAction, isPending] = useActionState<
    Awaited<ReturnType<typeof validateForgotPassword> | null>,
    FormData
  >(async (prev, formData) => {
    return await validateForgotPassword(prev, formData);
  }, null);
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      email: "",
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: forgotPasswordSchema });
    },
  });

  useEffect(() => {
    if (lastResult?.status === "success") {
      toast({
        title:
          "Send email to reset your password successfully.\nPlease check your email.",
      });
    }
  }, [lastResult, toast]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
      <form {...getFormProps(form)} action={formAction} className="space-y-6 ">
        <div>
          <Label className="mb-10">Your Email</Label>
          <Input
            {...getInputProps(fields.email, { type: "text" })}
            key={fields.email.key}
            className="form-input"
          />
          <p className="text-xs text-destructive">
            {fields.email.errors || lastResult?.error?.messages?.join("")}
          </p>
        </div>
        <Button type="submit" className="form-btn" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" size={40} />}
          Send Email
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
