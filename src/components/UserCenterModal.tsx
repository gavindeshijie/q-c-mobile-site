"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

type UserCenterModalProps = {
  onClose: () => void;
};

type AuthMode = "entry" | "otp";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const codePattern = /^\d{6}$/;

export function UserCenterModal({ onClose }: UserCenterModalProps) {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("entry");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isBusy = auth.action !== null;
  const feedbackError = localError ?? auth.error;

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setLocalError(null);
    auth.clearFeedback();
  }

  function validateEmail() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      return "请输入正确的邮箱地址。";
    }

    return null;
  }

  async function handleSendCode() {
    setLocalError(null);
    auth.clearFeedback();

    const validationError = validateEmail();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await auth.sendCode(normalizedEmail);

    if (result.ok) {
      setCode("");
      setCodeSentTo(normalizedEmail);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    auth.clearFeedback();

    const validationError = validateEmail();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (!codePattern.test(code.trim())) {
      setLocalError("请输入 6 位邮箱验证码。");
      return;
    }

    const result = await auth.verifyCode(
      email.trim().toLowerCase(),
      code.trim(),
      keepSignedIn,
    );

    if (result.ok) {
      setCode("");
    }
  }

  async function handleLogout() {
    await auth.logout();
    setCode("");
    setCodeSentTo(null);
    setMode("entry");
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-dialog-title"
      className="account-modal-panel relative z-10 w-full max-w-[330px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="account-modal-kicker">个人中心</p>
          <h2 id="account-dialog-title" className="account-modal-title">
            {auth.user ? "账号状态" : mode === "otp" ? "邮箱验证码登录" : "登录界面"}
          </h2>
        </div>
        <button
          type="button"
          aria-label="关闭"
          className="account-modal-close grid size-10 place-items-center"
          onClick={onClose}
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {auth.loading ? (
        <div className="auth-loading-panel">
          <LoaderCircle size={24} strokeWidth={2} className="animate-spin" />
          <span>正在检测登录状态...</span>
        </div>
      ) : auth.user ? (
        <div className="auth-account-panel">
          <div className="auth-status-row">
            <span className="auth-status-icon">
              <ShieldCheck size={18} strokeWidth={2} />
            </span>
            <span>
              <span className="auth-status-label">已登录</span>
              <span className="auth-status-email">{auth.user.email}</span>
            </span>
          </div>

          <div className="auth-placeholder-list">
            <span>我的资料</span>
            <span>订单记录</span>
            <span>合作咨询</span>
            <span>账号设置</span>
          </div>

          {auth.message ? (
            <p className="auth-feedback auth-feedback-success">{auth.message}</p>
          ) : null}
          {auth.error ? (
            <p className="auth-feedback auth-feedback-error">{auth.error}</p>
          ) : null}

          <button
            type="button"
            className="auth-logout-button"
            disabled={isBusy}
            onClick={handleLogout}
          >
            <LogOut size={17} strokeWidth={2} />
            <span>{auth.action === "logout" ? "退出中..." : "退出登录"}</span>
          </button>
        </div>
      ) : mode === "entry" ? (
        <div className="account-auth-actions mt-6 space-y-3">
          <button
            type="button"
            className="email-auth-button"
            onClick={() => switchMode("otp")}
          >
            <span className="email-auth-mark">
              <Mail size={18} strokeWidth={2} />
            </span>
            <span className="flex-1 text-left">邮箱登录</span>
            <ArrowRight size={18} strokeWidth={2} />
          </button>

          {feedbackError ? (
            <p className="auth-feedback auth-feedback-error">{feedbackError}</p>
          ) : null}

          <p className="account-modal-note">
            邮箱仅作为 q-c.hk 网站账号标识，本次使用邮箱验证码登录。
          </p>
        </div>
      ) : (
        <form
          className="auth-form"
          onSubmit={handleVerifyCode}
        >
          <p className="auth-form-subtitle">
            输入邮箱获取验证码，再使用验证码登录 q-c.hk 网站账号。
          </p>

          <label className="auth-field">
            <span>邮箱地址</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <button
            type="button"
            className="auth-secondary-button"
            disabled={isBusy}
            onClick={handleSendCode}
          >
            {auth.action === "send-code" ? (
              <LoaderCircle size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Mail size={16} strokeWidth={2} />
            )}
            <span>{auth.action === "send-code" ? "发送中..." : "获取验证码"}</span>
          </button>

          {codeSentTo ? (
            <p className="auth-feedback auth-feedback-success">
              验证码已发送至 {codeSentTo}，请查收邮箱。
            </p>
          ) : null}

          <label className="auth-field">
            <span>邮箱验证码</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="请输入 6 位验证码"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
              }}
            />
          </label>

          {feedbackError ? (
            <p className="auth-feedback auth-feedback-error">{feedbackError}</p>
          ) : null}
          {auth.message ? (
            <p className="auth-feedback auth-feedback-success">{auth.message}</p>
          ) : null}

          <label className="auth-remember-option">
            <input
              type="checkbox"
              className="auth-remember-input"
              checked={keepSignedIn}
              onChange={(event) => setKeepSignedIn(event.target.checked)}
            />
            <span className="auth-remember-check" aria-hidden="true" />
            <span className="auth-remember-copy">
              <span className="auth-remember-title">保持登录</span>
              <span className="auth-remember-text">
                开启后，本设备会尽量保持个人中心登录状态；未开启时，登录约 24
                小时后刷新会自动退出。
              </span>
            </span>
          </label>

          <button type="submit" className="auth-primary-button" disabled={isBusy}>
            {isBusy ? (
              <LoaderCircle size={17} strokeWidth={2} className="animate-spin" />
            ) : (
              <UserRound size={17} strokeWidth={2} />
            )}
            <span>
              {auth.action === "verify-code" ? "登录中..." : "登录"}
            </span>
          </button>

          <button
            type="button"
            className="auth-back-button"
            onClick={() => switchMode("entry")}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            <span>返回个人中心</span>
          </button>

          <p className="account-modal-note">
            支持 Gmail、163、QQ、Outlook、企业邮箱等常见邮箱地址。邮箱仅作为 q-c.hk
            网站账号标识，本次使用邮箱验证码登录。
          </p>
        </form>
      )}
    </section>
  );
}
