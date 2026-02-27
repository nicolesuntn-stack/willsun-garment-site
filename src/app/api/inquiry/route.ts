import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type InquiryPayload = {
  companyName: string;
  managerContact: string;
  category: string;
  quantity: string;
  targetPrice: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass
    }
  });
}

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

  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json({
      ok: true,
      status: "saved_without_email",
      message: "SMTP not configured yet. Inquiry payload accepted."
    });
  }

  const to = process.env.INQUIRY_TO_EMAIL ?? "nicolesuntn@gmail.com";
  const from = process.env.INQUIRY_FROM_EMAIL ?? "no-reply@example.com";

  await transporter.sendMail({
    from,
    to,
    subject: `New Inquiry - ${body.companyName}`,
    text: `Company: ${body.companyName}\nContact: ${body.managerContact}\nCategory: ${body.category}\nQuantity: ${body.quantity}\nTarget Price: ${body.targetPrice}`
  });

  return NextResponse.json({ ok: true });
}
