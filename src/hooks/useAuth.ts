"use client";

import { useCallback, useEffect, useState } from "react";

import type { AuthJsonResponse, AuthUser } from "@/lib/auth/validation";

type AuthAction = "send-code" | "verify-code" | "logout" | null;

const KEEP_LOGIN_STORAGE_KEY = "q-c-auth-keep-login";
const SESSION_EXPIRES_STORAGE_KEY = "q-c-auth-expires-at";
const TEMP_SESSION_MS = 24 * 60 * 60 * 1000;

async function requestAuth(
  url: string,
  init?: RequestInit,
): Promise<AuthJsonResponse> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return { ok: false, message: "网络连接失败，请稍后重试。" };
  }

  try {
    return (await response.json()) as AuthJsonResponse;
  } catch {
    return { ok: false, message: "认证服务返回异常，请稍后重试。" };
  }
}

function setSessionPreference(keepSignedIn: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (keepSignedIn) {
    window.localStorage.setItem(KEEP_LOGIN_STORAGE_KEY, "true");
    window.localStorage.removeItem(SESSION_EXPIRES_STORAGE_KEY);
    return;
  }

  window.localStorage.removeItem(KEEP_LOGIN_STORAGE_KEY);
  window.localStorage.setItem(
    SESSION_EXPIRES_STORAGE_KEY,
    String(Date.now() + TEMP_SESSION_MS),
  );
}

function clearSessionPreference() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(KEEP_LOGIN_STORAGE_KEY);
  window.localStorage.removeItem(SESSION_EXPIRES_STORAGE_KEY);
}

function shouldExpireLocalSession() {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.localStorage.getItem(KEEP_LOGIN_STORAGE_KEY) === "true") {
    return false;
  }

  const expiresAt = Number(window.localStorage.getItem(SESSION_EXPIRES_STORAGE_KEY));

  return Number.isFinite(expiresAt) && expiresAt > 0 && Date.now() >= expiresAt;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<AuthAction>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await requestAuth("/api/auth/me");

    if (result.ok && result.user) {
      if (shouldExpireLocalSession()) {
        await requestAuth("/api/auth/logout", {
          method: "POST",
        });
        clearSessionPreference();
        setUser(null);
        setError(null);
        setLoading(false);
        return { ok: false, user: null, message: "登录状态已过期，请重新获取验证码。" };
      }

      setUser(result.user);
      setError(null);
    } else {
      setUser(null);
      if (result.message) {
        setError(result.message);
      }
    }

    setLoading(false);
    return result;
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refresh]);

  const sendCode = useCallback(async (email: string) => {
    setAction("send-code");
    setError(null);
    setMessage(null);

    const result = await requestAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (result.ok) {
      setMessage(result.message ?? "验证码已发送，请查收邮箱。");
    } else {
      setError(result.message ?? "验证码发送失败，请稍后重试。");
    }

    setAction(null);
    return result;
  }, []);

  const verifyCode = useCallback(
    async (email: string, code: string, keepSignedIn: boolean) => {
      setAction("verify-code");
      setError(null);
      setMessage(null);

      const result = await requestAuth("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      if (result.ok && result.user) {
        setSessionPreference(keepSignedIn);
        setUser(result.user);
        setMessage(result.message ?? "登录成功");
      } else {
        setError(result.message ?? "验证码不正确或已过期，请重新获取。");
      }

      setAction(null);
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    setAction("logout");
    setError(null);
    setMessage(null);

    const result = await requestAuth("/api/auth/logout", {
      method: "POST",
    });

    if (result.ok) {
      clearSessionPreference();
      setUser(null);
      setMessage(result.message ?? "已退出登录");
    } else {
      setError(result.message ?? "退出登录失败，请稍后重试。");
    }

    setAction(null);
    return result;
  }, []);

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return {
    user,
    loading,
    action,
    error,
    message,
    sendCode,
    verifyCode,
    logout,
    refresh,
    clearFeedback,
  };
}
