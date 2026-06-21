import { z } from "zod";

export const authConfigMissingMessage =
  "认证服务暂未配置，请检查 Supabase 环境变量。";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("请输入正确的邮箱地址");

export const otpCodeSchema = z
  .string()
  .trim()
  .min(1, "请输入邮箱验证码")
  .regex(/^\d{6}$/, "请输入 6 位邮箱验证码");

export const loginSchema = z.object({
  email: emailSchema,
});

export const verifyCodeSchema = z.object({
  email: emailSchema,
  code: otpCodeSchema,
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
    return "该邮箱可直接获取验证码登录。";
  }

  if (source.includes("otp") || source.includes("token")) {
    return "验证码不正确或已过期，请重新获取。";
  }

  if (
    source.includes("invalid login credentials") ||
    source.includes("invalid credentials")
  ) {
    return "验证码不正确或已过期，请重新获取。";
  }

  if (source.includes("email")) {
    return "请输入正确的邮箱地址。";
  }

  if (source.includes("network") || source.includes("fetch")) {
    return "网络连接失败，请稍后重试。";
  }

  return fallback;
}
