import { createClient } from "@supabase/supabase-js";

const missingAdminConfigMessage =
  "客服后台数据库未配置，请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。";

function normalizeSupabaseUrl(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    return url.origin;
  } catch {
    return trimmed;
  }
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false as const,
      message: missingAdminConfigMessage,
    };
  }

  return {
    ok: true as const,
    supabase: createClient(normalizeSupabaseUrl(supabaseUrl), serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }),
  };
}
