"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Headphones, Lock, RefreshCw, Send } from "lucide-react";

type Conversation = {
  id: string;
  visitor_id: string | null;
  user_email: string | null;
  language: string;
  status: string;
  page_path: string | null;
  page_title: string | null;
  created_at: string;
  last_message_at: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender: "visitor" | "agent" | "system";
  author: string;
  body: string;
  created_at: string;
};

const passwordKey = "q-c-support-admin-password";

function formatTime(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("zh-Hans", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function SupportAdminPage() {
  const [password, setPassword] = useState("");
  const [draftPassword, setDraftPassword] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [statusText, setStatusText] = useState("请输入客服后台密码");
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) || null,
    [activeId, conversations],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedPassword = window.sessionStorage.getItem(passwordKey) || "";
      if (savedPassword) {
        setPassword(savedPassword);
        setDraftPassword(savedPassword);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const adminFetch = useCallback(
    async (url: string, init?: RequestInit) =>
      fetch(url, {
        ...init,
        headers: {
          "content-type": "application/json",
          "x-support-admin-password": password,
          ...(init?.headers || {}),
        },
        cache: "no-store",
      }),
    [password],
  );

  const loadConversations = useCallback(async () => {
    if (!password) return;

    setIsLoading(true);

    try {
      const response = await adminFetch("/api/support/admin/conversations");
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "客服会话读取失败。");
      }

      setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      if (!activeId && data.conversations?.[0]?.id) {
        setActiveId(data.conversations[0].id);
      }
      setStatusText("客服后台已连接");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "客服后台连接失败");
    } finally {
      setIsLoading(false);
    }
  }, [activeId, adminFetch, password]);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const response = await adminFetch(
        `/api/support/admin/messages?conversationId=${encodeURIComponent(conversationId)}`,
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "客服消息读取失败。");
      }

      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "客服消息读取失败");
    }
  }, [adminFetch]);

  useEffect(() => {
    if (!password) return;
    const initialTimer = window.setTimeout(loadConversations, 0);
    const timer = window.setInterval(loadConversations, 7000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [loadConversations, password]);

  useEffect(() => {
    if (!password || !activeId) return;
    const initialTimer = window.setTimeout(() => loadMessages(activeId), 0);
    const timer = window.setInterval(() => loadMessages(activeId), 5500);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [activeId, loadMessages, password]);

  async function sendReply() {
    const body = reply.trim();
    if (!body || !activeId) return;

    setReply("");

    try {
      const response = await adminFetch("/api/support/admin/messages", {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeId,
          body,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "客服回复发送失败。");
      }

      setMessages(Array.isArray(data.messages) ? data.messages : []);
      loadConversations();
      setStatusText("回复已发送");
    } catch (error) {
      setReply(body);
      setStatusText(error instanceof Error ? error.message : "客服回复发送失败");
    }
  }

  if (!password) {
    return (
      <main className="support-admin-screen">
        <section className="support-admin-login">
          <span className="support-admin-icon">
            <Lock size={24} strokeWidth={1.8} />
          </span>
          <p className="support-admin-kicker">Q-C SUPPORT ADMIN</p>
          <h1>独立客服后台</h1>
          <p>这里专门处理首页右下角客服聊天，不和网站其他后台混在一起。</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPassword(draftPassword);
              window.sessionStorage.setItem(passwordKey, draftPassword);
            }}
          >
            <input
              value={draftPassword}
              type="password"
              placeholder="输入客服后台密码"
              onChange={(event) => setDraftPassword(event.target.value)}
            />
            <button type="submit">进入客服后台</button>
          </form>
          <small>{statusText}</small>
        </section>
      </main>
    );
  }

  return (
    <main className="support-admin-screen">
      <section className="support-admin-shell">
        <header className="support-admin-header">
          <div>
            <p className="support-admin-kicker">Q-C SUPPORT ADMIN</p>
            <h1>独立客服后台</h1>
            <span>{statusText}</span>
          </div>
          <button type="button" onClick={loadConversations}>
            <RefreshCw size={17} strokeWidth={2} />
            {isLoading ? "刷新中" : "刷新"}
          </button>
        </header>

        <div className="support-admin-grid">
          <aside className="support-admin-list">
            {conversations.length ? (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className={conversation.id === activeId ? "is-active" : ""}
                  onClick={() => setActiveId(conversation.id)}
                >
                  <strong>
                    {conversation.user_email || conversation.visitor_id || "访客"}
                  </strong>
                  <span>
                    {conversation.language.toUpperCase()} · {conversation.status} ·{" "}
                    {formatTime(conversation.last_message_at)}
                  </span>
                </button>
              ))
            ) : (
              <div className="support-admin-empty">暂时没有客服会话。</div>
            )}
          </aside>

          <section className="support-admin-chat">
            <div className="support-admin-chat-head">
              <span className="support-admin-icon">
                <Headphones size={22} strokeWidth={1.8} />
              </span>
              <div>
                <strong>
                  {activeConversation?.user_email ||
                    activeConversation?.visitor_id ||
                    "选择一个会话"}
                </strong>
                <span>{activeConversation?.page_path || "等待访客咨询"}</span>
              </div>
            </div>

            <div className="support-admin-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`support-admin-message ${
                    message.sender === "agent" ? "is-agent" : "is-visitor"
                  }`}
                >
                  <b>
                    {message.author}
                    <span>{formatTime(message.created_at)}</span>
                  </b>
                  <p>{message.body}</p>
                </div>
              ))}
              {!messages.length ? (
                <div className="support-admin-empty">这里会显示聊天记录。</div>
              ) : null}
            </div>

            <form
              className="support-admin-reply"
              onSubmit={(event) => {
                event.preventDefault();
                sendReply();
              }}
            >
              <textarea
                value={reply}
                disabled={!activeId}
                rows={2}
                placeholder="输入客服回复"
                onChange={(event) => setReply(event.target.value)}
              />
              <button type="submit" disabled={!activeId || !reply.trim()}>
                <Send size={17} strokeWidth={2} />
                回复
              </button>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
