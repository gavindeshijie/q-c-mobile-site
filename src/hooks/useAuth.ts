"use client";

import { useCallback, useEffect, useState } from "react";

import type { AuthJsonResponse, AuthUser } from "@/lib/auth/validation";

type AuthAction = "login" | "register" | "logout" | null;

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

  const login = useCallback(async (email: string, password: string) => {
    setAction("login");
    setError(null);
    setMessage(null);

    const result = await requestAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.ok && result.user) {
      setUser(result.user);
      setMessage(result.message ?? "登录成功");
    } else {
      setError(result.message ?? "邮箱或密码不正确。");
    }

    setAction(null);
    return result;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setAction("register");
    setError(null);
    setMessage(null);

    const result = await requestAuth("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.ok) {
      setMessage(result.message ?? "注册成功");
      const current = await requestAuth("/api/auth/me");
      setUser(current.ok && current.user ? current.user : null);
    } else {
      setError(result.message ?? "注册失败，请稍后重试。");
    }

    setAction(null);
    return result;
  }, []);

  const logout = useCallback(async () => {
    setAction("logout");
    setError(null);
    setMessage(null);

    const result = await requestAuth("/api/auth/logout", {
      method: "POST",
    });

    if (result.ok) {
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
    login,
    register,
    logout,
    refresh,
    clearFeedback,
  };
}
