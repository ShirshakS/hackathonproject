"use client";

import CareerForm from "./CareerForm";
import Chat from "./Chat";

export default function Page() {
  return (
    <main>
      <h1>Hackathon AI Chat</h1>
      <p>Start chatting with Llama3 below. You can ask about tech jobs, roadmaps, or anything else!</p>
      <CareerForm />
      <Chat />
    </main>
  );
}
