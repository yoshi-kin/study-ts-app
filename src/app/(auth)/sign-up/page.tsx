import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import React from "react";

const Page = () => {
  return <AuthForm type="SIGN_UP" />;
};

export default Page;
