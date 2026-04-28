"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { db, auth } from "../lib/auth";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesRef, setMessagesRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  /* 🔐 Auth — real user or anonymous guest */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // Sign in anonymously so Firestore rules can use request.auth.uid
          await signInAnonymously(auth);
          return; // onAuthStateChanged fires again with the new anon user
        }

        const ref = collection(db, "chatrooms", user.uid, "messages");
        setMessagesRef(ref);

        // 🔴 Real-time listener — sorted by createdAt
        const q = query(ref, orderBy("createdAt", "asc"));
        const unsubSnap = onSnapshot(
          q,
          (snap) => {
            const msgs = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(msgs);
            setLoading(false);
          },
          (err) => {
            console.error("Firestore error:", err);
            setError("Permission denied. Check Firestore rules.");
            setLoading(false);
          }
        );

        return () => unsubSnap();
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed.");
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* 📜 Auto-scroll to bottom */
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  /* 📩 Send Message */
  const sendMessage = async () => {
    if (!message.trim() || !messagesRef) return;

    const text = message.trim();
    setMessage("");

    try {
      await addDoc(messagesRef, {
        text,
        sender: "user",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send. Check Firestore rules.");
    }
  };

  /* ⌨️ Send on Enter */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 bg-gray-800 text-white w-14 h-14 rounded-full z-50 shadow-lg hover:bg-gray-700 transition-colors"
        aria-label="Toggle chat"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 w-96 h-[480px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-100">

          {/* Header */}
          <div className="bg-red-900 text-white px-4 py-3 flex justify-between items-center rounded-t-xl">
            <span className="font-semibold">Blog Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white text-lg font-bold hover:opacity-80 transition-opacity"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <p className="text-center text-gray-400 text-sm animate-pulse">
                Connecting...
              </p>
            )}

            {/* Empty state */}
            {!loading && !error && messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">
                Start a new conversation 👋
              </p>
            )}

            {/* Messages */}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    m.sender === "user"
                      ? "bg-red-900 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white rounded-b-xl">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              placeholder="Type a message..."
              disabled={loading || !!error}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading || !!error}
              className="bg-red-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}