import { betterAuth, BetterAuthOptions } from "better-auth";
import { db } from "@/database/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/database/schema";
import config from "./config";
import { sendEmail } from "./email";
import { redis } from "@/database/redis";
import { openAPI, jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

const {
  env: {
    github: { clientId: githubClientId, clientSecret: githubClientSecret },
  },
} = config;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    usePlural: true,
  }),
  user: {
    additionalFields: {
      status: {
        type: "string",
        defaultValue: "PENDING",
      },
      universityId: {
        type: "number",
      },
      universityCard: {
        type: "string",
      },
      lastActivityDate: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendEmail({
        name: user.name,
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password:\n${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("メール送信");
      await sendEmail({
        name: user.name,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      mapProfileToUser: async (profile) => {
        console.log("profile", profile);
        return {
          status: "APPROVED",
        };
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 1,
    },
  },
  rateLimit: {
    window: 10,
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 60 * 60,
        max: 3,
      },
    },
  },
  secondaryStorage: {
    get: async (key: string) => {
      console.log("redis key", key);
      const value = (await redis.get(key)) as object | null;
      if (!value) return null;
      console.log("redis value", typeof value);
      return JSON.stringify(value);
    },
    set: async (key: string, value: string, ttl) => {
      if (ttl) await redis.set(key, value);
    },
    delete: async (key: string) => {
      await redis.del(key);
    },
  },
  plugins: [
    nextCookies(),
    // openAPI(),
    // jwt({
    //   jwks: {
    //     keyPairConfig: {
    //       alg: "EdDSA",
    //       crv: "Ed25519",
    //     },
    //   },
    //   jwt: {
    //     issuer: "https://gen_ai_app.com",
    //     audience: "https://user.com",
    //     expirationTime: "1h",
    //     definePayload: (data) => {
    //       return {
    //         id: data.user.id,
    //         email: data.user.email,
    //         role: data.user.role,
    //       };
    //     },
    //   },
    // }),
  ],
} satisfies BetterAuthOptions);
