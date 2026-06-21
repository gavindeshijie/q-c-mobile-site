import { NextResponse } from "next/server";

import {
  firstZodMessage,
  formatSupabaseAuthError,
  toAuthUser,
  verifyOtpSchema,
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

  const parsed = verifyOtpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: firstZodMessage(parsed.error) },
      { status: 400 },
    );
  }

  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      { ok: false, message: `验证码登录失败：${clientResult.message}` },
      { status: 503 },
    );
  }

  const { data, error } = await clientResult.supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });

  if (error) {
    console.error("[auth/verify-otp] Supabase error", {
      message: error.message,
      name: error.name,
      status: error.status,
    });

    return NextResponse.json(
      {
        ok: false,
        message: formatSupabaseAuthError("验证码登录失败", error.message),
      },
      { status: error.status || 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "登录成功",
    user: toAuthUser(data.user?.email),
  });
}
