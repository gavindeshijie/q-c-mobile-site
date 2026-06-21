import { z } from "zod";

export const authConfigMissingMessage =
  "认证服务暂未配置，请检查 Supabase 环境变量。";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("请输入正确的邮箱地址");

export const passwordSchema = z
  .string()
  .min(1, "请输入登录密码")
  .min(8, "密码至少需要 8 位");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthUser = {
  email: string;
};

export type AuthJsonResponse = {
  ok: boolean;
  message?: string;
  user?: AuthUser | null;
};

export function firstZodMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "提交内容有误，请检查后重试。";
}

export function toAuthUser(email?: string | null): AuthUser | null {
  return email ? { email } : null;
}

export function normalizeAuthError(message?: string, fallback = "操作失败，请稍后重试。") {
  const source = message?.toLowerCase() ?? "";

  if (!message) {
    return fallback;
  }

  if (source.includes("already registered") || source.includes("user already")) {
    return "该邮箱已注册，请直接登录。";
  }

  if (
    source.includes("invalid login credentials") ||
    source.includes("invalid credentials") ||
    source.includes("email not confirmed")
  ) {
    return source.includes("email not confirmed")
      ? "请先到邮箱点击验证链接后再登录。"
      : "邮箱或密码不正确。";
  }

  if (source.includes("password")) {
    return "密码至少需要 8 位。";
  }

  if (source.includes("email")) {
    return "请输入正确的邮箱地址。";
  }

  if (source.includes("network") || source.includes("fetch")) {
    return "网络连接失败，请稍后重试。";
  }

  return fallback;
}
