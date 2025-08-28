import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }]
      })
    });
    // Handle rate limit error
    if (response.status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Groq API error: ${error}` },
        { status: response.status }
      );
    }
    const data = await response.json();

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}