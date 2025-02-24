import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number().optional(),
  universityCard: z.string(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password is too short" }),
    confirmPassword: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password is too short" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
});
