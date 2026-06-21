# Supabase Custom SMTP 配置说明

q-c.hk 使用无密码邮箱验证码登录：

1. 用户输入邮箱。
2. 点击获取验证码。
3. Supabase Auth 发送 8 位 OTP。
4. 用户回到 q-c.hk 输入验证码完成登录。

## 为什么会出现 email rate limit exceeded

`email rate limit exceeded` 说明 q-c.hk 已经成功调用 Supabase Auth，但 Supabase 拒绝继续发送邮件。

常见原因：

- 同一邮箱短时间内重复获取验证码。
- 项目整体 OTP 邮件发送次数达到 Supabase 限制。
- 仍在使用 Supabase 默认邮件服务。

这不是 API 没接上。这个错误代表 Supabase Auth 已经收到请求，但拒绝继续发送邮件。

需要区分两种限流：

- 同一邮箱重复发送：通常是 60 秒冷却。
- 邮件服务额度限制：可能需要更久恢复，默认按 1 小时处理；正式上线应配置 Custom SMTP。

测试阶段可以等待更久再发，或者换一个测试邮箱。正式上线不要依赖 Supabase 默认邮件服务。

## Supabase 后台路径

进入 Supabase Dashboard：

```text
Authentication
→ SMTP Settings
→ Enable Custom SMTP
```

同时建议检查：

```text
Authentication
→ Rate Limits
```

还需要检查：

```text
Authentication
→ Logs
```

查看发送 OTP 的真实错误。

```text
Authentication
→ Providers
→ Email
```

确认 Email Provider 已开启。

## 需要准备的信息

配置 Custom SMTP 前，需要从邮件服务商准备：

- SMTP Host
- SMTP Port
- SMTP User
- SMTP Password
- Sender Email
- Sender Name

常见服务商：

- Resend
- Brevo
- SendGrid
- Postmark
- AWS SES

配置 SMTP 后，再回到 q-c.hk 测试验证码发送。

## 开发阶段临时建议

如果只是测试，可以：

1. 等待更久，例如 1 小时后再试。
2. 换一个测试邮箱。
3. 不要连续反复点击获取验证码。
4. 去 `Authentication → Logs` 查看真实错误。
5. 尽早配置 Custom SMTP。

## 建议发件身份

正式上线建议使用自己的域名邮箱，例如：

```text
no-reply@q-c.hk
Q-C
```

实际是否可用取决于邮箱服务商和域名 DNS 配置。

## 邮件模板仍然要使用 OTP

Custom SMTP 只负责发邮件，不决定邮件内容。

邮箱验证码模板仍然需要在 Supabase 设置：

```text
Authentication
→ Email Templates
→ Magic Link
```

模板必须包含：

```text
{{ .Token }}
```

不要使用：

```text
{{ .ConfirmationURL }}
```

否则用户会收到链接邮件，而不是 8 位验证码。

## 参考模板

主题：

```text
q-c.hk 登录验证码
```

正文：

```html
<h2>q-c.hk 登录验证码</h2>
<p>你正在使用邮箱验证码登录 q-c.hk。</p>
<p>你的 8 位验证码是：</p>
<h1 style="font-size:32px;letter-spacing:6px;">{{ .Token }}</h1>
<p>请在有效期内完成登录。</p>
<p>如果这不是你本人操作，请忽略此邮件。</p>
```
