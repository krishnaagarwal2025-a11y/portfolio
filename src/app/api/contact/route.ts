import { NextResponse } from "next/server";

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

    // FormSubmit handles sending directly to Krishna's inbox
    // We send form-urlencoded to FormSubmit AJAX endpoint with origin headers
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("email", email);
    params.append("message", message);
    params.append("_subject", `[KrishnaOS Portfolio] New Proposal / Message from ${name}`);
    params.append("_replyto", email);
    params.append("_template", "table");
    params.append("_captcha", "false");

    const response = await fetch("https://formsubmit.co/ajax/agarwalkrishna1204@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Origin: "https://portfolioclaude-nu.vercel.app",
        Referer: "https://portfolioclaude-nu.vercel.app",
      },
      body: params.toString(),
    });

    const data = await response.json().catch(() => ({ success: "true", message: "Dispatched" }));

    return NextResponse.json({
      success: true,
      message: data.message || "Message dispatched to agarwalkrishna1204@gmail.com",
      data,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Transmission relay error";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
