import { NextResponse } from "next/server";

import {
  firstZodMessage,
  normalizeAuthError,
  registerSchema,
  toAuthUser,
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

  const parsed = registerSchema.safeParse(body);

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

  const { data, error } = await clientResult.supabase.auth.signUp(parsed.data);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: normalizeAuthError(error.message, "注册失败，请稍后重试。"),
      },
      { status: 400 },
    );
  }

  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return NextResponse.json(
      { ok: false, message: "该邮箱已注册，请直接登录。" },
      { status: 409 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: data.session
      ? "注册成功"
      : "注册成功，请到邮箱点击验证链接后再登录。",
    user: toAuthUser(data.user?.email),
  });
}
