# Supabase 邮箱验证码模板设置

q-c.hk 当前登录方式是无密码邮箱验证码登录，不使用邮箱密码、不使用站内密码，也不使用注册确认链接。

## 代码确认

发送验证码 API：

- 路径：`POST /api/auth/send-otp`
- 方法：`supabase.auth.signInWithOtp`
- 参数：`{ email, options: { shouldCreateUser: true } }`

验证验证码 API：

- 路径：`POST /api/auth/verify-otp`
- 方法：`supabase.auth.verifyOtp`
- 参数：`{ email, token, type: "email" }`

项目里不要使用这些流程：

- `supabase.auth.signUp`
- `supabase.auth.signInWithPassword`
- `supabase.auth.resend({ type: "signup" })`
- 邮箱密码注册确认流程

## Supabase 后台需要修改

进入 Supabase Dashboard：

1. 打开项目。
2. 进入 `Authentication`。
3. 进入 `Email Templates`。
4. 优先修改 `Magic Link` 模板。
5. 如果新邮箱第一次登录仍收到“Confirm your email address”，也把 `Confirm signup` 模板改成同样的验证码模板。

关键点：

- 邮件里必须包含 `{{ .Token }}`。
- 不要使用 `{{ .ConfirmationURL }}`。
- 不要写“确认邮箱地址”。
- 不要写“完成注册”。
- 不要写“Click this link”。
- 不要出现确认链接。

## 建议主题

```text
q-c.hk 登录验证码
```

## 建议正文

```html
<h2>q-c.hk 登录验证码</h2>

<p>你的 q-c.hk 登录验证码是：</p>

<h1 style="font-size: 32px; letter-spacing: 6px;">{{ .Token }}</h1>

<p>此验证码用于登录 q-c.hk 网站账号，请在有效期内完成验证。</p>

<p>如果这不是你本人操作，请忽略此邮件。</p>
```

## 为什么会收到确认邮件

Supabase 的邮箱 OTP 和 Magic Link 使用同一类模板规则：

- 模板使用 `{{ .ConfirmationURL }}` 时，会发送链接。
- 模板使用 `{{ .Token }}` 时，会发送 6 位验证码。

因为 q-c.hk 要用户回到网站输入 6 位验证码，所以模板必须改成 `{{ .Token }}`。
