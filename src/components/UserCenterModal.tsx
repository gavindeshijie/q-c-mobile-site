"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
type AccountPanel = "home" | "settings";
type CooldownReason = "OTP_RESEND_COOLDOWN" | "EMAIL_PROVIDER_RATE_LIMIT";
type AccountProfile = {
  personalIp?: string;
  websiteName?: string;
  boundEmail?: string;
  boundPhone?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?\d[\d\s-]{5,20}$/;
const personalIpPattern = /^\d{4,18}$/;
const codePattern = /^\d{8}$/;
const DEFAULT_OTP_COOLDOWN_SECONDS = 60;
const DEFAULT_PROVIDER_LIMIT_SECONDS = 60 * 60;
const COOLDOWN_STORAGE_PREFIX = "q-c-email-otp-cooldown:";
const PROFILE_STORAGE_PREFIX = "q-c-account-profile:";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getCooldownStorageKey(email: string) {
  return `${COOLDOWN_STORAGE_PREFIX}${email}`;
}

function formatCooldownDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);

  if (safeSeconds < 60) {
    return `${safeSeconds} 秒`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes} 分 ${remainingSeconds} 秒`;
}

function getCooldownMessage(reason: CooldownReason, seconds: number) {
  const duration = formatCooldownDuration(seconds);

  if (reason === "EMAIL_PROVIDER_RATE_LIMIT") {
    return `邮件发送额度暂时受限，请等待 ${duration}后再试。正式上线需要配置 SMTP 邮件服务。`;
  }

  return `验证码发送过于频繁，请等待 ${duration}后再试。`;
}

function readStoredCooldown(email: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getCooldownStorageKey(email));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as {
      until?: number;
      reason?: CooldownReason;
    };

    if (
      !parsed.until ||
      parsed.until <= Date.now() ||
      (parsed.reason !== "OTP_RESEND_COOLDOWN" &&
        parsed.reason !== "EMAIL_PROVIDER_RATE_LIMIT")
    ) {
      window.localStorage.removeItem(getCooldownStorageKey(email));
      return null;
    }

    return {
      until: parsed.until,
      reason: parsed.reason,
    };
  } catch {
    window.localStorage.removeItem(getCooldownStorageKey(email));
    return null;
  }
}

function saveStoredCooldown(email: string, reason: CooldownReason, seconds: number) {
  if (typeof window === "undefined") {
    return Date.now() + seconds * 1000;
  }

  const until = Date.now() + seconds * 1000;

  window.localStorage.setItem(
    getCooldownStorageKey(email),
    JSON.stringify({ until, reason }),
  );

  return until;
}

function clearStoredCooldown(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getCooldownStorageKey(email));
}

function getProfileStorageKey(email: string) {
  return `${PROFILE_STORAGE_PREFIX}${normalizeEmail(email)}`;
}

function readAccountProfile(email: string): AccountProfile {
  if (typeof window === "undefined" || !email) {
    return {};
  }

  const raw = window.localStorage.getItem(getProfileStorageKey(email));

  if (!raw) {
    return {
      boundEmail: normalizeEmail(email),
    };
  }

  try {
    const parsed = JSON.parse(raw) as AccountProfile;

    return {
      ...parsed,
      boundEmail: parsed.boundEmail || normalizeEmail(email),
    };
  } catch {
    return {
      boundEmail: normalizeEmail(email),
    };
  }
}

function writeAccountProfile(email: string, profile: AccountProfile) {
  if (typeof window === "undefined" || !email) {
    return;
  }

  window.localStorage.setItem(getProfileStorageKey(email), JSON.stringify(profile));
}

export function UserCenterModal({ onClose }: UserCenterModalProps) {
  const auth = useAuth();
  const [mode, setMode] = useState<AuthMode>("entry");
  const [accountPanel, setAccountPanel] = useState<AccountPanel>("home");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [profile, setProfile] = useState<AccountProfile>({});
  const [personalIpInput, setPersonalIpInput] = useState("");
  const [websiteNameInput, setWebsiteNameInput] = useState("");
  const [boundPhoneInput, setBoundPhoneInput] = useState("");
  const [boundEmailInput, setBoundEmailInput] = useState("");
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [cooldownReason, setCooldownReason] = useState<CooldownReason | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showRateLimitHint, setShowRateLimitHint] = useState(false);
  const sendingCodeRef = useRef(false);

  const isBusy = auth.action !== null;
  const canRequestCode = !isBusy && cooldownSeconds <= 0;
  const canSubmitCode = !isBusy && codePattern.test(code.trim());
  const feedbackError =
    showRateLimitHint && cooldownReason && cooldownSeconds > 0
      ? getCooldownMessage(cooldownReason, cooldownSeconds)
      : localError ?? auth.error;

  useEffect(() => {
    if (!cooldownUntil) {
      return;
    }

    const updateCooldown = () => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((cooldownUntil - Date.now()) / 1000),
      );

      setCooldownSeconds(remainingSeconds);

      if (remainingSeconds <= 0) {
        const normalizedEmail = normalizeEmail(email);

        if (emailPattern.test(normalizedEmail)) {
          clearStoredCooldown(normalizedEmail);
        }

        setCooldownUntil(null);
        setCooldownReason(null);
        setShowRateLimitHint(false);
      }
    };

    const timer = window.setInterval(() => {
      updateCooldown();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownUntil, email]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!auth.user?.email) {
        setAccountPanel("home");
        setProfile({});
        setPersonalIpInput("");
        setWebsiteNameInput("");
        setBoundPhoneInput("");
        setBoundEmailInput("");
        setSettingsMessage(null);
        setSettingsError(null);
        return;
      }

      const nextProfile = readAccountProfile(auth.user.email);

      setProfile(nextProfile);
      setPersonalIpInput("");
      setWebsiteNameInput(nextProfile.websiteName || "");
      setBoundPhoneInput(nextProfile.boundPhone || "");
      setBoundEmailInput(nextProfile.boundEmail || normalizeEmail(auth.user.email));
      setSettingsMessage(null);
      setSettingsError(null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [auth.user?.email]);

  function startCooldown(emailValue: string, reason: CooldownReason, seconds: number) {
    const safeSeconds = Math.max(1, seconds);
    const until = saveStoredCooldown(emailValue, reason, safeSeconds);

    setCooldownUntil(until);
    setCooldownReason(reason);
    setCooldownSeconds(safeSeconds);
  }

  function clearCooldownState() {
    setCooldownUntil(null);
    setCooldownSeconds(0);
    setCooldownReason(null);
  }

  function applyStoredCooldown(emailValue: string) {
    const normalizedEmail = normalizeEmail(emailValue);

    if (!emailPattern.test(normalizedEmail)) {
      clearCooldownState();
      return null;
    }

    const storedCooldown = readStoredCooldown(normalizedEmail);

    if (!storedCooldown) {
      clearCooldownState();
      return null;
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((storedCooldown.until - Date.now()) / 1000),
    );

    if (remainingSeconds <= 0) {
      clearStoredCooldown(normalizedEmail);
      clearCooldownState();
      return null;
    }

    setCooldownUntil(storedCooldown.until);
    setCooldownReason(storedCooldown.reason);
    setCooldownSeconds(remainingSeconds);

    return {
      ...storedCooldown,
      remainingSeconds,
    };
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setLocalError(null);
    setShowRateLimitHint(false);
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
    if (!canRequestCode || sendingCodeRef.current) {
      if (cooldownReason && cooldownSeconds > 0) {
        setShowRateLimitHint(true);
      }

      return;
    }

    sendingCodeRef.current = true;
    setLocalError(null);
    setShowRateLimitHint(false);
    auth.clearFeedback();

    const validationError = validateEmail();

    if (validationError) {
      setLocalError(validationError);
      sendingCodeRef.current = false;
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const storedCooldown = applyStoredCooldown(normalizedEmail);

    if (storedCooldown) {
      setShowRateLimitHint(true);
      sendingCodeRef.current = false;
      return;
    }

    const result = await auth.sendCode(normalizedEmail);

    if (result.ok) {
      setCode("");
      setCodeSentTo(normalizedEmail);
      startCooldown(
        normalizedEmail,
        "OTP_RESEND_COOLDOWN",
        result.retryAfterSeconds ?? DEFAULT_OTP_COOLDOWN_SECONDS,
      );
    } else if (
      result.code === "OTP_RESEND_COOLDOWN" ||
      result.code === "EMAIL_PROVIDER_RATE_LIMIT" ||
      result.code === "RATE_LIMITED"
    ) {
      const reason =
        result.code === "OTP_RESEND_COOLDOWN"
          ? "OTP_RESEND_COOLDOWN"
          : "EMAIL_PROVIDER_RATE_LIMIT";
      const fallbackSeconds =
        reason === "OTP_RESEND_COOLDOWN"
          ? DEFAULT_OTP_COOLDOWN_SECONDS
          : DEFAULT_PROVIDER_LIMIT_SECONDS;

      setShowRateLimitHint(true);
      startCooldown(normalizedEmail, reason, result.retryAfterSeconds ?? fallbackSeconds);
    }

    sendingCodeRef.current = false;
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
      setLocalError("请输入 8 位邮箱验证码。");
      return;
    }

    const result = await auth.verifyCode(
      normalizeEmail(email),
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
    setAccountPanel("home");
  }

  function saveProfile(nextProfile: AccountProfile, message: string) {
    if (!auth.user?.email) {
      return;
    }

    const normalizedProfile = {
      ...nextProfile,
      boundEmail: nextProfile.boundEmail || normalizeEmail(auth.user.email),
    };

    writeAccountProfile(auth.user.email, normalizedProfile);
    setProfile(normalizedProfile);
    setSettingsError(null);
    setSettingsMessage(message);
  }

  function handleSavePersonalIp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (profile.personalIp) {
      setSettingsMessage(null);
      setSettingsError("个人IP号码已经锁定，不能再次更改。");
      return;
    }

    const nextPersonalIp = personalIpInput.trim();

    if (!personalIpPattern.test(nextPersonalIp)) {
      setSettingsMessage(null);
      setSettingsError("请输入 4 到 18 位数字作为个人IP号码。");
      return;
    }

    saveProfile(
      {
        ...profile,
        personalIp: nextPersonalIp,
      },
      "个人IP号码已设置，后续不能更改。",
    );
    setPersonalIpInput("");
  }

  function handleSaveWebsiteName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextWebsiteName = websiteNameInput.trim();

    if (nextWebsiteName.length < 2 || nextWebsiteName.length > 20) {
      setSettingsMessage(null);
      setSettingsError("网站名字请输入 2 到 20 个字符。");
      return;
    }

    saveProfile(
      {
        ...profile,
        websiteName: nextWebsiteName,
      },
      "网站名字已保存。",
    );
  }

  function handleSaveBindings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = normalizeEmail(boundEmailInput || auth.user?.email || "");
    const nextPhone = boundPhoneInput.trim();

    if (!emailPattern.test(nextEmail)) {
      setSettingsMessage(null);
      setSettingsError("请输入正确的绑定邮箱。");
      return;
    }

    if (nextPhone && !phonePattern.test(nextPhone)) {
      setSettingsMessage(null);
      setSettingsError("请输入正确的手机号。");
      return;
    }

    saveProfile(
      {
        ...profile,
        boundEmail: nextEmail,
        boundPhone: nextPhone,
      },
      "账号绑定信息已保存。手机号和邮箱会作为同一个账号身份。",
    );
  }

  const accountTitle = auth.user
    ? accountPanel === "settings"
      ? "账号设置"
      : "账号状态"
    : mode === "otp"
      ? "邮箱验证码登录"
      : "登录界面";

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
            {accountTitle}
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
              <span className="auth-status-email">
                {profile.websiteName || auth.user.email}
              </span>
              {profile.websiteName ? (
                <span className="auth-status-subemail">{auth.user.email}</span>
              ) : null}
            </span>
          </div>

          {accountPanel === "settings" ? (
            <div className="auth-settings-panel">
              <button
                type="button"
                className="auth-back-button"
                onClick={() => {
                  setAccountPanel("home");
                  setSettingsMessage(null);
                  setSettingsError(null);
                }}
              >
                <ArrowLeft size={16} strokeWidth={2} />
                返回账号状态
              </button>

              <form className="auth-setting-card" onSubmit={handleSavePersonalIp}>
                <div>
                  <strong>个人IP设置</strong>
                  <span>个人IP号码只能设置一次，确认后永久不能更改。</span>
                </div>
                {profile.personalIp ? (
                  <p className="auth-locked-value">{profile.personalIp}</p>
                ) : (
                  <div className="auth-setting-action">
                    <input
                      inputMode="numeric"
                      placeholder="输入个人IP号码"
                      value={personalIpInput}
                      onChange={(event) => setPersonalIpInput(event.target.value)}
                    />
                    <button type="submit">锁定</button>
                  </div>
                )}
              </form>

              <form className="auth-setting-card" onSubmit={handleSaveWebsiteName}>
                <div>
                  <strong>网站名字</strong>
                  <span>登录后优先显示这个名字，方便识别当前账号。</span>
                </div>
                <div className="auth-setting-action">
                  <input
                    placeholder="设置网站名字"
                    value={websiteNameInput}
                    onChange={(event) => setWebsiteNameInput(event.target.value)}
                  />
                  <button type="submit">保存</button>
                </div>
              </form>

              <form className="auth-setting-card" onSubmit={handleSaveBindings}>
                <div>
                  <strong>账号绑定</strong>
                  <span>手机号和邮箱互通，后续任一方式登录都会显示同一个名字。</span>
                </div>
                <label className="auth-setting-field">
                  <span>手机号绑定</span>
                  <input
                    inputMode="tel"
                    placeholder="输入手机号"
                    value={boundPhoneInput}
                    onChange={(event) => setBoundPhoneInput(event.target.value)}
                  />
                </label>
                <label className="auth-setting-field">
                  <span>邮箱绑定</span>
                  <input
                    inputMode="email"
                    placeholder="输入邮箱"
                    value={boundEmailInput}
                    onChange={(event) => setBoundEmailInput(event.target.value)}
                  />
                </label>
                <button type="submit" className="auth-setting-save">
                  保存绑定
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-placeholder-list">
              <button type="button">资料</button>
              <button type="button">聊天记录</button>
              <button type="button" onClick={() => setAccountPanel("settings")}>
                账号设置
              </button>
            </div>
          )}

          {auth.message ? (
            <p className="auth-feedback auth-feedback-success">{auth.message}</p>
          ) : null}
          {auth.error ? (
            <p className="auth-feedback auth-feedback-error">{auth.error}</p>
          ) : null}
          {settingsMessage ? (
            <p className="auth-feedback auth-feedback-success">{settingsMessage}</p>
          ) : null}
          {settingsError ? (
            <p className="auth-feedback auth-feedback-error">{settingsError}</p>
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
              onChange={(event) => {
                const nextEmail = event.target.value;

                setEmail(nextEmail);
                setLocalError(null);
                setShowRateLimitHint(false);
                setCodeSentTo(null);
                auth.clearFeedback();
                applyStoredCooldown(nextEmail);
              }}
            />
          </label>

          <button
            type="button"
            className="auth-secondary-button"
            disabled={!canRequestCode}
            onClick={handleSendCode}
          >
            {auth.action === "send-code" ? (
              <LoaderCircle size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Mail size={16} strokeWidth={2} />
            )}
            <span>
              {auth.action === "send-code"
                ? "发送中..."
                : cooldownSeconds > 0
                  ? `${formatCooldownDuration(cooldownSeconds)}后重新发送`
                  : "获取验证码"}
            </span>
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
              placeholder="请输入 8 位验证码"
              maxLength={8}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 8));
              }}
            />
          </label>

          {feedbackError ? (
            <p className="auth-feedback auth-feedback-error">{feedbackError}</p>
          ) : null}
          {showRateLimitHint ? (
            <p className="auth-feedback-hint">
              为了保护账号安全，请不要连续重复发送验证码。
            </p>
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

          <button
            type="submit"
            className="auth-primary-button"
            disabled={!canSubmitCode}
          >
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
