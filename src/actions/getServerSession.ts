"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  const headersInstance = new Headers(await headers());
  // console.log("cookie", headersInstance.get("cookie"));
  const session = await auth.api.getSession({
    headers: headersInstance,
  });
  return session;
});
