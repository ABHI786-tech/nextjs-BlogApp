"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { app } from "../lib/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { PenLine, Image as ImageIcon, Send } from "lucide-react";
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
  const [file, setFile] = useState(null);
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

      let imageUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          imageUrl = data.url; // Storing the Cloudinary secure URL reference in Firestore
        } else {
          console.error("Cloudinary upload failed");
          alert("Image upload failed, creating blog without cover image.");
        }
      }

      await addDoc(collection(db, "posts"), {
        title,
        content,
        imageUrl,
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
         <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-24 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-8 sm:p-12 text-center text-white">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/20"
          >
            <PenLine className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Create New Blog</h1>
          <p className="text-red-100/80 text-lg">Share your knowledge with the world.</p>
        </div>

        {/* Form */}
        <div className="p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide uppercase">Blog Title</label>
              <input
                type="text"
                placeholder="E.g., Getting Started with Next.js..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all placeholder:text-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide uppercase">Cover Image</label>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 file:transition-colors file:cursor-pointer"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide uppercase">Blog Content</label>
              <textarea
                id="content-editor"
                rows={12}
                placeholder="Write your amazing content here..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Meta & Submit */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                 </div>
                 <div className="text-sm">
                   <p className="text-gray-900 font-medium">{user?.email}</p>
                   <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</p>
                 </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Publish Blog</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
