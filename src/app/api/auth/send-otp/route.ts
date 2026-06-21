import { NextResponse } from "next/server";

import {
  classifyOtpSendRateLimit,
  firstZodMessage,
  formatSupabaseAuthError,
  sanitizeAuthErrorDetail,
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
      {
        ok: false,
        code: "INVALID_EMAIL",
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

  const { error } = await clientResult.supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    const debug = sanitizeAuthErrorDetail(error.message);
    const rateLimit = classifyOtpSendRateLimit(error.message, error.status);

    console.error("[auth/send-otp] Supabase error", {
      message: debug,
      name: error.name,
      status: error.status,
    });

    return NextResponse.json(
      {
        ok: false,
        code: rateLimit?.code ?? "SUPABASE_ERROR",
        message: rateLimit?.message ?? "验证码发送失败，请稍后重试。",
        retryAfterSeconds: rateLimit?.retryAfterSeconds,
        debug: rateLimit?.debug ?? formatSupabaseAuthError("Supabase", error.message),
      },
      { status: rateLimit ? 429 : error.status || 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "验证码已发送，请检查邮箱。",
    user: null,
  });
}
