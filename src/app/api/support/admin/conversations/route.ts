import { NextResponse } from "next/server";

import {
  isSupportAdminRequest,
  listSupportConversations,
  updateSupportConversationStatus,
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
    const conversations = await listSupportConversations();

    return NextResponse.json({
      ok: true,
      conversations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "客服会话读取失败。",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
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

    if (!body.conversationId) {
      return NextResponse.json(
        {
          ok: false,
          message: "缺少客服会话编号。",
        },
        { status: 400 },
      );
    }

    const status = ["open", "pending", "closed"].includes(body.status)
      ? body.status
      : "open";
    const conversation = await updateSupportConversationStatus(
      body.conversationId,
      status,
    );

    return NextResponse.json({
      ok: true,
      conversation,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "客服会话更新失败。",
      },
      { status: 500 },
    );
  }
}
