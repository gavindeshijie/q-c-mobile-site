import { NextResponse } from "next/server";

import {
  createSupportMessage,
  getConversationWithMessages,
} from "@/lib/support/store";

export async function GET(request: Request) {
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

    const result = await getConversationWithMessages({
      conversationId,
      visitorId: url.searchParams.get("visitorId") || undefined,
      language: url.searchParams.get("language") || undefined,
    });

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
  try {
    const body = await request.json().catch(() => ({}));
    const message = await createSupportMessage({
      conversationId: body.conversationId,
      visitorId: body.visitorId,
      userEmail: body.userEmail,
      language: body.language,
      currentPage: body.currentPage,
      body: body.body,
      sender: "visitor",
      author: body.userEmail || "访客",
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
        message: error instanceof Error ? error.message : "客服消息发送失败。",
      },
      { status: 500 },
    );
  }
}
