import { BrainItem, BrainItemType, CaptureResult } from "./types";
import { makeId } from "./utils";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

function inferType(input: string): BrainItemType {
  const text = input.toLowerCase();
  if (text.includes("restaurant") || text.includes("dinner") || text.includes("yelp") || text.includes("reservation")) return "restaurant";
  if (text.includes("http") && (text.includes("youtube") || text.includes("tiktok") || text.includes("instagram.com/reel"))) return "video";
  if (text.includes("http") || text.includes("read") || text.includes("article")) return "article";
  if (text.includes("meeting") || text.includes("calendar") || text.includes("event") || text.includes("invite")) return "event";
  if (text.includes("remind") || text.includes("tomorrow") || text.includes("next week")) return "reminder";
  if (text.includes("idea") || text.includes("concept")) return "idea";
  return "todo";
}

function heuristicCapture(input: string): CaptureResult {
  const type = inferType(input);
  const title = input.split("\n")[0].slice(0, 80) || "Untitled capture";
  const metadata: Record<string, string> = {};

  if (type === "restaurant") {
    metadata.cuisine = "Unknown";
    metadata.rating = "Needs lookup";
    metadata.location = "Needs lookup";
  }

  if (type === "event") {
    metadata.time = "Needs confirmation";
  }

  const item: BrainItem = {
    id: makeId(),
    type,
    title,
    summary: input.slice(0, 200),
    source: "manual_capture",
    createdAt: new Date().toISOString(),
    confidence: 0.62,
    tags: [type, "inbox"],
    metadata,
  };

  return {
    item,
    reasoning: "Classified with local heuristics because OpenAI API key is not configured.",
  };
}

export async function processCapture(input: string): Promise<CaptureResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return heuristicCapture(input);

  const prompt = `You are a second-brain triage engine. Convert raw captures into structured JSON for a mobile app.
Return valid JSON only with schema:
{
  "type":"todo|restaurant|reminder|event|video|article|idea",
  "title":"short title",
  "summary":"compact summary",
  "tags":["tag1","tag2"],
  "confidence":0.0,
  "metadata":{"key":"value"},
  "reasoning":"one short sentence"
}
If input mentions a restaurant, enrich metadata keys: name,cuisine,location,rating,priceRange,imageHint.
If event: date,time,location.
If reminder: remindAt.
Input:\n${input}`;

  const response = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
      max_output_tokens: 500,
    }),
  });

  if (!response.ok) return heuristicCapture(input);

  const data = await response.json();
  const outputText = data.output_text as string | undefined;
  if (!outputText) return heuristicCapture(input);

  try {
    const parsed = JSON.parse(outputText);
    const item: BrainItem = {
      id: makeId(),
      type: parsed.type,
      title: parsed.title,
      summary: parsed.summary,
      source: "openai",
      createdAt: new Date().toISOString(),
      confidence: Number(parsed.confidence || 0.7),
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      metadata: parsed.metadata || {},
    };

    return {
      item,
      reasoning: parsed.reasoning || "Processed by OpenAI triage.",
    };
  } catch {
    return heuristicCapture(input);
  }
}
