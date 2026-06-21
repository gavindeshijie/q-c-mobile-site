import { NextResponse } from "next/server";

import { toAuthUser } from "@/lib/auth/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const clientResult = await createSupabaseServerClient();

  if (!clientResult.ok) {
    return NextResponse.json(
      { ok: false, message: clientResult.message, user: null },
      { status: 503 },
    );
  }

  const { data, error } = await clientResult.supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.json({ ok: false, user: null });
  }

  return NextResponse.json({
    ok: true,
    user: toAuthUser(data.user.email),
  });
}
