"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { app } from "../lib/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function CreatePost() {
  const router = useRouter();

  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔐 Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // ✍️ Insert text at cursor
  const insertAtCursor = (text) => {
    const textarea = document.getElementById("content-editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      content.substring(0, start) +
      text +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + text.length;
    }, 0);
  };

  // 🚀 Create Blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("All fields are required");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "posts"), {
        title,
        content,
        author: {
          uid: user.uid,
          email: user.email,
        },
        createdAt: serverTimestamp(),
        status: "published",
      });

      alert("Blog created successfully 🎉");
      router.push("/");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">
        Create Blog Post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 📝 Title */}
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ✍️ Content */}
        <textarea
          id="content-editor"
          rows={10}
          placeholder="Write blog content..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* ➕ INSERT OPTIONS */}
        {/* <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              insertAtCursor("\n[Link] https://example.com\n")
            }
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            🔗 Add Link
          </button>

          <button
            type="button"
            onClick={() =>
              insertAtCursor("\n[Video] https://youtube.com/\n")
            }
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            🎥 Add Video
          </button>

          <button
            type="button"
            onClick={() =>
              insertAtCursor("\n[Document] https://drive.google.com/\n")
            }
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            📄 Add Document
          </button>
        </div> */}

        {/* ℹ️ Meta Info */}
        <div className="text-sm text-gray-500">
          <p>
            <b>Created by:</b> {user?.email}
          </p>
          <p>
            <b>Date:</b> {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* 🚀 Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-[var(--button-color)] text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
