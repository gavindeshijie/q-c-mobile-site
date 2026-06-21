import { NextResponse } from "next/server";

import {
  createSupportMessage,
  getConversationWithMessages,
  isSupportAdminRequest,
} from "@/lib/support/store";

export async function GET(request: Request) {
  const admin = isSupportAdminRequest(request);

  if (!admin.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: admin.message,
      },
      { status: admin.status },
    );
  }

  try {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId") || "";

    if (!conversationId) {
      return NextResponse.json(
        {
          ok: false,
          message: "缺少客服会话编号。",
        },
        { status: 400 },
      );
    }

    const result = await getConversationWithMessages({ conversationId });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "客服消息读取失败。",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const admin = isSupportAdminRequest(request);

  if (!admin.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: admin.message,
      },
      { status: admin.status },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const message = await createSupportMessage({
      conversationId: body.conversationId,
      body: body.body,
      sender: "agent",
      author: "Q-C 客服",
    });
    const result = await getConversationWithMessages({
      conversationId: message.conversation_id,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "客服回复发送失败。",
      },
      { status: 500 },
    );
  }
}
