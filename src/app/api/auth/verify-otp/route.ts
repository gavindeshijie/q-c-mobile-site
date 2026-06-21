import { NextResponse } from "next/server";

import {
  firstZodMessage,
  formatSupabaseAuthError,
  sanitizeAuthErrorDetail,
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
      {
        ok: false,
        code: "INVALID_OTP",
        message: firstZodMessage(parsed.error),
      },
      { status: 400 },
    );
  }

  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "AUTH_NOT_CONFIGURED",
        message: "认证服务暂未配置，请检查 Supabase 环境变量。",
        debug: clientResult.message,
      },
      { status: 503 },
    );
  }

  const { data, error } = await clientResult.supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });

  if (error) {
    const debug = sanitizeAuthErrorDetail(error.message);

    console.error("[auth/verify-otp] Supabase error", {
      message: debug,
      name: error.name,
      status: error.status,
    });

    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_OTP",
        message: formatSupabaseAuthError("验证码登录失败", error.message),
        debug,
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
