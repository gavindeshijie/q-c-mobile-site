import { NextResponse } from "next/server";

import {
  firstZodMessage,
  formatSupabaseAuthError,
  sendOtpSchema,
} from "@/lib/auth/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "提交内容有误，请检查后重试。" },
      { status: 400 },
    );
  }

  const parsed = sendOtpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: firstZodMessage(parsed.error) },
      { status: 400 },
    );
  }

  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      { ok: false, message: `验证码发送失败：${clientResult.message}` },
      { status: 503 },
    );
  }

  const { error } = await clientResult.supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[auth/send-otp] Supabase error", {
      message: error.message,
      name: error.name,
      status: error.status,
    });

    return NextResponse.json(
      {
        ok: false,
        message: formatSupabaseAuthError("验证码发送失败", error.message),
      },
      { status: error.status || 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "验证码已发送，请检查邮箱。",
    user: null,
  });
}
