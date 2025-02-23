import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie, Session } from "better-auth";
import { betterFetch } from "@better-fetch/fetch";

// export async function middleware(request: NextRequest) {
//   // const sessionCookie = getSessionCookie(request);
//   console.log(request);
//   const { data: session } = await betterFetch<Session>(
//     "/api/auth/get-session",
//     {
//       baseURL: request.nextUrl.origin,
//       headers: {
//         cookie: request.headers.get("cookie") || "",
//       },
//     }
//   );
//   if (!session) {
//     console.log("request url", request.url);
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/"],
// };
