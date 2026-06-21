import { NextResponse } from "next/server";

import {
  firstZodMessage,
  normalizeAuthError,
  toAuthUser,
  verifyCodeSchema,
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

  const parsed = verifyCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: firstZodMessage(parsed.error) },
      { status: 400 },
    );
  }

  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      { ok: false, message: clientResult.message },
      { status: 503 },
    );
  }

  const { data, error } = await clientResult.supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.code,
    type: "email",
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: normalizeAuthError(error.message, "验证码不正确或已过期，请重新获取。"),
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "登录成功",
    user: toAuthUser(data.user?.email),
  });
}
