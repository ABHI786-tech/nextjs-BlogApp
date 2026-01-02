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
  const [image, setImage] = useState(null);
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


  // 🚀 Create Blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("All fields are required");
      return;
    }

    try {
      setSubmitting(true);

      // 2️⃣ Save blog to Firestore
      await addDoc(collection(db, "posts"), {
        title,
        content,
        // image: imageUrl,
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
    <div className="max-w-3xl mx-auto px-4 py-26">
      <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full border rounded-lg p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Image */}
        {/* <div>
          <label className="block font-semibold mb-2">Blog Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded-lg p-2"
          />
        </div> */}

        {/* Content */}
        <textarea
          rows={8}
          placeholder="Write blog content..."
          className="w-full border rounded-lg p-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Meta */}
        <div className="text-sm text-gray-500">
          <p>
            <b>Created by:</b> {user?.email}
          </p>
          <p>
            <b>Date:</b> {new Date().toLocaleDateString()}
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
