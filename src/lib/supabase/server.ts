import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { authConfigMissingMessage } from "@/lib/auth/validation";

function normalizeSupabaseUrl(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    return url.origin;
  } catch {
    return trimmed;
  }
}

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      ok: false as const,
      message: authConfigMissingMessage,
    };
  }

  const cookieStore = await cookies();

  return {
    ok: true as const,
    supabase: createServerClient(normalizeSupabaseUrl(supabaseUrl), supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Supabase may call this during a read-only render path. Auth API routes can set cookies.
          }
        },
      },
    }),
  };
}
