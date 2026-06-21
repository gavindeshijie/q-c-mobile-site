"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Languages, Send, X } from "lucide-react";

type SupportMessage = {
  id: string;
  conversation_id: string;
  sender: "visitor" | "agent" | "system";
  author: string;
  body: string;
  created_at: string;
};

type SupportConversation = {
  id: string;
  language: string;
  status: string;
};

const conversationKey = "q-c-support-conversation-id";
const visitorKey = "q-c-support-visitor-id";
const languageKey = "q-c-support-language";

const languages = [
  { value: "zh", label: "中文" },
  { value: "th", label: "ไทย" },
  { value: "en", label: "English" },
] as const;

function getStoredId(key: string, prefix: string) {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const next = `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
  window.localStorage.setItem(key, next);

  return next;
}

function getSavedLanguage() {
  if (typeof window === "undefined") return "zh";

  return window.localStorage.getItem(languageKey) || "zh";
}

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<SupportConversation | null>(
    null,
  );
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [language, setLanguage] = useState(getSavedLanguage);
  const [draft, setDraft] = useState("");
  const [statusText, setStatusText] = useState("客服在线");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const visitorIdRef = useRef("");

  const currentVisitorId = useCallback(() => {
    if (!visitorIdRef.current) {
      visitorIdRef.current = getStoredId(visitorKey, "visitor");
    }

    return visitorIdRef.current;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(languageKey, language);
    }
  }, [language]);

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;

    async function syncConversation() {
      const storedConversationId =
        window.localStorage.getItem(conversationKey) || "";

      try {
        const response = await fetch("/api/support/conversations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            conversationId: storedConversationId,
            visitorId: currentVisitorId(),
            language,
            currentPage: {
              path: `${window.location.pathname}${window.location.search}`,
              title: document.title,
            },
          }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "客服连接失败。");
        }

        if (ignore) return;
        setConversation(data.conversation);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        window.localStorage.setItem(conversationKey, data.conversation.id);
        setStatusText("客服已连接");
      } catch (error) {
        if (ignore) return;
        setStatusText(error instanceof Error ? error.message : "客服连接失败");
      }
    }

    syncConversation();
    const timer = window.setInterval(syncConversation, 6500);

    return () => {
      ignore = true;
      window.clearInterval(timer);
    };
  }, [currentVisitorId, isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isOpen]);

  async function sendMessage() {
    const body = draft.trim();
    if (!body || isSending) return;

    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/support/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          conversationId: conversation?.id || window.localStorage.getItem(conversationKey),
          visitorId: currentVisitorId(),
          language,
          body,
          currentPage: {
            path: `${window.location.pathname}${window.location.search}`,
            title: document.title,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "消息发送失败。");
      }

      setConversation(data.conversation);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      window.localStorage.setItem(conversationKey, data.conversation.id);
      setStatusText("消息已发送");
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "消息发送失败");
      setDraft(body);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="support-chat-widget">
      {isOpen ? (
        <section
          className="support-chat-panel"
          role="dialog"
          aria-label="Q-C 客服聊天"
        >
          <header className="support-chat-head">
            <div className="support-chat-title">
              <span className="support-chat-mark">
                <Headphones size={24} strokeWidth={1.8} />
              </span>
              <div>
                <strong>Q-C 客服中心</strong>
                <span>{statusText}</span>
              </div>
            </div>
            <button
              type="button"
              className="support-chat-close"
              aria-label="关闭客服聊天"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </header>

          <div className="support-language-row">
            <Languages size={14} strokeWidth={2} />
            {languages.map((item) => (
              <button
                key={item.value}
                type="button"
                className={language === item.value ? "is-active" : ""}
                onClick={() => setLanguage(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="support-chat-messages">
            <div className="support-chat-message is-agent">
              <b>Q-C 客服</b>
              <p>你好，请留下你想咨询的问题，客服后台会收到并回复。</p>
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`support-chat-message ${
                  message.sender === "visitor" ? "is-visitor" : "is-agent"
                }`}
              >
                <b>{message.author}</b>
                <p>{message.body}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="support-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              value={draft}
              rows={1}
              placeholder="输入要咨询的问题"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button type="submit" disabled={isSending || !draft.trim()}>
              <Send size={17} strokeWidth={2} />
              发送
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="support-chat-entry"
        aria-label="打开客服聊天"
        onClick={() => setIsOpen(true)}
      >
        <Headphones size={27} strokeWidth={1.8} />
        <span>客服</span>
      </button>
    </div>
  );
}
