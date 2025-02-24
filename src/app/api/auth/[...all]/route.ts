import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, { protectSignup } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",
        allow: [],
      },
      rateLimit: {
        mode: "LIVE",
        interval: "10m",
        max: 5,
      },
    }),
  ],
});

const betterAuthHandlers = toNextJsHandler(auth.handler);
const ajProtectedPOST = async (req: NextRequest) => {
  const body = await req.clone().json();
  const { email } = body;
  console.log("email", email);
  const decision = await aj.protect(req, { email });
  console.log("decision", decision.isDenied());

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      let message = "";
      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "email address format is invalid. Is there a typo?";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "we do not allow disposable email addresses";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message =
          "your email domain does not have an MX record. Is there a typo?";
      } else {
        message = "invalid email.";
      }

      return NextResponse.json(
        {
          message,
          reason: decision.reason,
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }
  }
  return betterAuthHandlers.POST(
    new NextRequest(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(body),
    })
  );
};

export { ajProtectedPOST as POST };
export const { GET } = betterAuthHandlers;
