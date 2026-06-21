"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
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

type AuthMode = "entry" | "login" | "register";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserCenterModal({ onClose }: UserCenterModalProps) {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("entry");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isBusy = auth.action !== null;
  const feedbackError = localError ?? auth.error;

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setLocalError(null);
    auth.clearFeedback();
  }

  function validateEmailPassword() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      return "请输入正确的邮箱地址。";
    }

    if (password.length < 8) {
      return "密码至少需要 8 位。";
    }

    return null;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    auth.clearFeedback();

    const validationError = validateEmailPassword();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const result = await auth.login(email.trim().toLowerCase(), password);

    if (result.ok) {
      setPassword("");
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    auth.clearFeedback();

    const validationError = validateEmailPassword();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("两次输入的密码不一致。");
      return;
    }

    const result = await auth.register(email.trim().toLowerCase(), password);

    if (result.ok) {
      setPassword("");
      setConfirmPassword("");

      if (!result.user) {
        setMode("login");
      }
    }
  }

  async function handleLogout() {
    await auth.logout();
    setPassword("");
    setConfirmPassword("");
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
            {auth.user ? "账号状态" : mode === "register" ? "邮箱注册" : mode === "login" ? "邮箱登录" : "登录界面"}
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
            onClick={() => switchMode("login")}
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
            邮箱仅作为 q-c.hk 网站账号标识，密码为本站账号密码。
          </p>
        </div>
      ) : (
        <form
          className="auth-form"
          onSubmit={mode === "login" ? handleLogin : handleRegister}
        >
          <p className="auth-form-subtitle">
            {mode === "login"
              ? "使用邮箱和 q-c.hk 网站账号密码登录。"
              : "创建你的 q-c.hk 网站账号。"}
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

          <label className="auth-field">
            <span>{mode === "login" ? "登录密码" : "设置密码"}</span>
            <span className="auth-password-shell">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder={mode === "login" ? "请输入登录密码" : "请设置登录密码"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={2} />
                ) : (
                  <Eye size={16} strokeWidth={2} />
                )}
              </button>
            </span>
          </label>

          {mode === "register" ? (
            <label className="auth-field">
              <span>确认密码</span>
              <span className="auth-password-shell">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "隐藏确认密码" : "显示确认密码"}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} strokeWidth={2} />
                  ) : (
                    <Eye size={16} strokeWidth={2} />
                  )}
                </button>
              </span>
            </label>
          ) : null}

          {feedbackError ? (
            <p className="auth-feedback auth-feedback-error">{feedbackError}</p>
          ) : null}
          {auth.message ? (
            <p className="auth-feedback auth-feedback-success">{auth.message}</p>
          ) : null}

          <button type="submit" className="auth-primary-button" disabled={isBusy}>
            {isBusy ? (
              <LoaderCircle size={17} strokeWidth={2} className="animate-spin" />
            ) : mode === "login" ? (
              <UserRound size={17} strokeWidth={2} />
            ) : (
              <ShieldCheck size={17} strokeWidth={2} />
            )}
            <span>
              {mode === "login"
                ? auth.action === "login"
                  ? "登录中..."
                  : "登录"
                : auth.action === "register"
                  ? "注册中..."
                  : "注册账号"}
            </span>
          </button>

          <div className="auth-form-links">
            {mode === "login" ? (
              <>
                <button type="button" onClick={() => switchMode("register")}>
                  没有账号？立即注册
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError(null);
                    auth.clearFeedback();
                    // Password reset can be connected to Supabase later without changing this UI.
                    setLocalError("忘记密码功能即将开放。");
                  }}
                >
                  忘记密码？
                </button>
              </>
            ) : (
              <button type="button" onClick={() => switchMode("login")}>
                已有账号？返回登录
              </button>
            )}
          </div>

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
            网站账号标识，密码为本站账号密码。
          </p>
        </form>
      )}
    </section>
  );
}
