import { NextResponse } from "next/server";

import {
  firstZodMessage,
  loginSchema,
  normalizeAuthError,
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

  const parsed = loginSchema.safeParse(body);

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

  const { data, error } = await clientResult.supabase.auth.signInWithPassword(
    parsed.data,
  );

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: normalizeAuthError(error.message, "邮箱或密码不正确。"),
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
