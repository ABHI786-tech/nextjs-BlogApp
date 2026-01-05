"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { app } from "./lib/auth";
import { Searchbar, FilterPosts } from "../app/components/searchbar";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const db = getFirestore(app);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 6;

  // 🔥 Fetch Posts (Firestore Pagination)
  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      let q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (lastDoc) {
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      // ✅ No duplicate IDs
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const unique = newPosts.filter((p) => !ids.has(p.id));
        return [...prev, ...unique];
      });

      if (snapshot.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    setLoading(false);
  };

  // 🚀 Initial Load
  useEffect(() => {
    fetchPosts();
  }, []);

  // 👇 Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, lastDoc]);

  // 🔍 Search Filter
  const filteredPosts = FilterPosts(posts, search);

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
        {/* Search + Create */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="w-[70%]">
            <Searchbar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition"
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

        {/* Loader */}
        {loading && (
          <p className="text-center text-gray-500 mt-6">
            Loading more posts...
          </p>
        )}

        {!hasMore && (
          <p className="text-center text-gray-400 mt-6">
            No more posts 🚫
          </p>
        )}
      </section>
    </div>
  );
}
