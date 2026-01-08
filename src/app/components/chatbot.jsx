"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/auth";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);

  /* 🔐 User / Guest */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const userId = user ? user.uid : "guest";

      setMessagesRef(
        collection(db, "chatrooms", userId, "messages")
      );

      setMessages([]); // UI clear on refresh
    });

    return () => unsub();
  }, []);

  /* 📩 Send Message */
  const sendMessage = async () => {
    if (!message.trim() || !messagesRef) return;

    const text = message;
    setMessage("");

    // UI me add
    setMessages((prev) => [...prev, { text, sender: "user" }]);

    // Firestore me save
    await addDoc(messagesRef, {
      text,
      sender: "user",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-gray-800 text-white w-14 h-14 rounded-full z-10"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 w-96 h-[420px] bg-white rounded-xl shadow-xl flex flex-col">
          
          {/* Header with Cross */}
          <div className="bg-red-900 text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">Blog Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg font-bold hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm">
                Start a new conversation 👋
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className="mb-2">
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Type..."
            />
            <button
              onClick={sendMessage}
              className="bg-red-800 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
