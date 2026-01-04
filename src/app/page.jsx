"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { app } from "./lib/auth";
import { Search } from "lucide-react"

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const db = getFirestore(app);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, [db]);

  // ✅ SEARCH FILTER 
  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-red-900 via-red-800 to-red-900 text-white text-center px-6">
        <div>
          <h2 className="text-4xl font-bold mb-4">Welcome to MyBlog</h2>
          <p>Learn Web Development, Firebase, Next.js and more 🚀</p>
        </div>
      </section>

      {/* Blogs */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* 🔍 SEARCH + CREATE */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <span className="flex gap-x-1">
            <input
              type="text"
              placeholder="Search blog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 rounded-lg border px-4 py-2"
            />
            <button className="bg-[var(--button-color)] text-white px-5 py-2.5 rounded-lg"><Search size={16} className="text-white inline-block mx-1" />search</button>
          </span>

          <Link
            href="/createBlog"
            className="rounded-lg bg-red-700 px-5 py-2.5 text-white"
          >
            + Create Blog
          </Link>
        </div>

        <h3 className="text-2xl font-semibold mb-6">Latest Posts</h3>

        {filteredPosts.length === 0 ? (
          <p className="text-gray-500">No posts found</p>
        ) : (
          <div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" >
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="my-2 p-5 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
              >
                <h4 className="text-xl font-semibold mb-2">
                  {post.title}
                </h4>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  By {post.author?.email}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="text-red-700 font-medium"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
