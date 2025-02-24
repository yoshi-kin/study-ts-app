import AuthForm from "@/components/AuthForm";

import { signInSchema } from "@/lib/validations";
import React from "react";

const Page = () => {
  return <AuthForm type="SIGN_IN" />;
};

export default Page;
