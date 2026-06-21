import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      { ok: false, message: clientResult.message },
      { status: 503 },
    );
  }

  await clientResult.supabase.auth.signOut();

  return NextResponse.json({
    ok: true,
    message: "已退出登录",
  });
}
