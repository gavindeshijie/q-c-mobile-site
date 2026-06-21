import { NextResponse } from "next/server";

import { getConversationWithMessages } from "@/lib/support/store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await getConversationWithMessages({
      conversationId: body.conversationId,
      visitorId: body.visitorId,
      userEmail: body.userEmail,
      language: body.language,
      currentPage: body.currentPage,
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "客服会话创建失败。",
      },
      { status: 500 },
    );
  }
}
