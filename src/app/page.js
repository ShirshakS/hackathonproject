"use client";
import { useState,useEffect } from "react";
import parse from 'html-react-parser';

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [onloadResult, setOnloadResult] = useState([]);
  const onLoadQuery = "Give me a list of top 10 highest paying tech jobs in India alongside their salaries and enclose them in <li></li> but add no other HTML tag or extra text other than what is mentioned"

  useEffect(()=>{sendMessage("loadresult",onLoadQuery)},[])
  const sendMessage = async (type,message) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (res.status === 429) {
    setReply("⚠️ Rate limit reached. Please wait and try again.");
  } else if (!res.ok) {
    setReply(`❌ Error: ${data.error}`);
  } else {
    switch(type)
    {
      case "reply":
        setReply(data.reply);
      break;
      case "loadresult":
        {
        const str = data.reply;
        const items = str.match(/<li>(.*?)<\/li>/g) // match all <li>...</li>
        .map(item => item.replace(/<\/?li>/g, "")); // remove tags
        setOnloadResult(items);
      }
      break;
    }
  }
  };
  return (
    <>
    
      {onloadResult?.map(e => 
      <button onClick = {()=> {sendMessage("reply", `give me a roadmap to become a ${e} with respect to Indian markets`)}}>
        {e}
      </button>)}
      <textarea
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={()=>sendMessage("reply",message)}
      >
        Send
      </button>
      <div>
        <ul>
         {parse(reply)}
         </ul>
      </div>
    </>
  );
}
