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
  .regex(/^\d{8}$/, "请输入 8 位邮箱验证码");

export const loginSchema = z.object({
  email: emailSchema,
});

export const sendOtpSchema = z.object({
  email: emailSchema,
});

export const verifyCodeSchema = z.object({
  email: emailSchema,
  code: otpCodeSchema,
});

export const verifyOtpSchema = z
  .object({
    email: emailSchema,
    token: otpCodeSchema.optional(),
    code: otpCodeSchema.optional(),
  })
  .refine((value) => value.token ?? value.code, {
    message: "请输入 8 位邮箱验证码",
    path: ["token"],
  })
  .transform((value) => ({
    email: value.email,
    token: value.token ?? value.code ?? "",
  }));

export type AuthUser = {
  email: string;
};

export type AuthErrorCode =
  | "AUTH_NOT_CONFIGURED"
  | "INVALID_EMAIL"
  | "OTP_RESEND_COOLDOWN"
  | "EMAIL_PROVIDER_RATE_LIMIT"
  | "RATE_LIMITED"
  | "SUPABASE_ERROR"
  | "INVALID_OTP";

export type AuthJsonResponse = {
  ok: boolean;
  code?: AuthErrorCode;
  message?: string;
  debug?: string;
  retryAfterSeconds?: number;
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

export function sanitizeAuthErrorDetail(message?: string) {
  if (!message) {
    return "未知错误";
  }

  return message
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[token]")
    .replace(/[A-Za-z0-9_-]{96,}/g, "[secret]")
    .slice(0, 240);
}

export function formatSupabaseAuthError(prefix: string, message?: string) {
  return `${prefix}：${sanitizeAuthErrorDetail(message)}`;
}

export function isRateLimitError(message?: string, status?: number) {
  const source = message?.toLowerCase() ?? "";

  return status === 429 || source.includes("rate limit") || source.includes("too many");
}

export function parseRetryAfterSeconds(message?: string) {
  const source = message?.toLowerCase() ?? "";
  const afterMatch = source.match(/after\s+(\d+)\s*(second|seconds|sec|secs|s)\b/);
  const secondsMatch = source.match(/(\d+)\s*(second|seconds|sec|secs|s)\b/);
  const minutesMatch = source.match(/(\d+)\s*(minute|minutes|min|mins|m)\b/);

  if (afterMatch?.[1]) {
    return Number(afterMatch[1]);
  }

  if (secondsMatch?.[1]) {
    return Number(secondsMatch[1]);
  }

  if (minutesMatch?.[1]) {
    return Number(minutesMatch[1]) * 60;
  }

  return null;
}

export function classifyOtpSendRateLimit(message?: string, status?: number) {
  const debug = sanitizeAuthErrorDetail(message);
  const source = debug.toLowerCase();
  const retryAfter = parseRetryAfterSeconds(debug);

  if (
    source.includes("email rate limit exceeded") ||
    source.includes("over_email_send_rate_limit") ||
    source.includes("email rate limit")
  ) {
    return {
      code: "EMAIL_PROVIDER_RATE_LIMIT" as const,
      message: "邮件发送额度暂时受限，请稍后再试。正式上线需要配置 SMTP 邮件服务。",
      retryAfterSeconds: retryAfter ?? 3600,
      debug,
    };
  }

  if (
    source.includes("over_request_rate_limit") ||
    source.includes("only request") ||
    source.includes("security purposes") ||
    (source.includes("after") && source.includes("second"))
  ) {
    return {
      code: "OTP_RESEND_COOLDOWN" as const,
      message: "验证码发送过于频繁，请稍后再试。",
      retryAfterSeconds: retryAfter ?? 60,
      debug,
    };
  }

  if (isRateLimitError(debug, status)) {
    return {
      code: "EMAIL_PROVIDER_RATE_LIMIT" as const,
      message: "邮件发送额度暂时受限，请稍后再试。正式上线需要配置 SMTP 邮件服务。",
      retryAfterSeconds: retryAfter ?? 3600,
      debug,
    };
  }

  return null;
}
