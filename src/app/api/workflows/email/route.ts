import { sendEmail } from "@/lib/email";
import { AnyForeignKeyBuilder } from "drizzle-orm/pg-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, from, subject, text } = body;
    await sendEmail({ to, subject, text });
    return NextResponse.json({
      status: 200,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: error?.status || 500,
      error: {
        message: error?.message || "Failed to process request",
      },
    });
  }
}
