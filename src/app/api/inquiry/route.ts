import { NextResponse } from "next/server";

type InquiryPayload = {
  companyName: string;
  managerContact: string;
  category: string;
  quantity: string;
  targetPrice: string;
  selectedProducts?: Array<{
    slug: string;
    name: string;
    category: string;
  }>;
};

export const runtime = "edge";

export async function POST(request: Request) {
  const body = (await request.json()) as InquiryPayload;

  if (
    !body.companyName ||
    !body.managerContact ||
    !body.category ||
    !body.quantity ||
    !body.targetPrice
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({
      ok: true,
      status: "accepted_without_delivery",
      message: "Set INQUIRY_WEBHOOK_URL to forward inquiries from edge runtime."
    });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: "Failed to forward inquiry payload to webhook." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, status: "forwarded" });
}
