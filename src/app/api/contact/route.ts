import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messagesStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || undefined;

    // 1. Permanently store in Krishna's private database (Vercel Blob store)
    const saved = await addMessage({
      name,
      email,
      message,
      userAgent,
    });

    // 2. Optional background notification ping to FormSubmit (non-blocking)
    try {
      const params = new URLSearchParams();
      params.append("name", name);
      params.append("email", email);
      params.append("message", message);
      params.append("_subject", `[KrishnaOS Inbox] New Message from ${name}`);
      params.append("_replyto", email);
      params.append("_template", "table");
      params.append("_captcha", "false");

      fetch("https://formsubmit.co/ajax/agarwalkrishna1204@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Origin: "https://portfolioclaude-nu.vercel.app",
          Referer: "https://portfolioclaude-nu.vercel.app",
        },
        body: params.toString(),
      }).catch(() => {
        // Silent catch: primary store is already saved!
      });
    } catch {
      // Ignored
    }

    return NextResponse.json({
      success: true,
      message: "Message recorded in Krishna's private inbox.",
      id: saved.id,
      timestamp: saved.createdAt,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Transmission relay error";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
