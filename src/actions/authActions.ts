"use server";
import { auth } from "@/lib/auth";
import config from "@/lib/config";
import { workflowClient } from "@/lib/workflow";

interface SignUpProps {
  name: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface SignInProps {
  email: string;
  password: string;
}

export const signUp = async ({
  name,
  email,
  password,
  universityId,
  universityCard,
}: SignUpProps) => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
        universityId: universityId,
        universityCard: universityCard,
      },
      asResponse: true,
    });

    if (response.status !== 200) throw new Error("Failed to sign up");

    const { workflowRunId } = await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/onboarding`,
      body: {
        name: name,
        email: email,
      },
      // workflowRunId: "",
      // retries: 3,
    });
    return {
      status: 200,
      message: "Sign up successful",
    };
  } catch (error: any) {
    return {
      status: error?.status || 500,
      message: error?.message || "API Error",
    };
  }
};

export const signIn = async ({ email, password }: SignInProps) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
      asResponse: true,
    });

    if (response.status !== 200) throw new Error("Failed to sign up");
    return {
      status: 200,
      message: "Sign up successful",
    };
  } catch (error: any) {
    return {
      status: error?.status || 500,
      message: error?.message || "API Error",
    };
  }
};
