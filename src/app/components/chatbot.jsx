"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/auth";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔐 User / Guest detect
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const userId = user ? user.uid : "anonymous";

      // ✅ ONE PLACE for BOTH user & bot messages
      setMessagesRef(
        collection(db, "chatrooms", userId, "messages")
      );

      setMessages([]);
    });

    return () => unsub();
  }, []);

  // 🔄 Listen messages
  useEffect(() => {
    if (!messagesRef) return;

    const q = query(messagesRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, [messagesRef]);

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📩 Send
  const sendMessage = async () => {
    if (!message.trim() || !messagesRef) return;

    await addDoc(messagesRef, {
      text: message,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    setTimeout(async () => {
      await addDoc(messagesRef, {
        text: getBotReply(message),
        sender: "bot",
        createdAt: serverTimestamp(),
      });
    }, 600);

    setMessage("");
  };

  const getBotReply = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello 👋 Kaise madad kar sakta hoon?";
    if (msg.includes("blog"))
      return "Is blog app me aap blogs read aur create kar sakte ho.";
    if (msg.includes("login"))
      return "Login ke liye upar Login button ka use karo.";
    return "Mujhe samajh nahi aaya 😅 thoda clearly likho.";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-gray-700 text-white w-14 h-14 rounded-full shadow-xl text-2xl z-50"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 w-96 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-red-900 text-white px-4 py-3 rounded-t-xl">
            <div>
              <h3 className="font-semibold">Blog Assistant</h3>
              <p className="text-xs text-gray-300">
                {auth.currentUser ? "Logged User" : "Guest User"}
              </p>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 text-sm rounded-2xl max-w-[75%]
                  ${m.sender === "user" ? "bg-red-700 text-white" : "bg-gray-800 text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-[var(--button-color)] text-white px-4 py-2 rounded-full hover:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
