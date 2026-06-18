import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: "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" });

const SYSTEM_PROMPT = `You are OmniLearn Assistant, a helpful support chatbot for the OmniLearn online education platform.
Answer questions about courses, enrollment, billing, refunds, account settings, certificates, the Arena Leaderboard, mobile app, and technical issues.
Keep answers concise, friendly, and under 3 paragraphs. If you don't know something, suggest visiting the Help Center or contacting support.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.7,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
