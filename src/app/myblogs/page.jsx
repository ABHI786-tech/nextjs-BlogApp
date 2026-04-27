"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
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
import { Pencil, Trash2, ArrowRight } from "lucide-react";

import { Searchbar, FilterPosts } from "../components/searchbar";

export default function MyBlogsPage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
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

  // 🔍 SEARCH FILTER (same as AllBlogs)
  const filteredBlogs = FilterPosts(blogs, search);

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

        {/* HEADER + SEARCH */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              My Blogs
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and view all your published blogs
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto items-center">
            {/* 🔍 SEARCHBAR */}
            <Searchbar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Link
              href="/create-blog"
              className="bg-[var(--button-color)] text-white px-5 py-2 rounded-lg font-medium hover:bg-red-800 transition whitespace-nowrap"
            >
              + New Blog
            </Link>
          </div>
        </div>

        {/* EMPTY / LIST */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold mb-2">
              No blogs found
            </h3>
            <p className="text-gray-500 mb-6">
              Try a different keyword 🔍
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover Image */}
                {blog.imageUrl ? (
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Edit/Delete overlay buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`/editblog/${blog.id}`}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-blue-600 shadow transition"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-red-600 shadow transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">No Image</span>
                    {/* Edit/Delete for no-image cards */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link
                        href={`/editblog/${blog.id}`}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-blue-600 shadow transition"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:text-red-600 shadow transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col flex-grow p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-red-700 uppercase bg-red-50 rounded-full mb-3 w-fit">
                    Article
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-3 leading-relaxed">
                    {blog.description || blog.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate max-w-[60%]">
                      {blog.author?.email?.split("@")[0]}
                    </span>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                    >
                      Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
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
