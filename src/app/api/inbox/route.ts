import { NextResponse } from "next/server";
import {
  getAllMessages,
  deleteMessage,
  markMessageRead,
  clearAllMessages,
} from "@/lib/messagesStore";

const ADMIN_PIN = "krishna1337";

function verifyPin(req: Request): boolean {
  const url = new URL(req.url);
  const pinQuery = url.searchParams.get("pin");
  const authHeader = req.headers.get("authorization");
  const pinHeader = req.headers.get("x-admin-pin");

  return (
    pinQuery === ADMIN_PIN ||
    pinHeader === ADMIN_PIN ||
    authHeader === `Bearer ${ADMIN_PIN}`
  );
}

// GET /api/inbox - Retrieve all messages
export async function GET(req: Request) {
  if (!verifyPin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Security PIN required." },
      { status: 401 }
    );
  }

  try {
    const messages = await getAllMessages();
    return NextResponse.json({
      success: true,
      count: messages.length,
      unreadCount: messages.filter((m) => !m.read).length,
      messages,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error reading messages";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// DELETE /api/inbox?id=... - Delete a message or clear all
export async function DELETE(req: Request) {
  if (!verifyPin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Security PIN required." },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Message ID is required." },
      { status: 400 }
    );
  }

  try {
    if (id === "all") {
      await clearAllMessages();
      return NextResponse.json({ success: true, message: "All messages cleared." });
    }

    const ok = await deleteMessage(id);
    return NextResponse.json({ success: ok });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting message";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// PATCH /api/inbox - Toggle read status
export async function PATCH(req: Request) {
  if (!verifyPin(req)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Security PIN required." },
      { status: 401 }
    );
  }

  try {
    const { id, read } = await req.json();
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Message ID is required." },
        { status: 400 }
      );
    }

    const ok = await markMessageRead(id, read ?? true);
    return NextResponse.json({ success: ok });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating message";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
