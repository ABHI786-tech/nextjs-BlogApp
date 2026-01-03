"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // 🔐 Auth Check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
    });

    return () => unsub();
  }, [router]);

  // 📥 Fetch Blog Data
  useEffect(() => {
    if (!blogId || !user) return;

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "posts", blogId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          alert("Blog not found");
          router.push("/myblogs");
          return;
        }

        const blogData = docSnap.data();

        // 🔒 Security: only author can edit
        if (blogData.author?.uid !== user.uid) {
          alert("You are not allowed to edit this blog");
          router.push("/myblogs");
          return;
        }

        setFormData({
          title: blogData.title || "",
          content: blogData.content || "",
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, user, router]);

  // 📝 Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Update Blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const docRef = doc(db, "posts", blogId);

      await updateDoc(docRef, {
        title: formData.title,
        content: formData.content,
        updatedAt: serverTimestamp(),
      });

      router.push(`/blog/${blogId}`);
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setSaving(false);
    }
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[var(--button-color)] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Blog"}
            </button>

            <Link
              href="/my-blogs"
              className="text-gray-500 hover:underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
