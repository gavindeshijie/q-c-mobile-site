import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type SupportSender = "visitor" | "agent" | "system";

export type SupportConversation = {
  id: string;
  visitor_id: string | null;
  user_email: string | null;
  language: string;
  status: string;
  page_path: string | null;
  page_title: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
};

export type SupportMessage = {
  id: string;
  conversation_id: string;
  sender: SupportSender;
  author: string;
  body: string;
  created_at: string;
};

type ConversationInput = {
  conversationId?: string;
  visitorId?: string;
  userEmail?: string;
  language?: string;
  currentPage?: {
    path?: string;
    title?: string;
  };
};

type MessageInput = ConversationInput & {
  body: string;
  sender?: SupportSender;
  author?: string;
};

type SupportMemoryStore = {
  conversations: SupportConversation[];
  messages: SupportMessage[];
};

const globalForSupport = globalThis as typeof globalThis & {
  __qSupportMemory?: SupportMemoryStore;
};

function memoryStore() {
  if (!globalForSupport.__qSupportMemory) {
    globalForSupport.__qSupportMemory = {
      conversations: [],
      messages: [],
    };
  }

  return globalForSupport.__qSupportMemory;
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

function normalizeLanguage(language?: string) {
  return ["zh", "th", "en"].includes(language || "") ? language || "zh" : "zh";
}

function normalizeConversationInput(input: ConversationInput) {
  return {
    visitor_id: input.visitorId || null,
    user_email: input.userEmail || null,
    language: normalizeLanguage(input.language),
    page_path: input.currentPage?.path || null,
    page_title: input.currentPage?.title || null,
  };
}

export function isSupportAdminRequest(request: Request) {
  const configuredPassword = process.env.SUPPORT_ADMIN_PASSWORD;
  const providedPassword = request.headers.get("x-support-admin-password") || "";

  if (!configuredPassword) {
    return {
      ok: false as const,
      status: 500,
      message: "客服后台密码未配置，请设置 SUPPORT_ADMIN_PASSWORD。",
    };
  }

  if (providedPassword !== configuredPassword) {
    return {
      ok: false as const,
      status: 401,
      message: "客服后台密码不正确。",
    };
  }

  return { ok: true as const };
}

async function getConversationFromSupabase(conversationId: string) {
  const admin = createSupabaseAdminClient();
  if (!admin.ok) return null;

  const { data } = await admin.supabase
    .from("support_conversations")
    .select("*")
    .eq("id", conversationId)
    .maybeSingle();

  return (data || null) as SupportConversation | null;
}

export async function getOrCreateConversation(input: ConversationInput = {}) {
  const admin = createSupabaseAdminClient();
  const normalized = normalizeConversationInput(input);

  if (admin.ok) {
    if (input.conversationId) {
      const existing = await getConversationFromSupabase(input.conversationId);
      if (existing) {
        await admin.supabase
          .from("support_conversations")
          .update({
            language: normalized.language,
            visitor_id: normalized.visitor_id || existing.visitor_id,
            user_email: normalized.user_email || existing.user_email,
            page_path: normalized.page_path || existing.page_path,
            page_title: normalized.page_title || existing.page_title,
            updated_at: now(),
          })
          .eq("id", existing.id);

        return {
          ...existing,
          language: normalized.language,
          visitor_id: normalized.visitor_id || existing.visitor_id,
          user_email: normalized.user_email || existing.user_email,
          page_path: normalized.page_path || existing.page_path,
          page_title: normalized.page_title || existing.page_title,
        };
      }
    }

    const timestamp = now();
    const { data, error } = await admin.supabase
      .from("support_conversations")
      .insert({
        ...normalized,
        status: "open",
        created_at: timestamp,
        updated_at: timestamp,
        last_message_at: timestamp,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as SupportConversation;
  }

  const store = memoryStore();
  const existing = input.conversationId
    ? store.conversations.find((conversation) => conversation.id === input.conversationId)
    : null;

  if (existing) {
    existing.language = normalized.language;
    existing.visitor_id = normalized.visitor_id || existing.visitor_id;
    existing.user_email = normalized.user_email || existing.user_email;
    existing.page_path = normalized.page_path || existing.page_path;
    existing.page_title = normalized.page_title || existing.page_title;
    existing.updated_at = now();

    return existing;
  }

  const timestamp = now();
  const conversation: SupportConversation = {
    id: makeId("support"),
    ...normalized,
    status: "open",
    created_at: timestamp,
    updated_at: timestamp,
    last_message_at: timestamp,
  };

  store.conversations.unshift(conversation);

  return conversation;
}

export async function listConversationMessages(conversationId: string) {
  const admin = createSupabaseAdminClient();

  if (admin.ok) {
    const { data, error } = await admin.supabase
      .from("support_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as SupportMessage[];
  }

  return memoryStore().messages.filter(
    (message) => message.conversation_id === conversationId,
  );
}

export async function createSupportMessage(input: MessageInput) {
  const conversation = await getOrCreateConversation(input);
  const admin = createSupabaseAdminClient();
  const timestamp = now();
  const messagePayload = {
    conversation_id: conversation.id,
    sender: input.sender || "visitor",
    author:
      input.author ||
      (input.sender === "agent" ? "Q-C 客服" : input.userEmail || "访客"),
    body: input.body.trim(),
    created_at: timestamp,
  };

  if (!messagePayload.body) {
    throw new Error("请输入消息内容。");
  }

  if (admin.ok) {
    const { data, error } = await admin.supabase
      .from("support_messages")
      .insert(messagePayload)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await admin.supabase
      .from("support_conversations")
      .update({
        status: conversation.status === "closed" ? "open" : conversation.status,
        updated_at: timestamp,
        last_message_at: timestamp,
      })
      .eq("id", conversation.id);

    return data as SupportMessage;
  }

  const message: SupportMessage = {
    id: makeId("message"),
    ...messagePayload,
    sender: messagePayload.sender as SupportSender,
  };
  const store = memoryStore();
  store.messages.push(message);
  conversation.updated_at = timestamp;
  conversation.last_message_at = timestamp;
  conversation.status = conversation.status === "closed" ? "open" : conversation.status;

  return message;
}

export async function getConversationWithMessages(input: ConversationInput) {
  const conversation = await getOrCreateConversation(input);
  const messages = await listConversationMessages(conversation.id);

  return {
    conversation,
    messages,
  };
}

export async function listSupportConversations() {
  const admin = createSupabaseAdminClient();

  if (admin.ok) {
    const { data, error } = await admin.supabase
      .from("support_conversations")
      .select("*")
      .order("last_message_at", { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as SupportConversation[];
  }

  return [...memoryStore().conversations].sort((a, b) =>
    b.last_message_at.localeCompare(a.last_message_at),
  );
}

export async function updateSupportConversationStatus(
  conversationId: string,
  status: "open" | "pending" | "closed",
) {
  const admin = createSupabaseAdminClient();
  const timestamp = now();

  if (admin.ok) {
    const { data, error } = await admin.supabase
      .from("support_conversations")
      .update({
        status,
        updated_at: timestamp,
      })
      .eq("id", conversationId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as SupportConversation;
  }

  const conversation = memoryStore().conversations.find(
    (item) => item.id === conversationId,
  );

  if (!conversation) {
    throw new Error("会话不存在。");
  }

  conversation.status = status;
  conversation.updated_at = timestamp;

  return conversation;
}
