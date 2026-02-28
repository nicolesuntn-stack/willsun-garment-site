import { NextResponse } from "next/server";

import type { LocalizedProductFields } from "@/lib/productStore";

export const runtime = "edge";

function isAuthed(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }

  const provided = request.headers.get("x-admin-password");
  return provided === expected;
}

function isValidZhFields(value: unknown): value is LocalizedProductFields {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return ["name", "summary", "overview", "fabric", "sizes", "colors"].every(
    (key) => typeof payload[key] === "string" && payload[key].trim().length > 0
  );
}

function fallbackTranslation(zh: LocalizedProductFields): LocalizedProductFields {
  return {
    name: zh.name,
    summary: zh.summary,
    overview: zh.overview,
    fabric: zh.fabric,
    sizes: zh.sizes,
    colors: zh.colors
  };
}

export async function POST(request: Request) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    zh?: LocalizedProductFields;
  };

  if (!isValidZhFields(body.zh)) {
    return NextResponse.json({ error: "Invalid Chinese fields" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_TRANSLATE_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      en: fallbackTranslation(body.zh),
      warning: "OPENAI_API_KEY not configured. Returned Chinese text as editable fallback."
    });
  }

  const prompt = `Translate the following product fields from Chinese to natural, business English for apparel B2B. Return ONLY JSON with keys: name, summary, overview, fabric, sizes, colors. Input JSON: ${JSON.stringify(
    body.zh
  )}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a translation engine. Output valid JSON only, no markdown, no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Translation API request failed.",
        fallback: fallbackTranslation(body.zh)
      },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return NextResponse.json(
      {
        ok: false,
        error: "Translation API returned empty result.",
        fallback: fallbackTranslation(body.zh)
      },
      { status: 502 }
    );
  }

  try {
    const translated = JSON.parse(content) as LocalizedProductFields;
    if (!isValidZhFields(translated)) {
      throw new Error("Invalid translation shape");
    }

    return NextResponse.json({ ok: true, en: translated });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to parse translation JSON.",
        fallback: fallbackTranslation(body.zh)
      },
      { status: 502 }
    );
  }
}
