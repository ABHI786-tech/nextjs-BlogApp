"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../lib/auth";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export default function MyBlogsPage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 📥 Fetch User Blogs
  useEffect(() => {
    if (!user) {
      setBlogs([]);
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("author.uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const blogsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  // 🗑️ Delete Blog
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-red-600 text-lg font-medium">
          Loading your blogs...
        </div>
      </div>
    );
  }

  // 🚫 Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Login Required</h2>
        <p className="text-gray-500 mb-6">
          Please login to view your blogs
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg bg-[var(--button-color)] text-white font-medium hover:bg-red-800 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              My Blogs
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and view all your published blogs
            </p>
          </div>

          <Link
            href="/create-blog"
            className="bg-[var(--button-color)] text-white px-5 py-3 rounded-lg font-medium hover:bg-red-800 transition"
          >
            + New Blog
          </Link>
        </div>

        {/* Empty State */}
        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start writing your first blog 🚀
            </p>
            <Link
              href="/create-blog"
              className="inline-block bg-[var(--button-color)] text-white px-6 py-3 rounded-lg hover:bg-red-800 transition"
            >
              Create Blog
            </Link>
          </div>
        ) : (
          /* Blog Cards */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
              >
                {/* Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-[var(--button-color)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate max-w-[60%]">
                      {blog.author?.email}
                    </span>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-4">
                      {/* Edit */}
                      <Link
                        href={`/editblog/${blog.id}`}
                        className="text-gray-500 hover:text-blue-600 transition"
                        title="Edit Blog"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-gray-500 hover:text-red-600 transition"
                        title="Delete Blog"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Read */}
                      <Link
                        href={`/blog/${blog.id}`}
                        className="text-red-600 font-medium flex items-center gap-1 hover:underline"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
