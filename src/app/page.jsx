"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { app } from "./lib/auth";
import Searchbar from "./components/searchbar";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";


export default function Home() {
  const [posts, setPosts] = useState([]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-red-900 via-red-800 to-red-900 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Welcome to MyBlog</h2>
          <p className="text-lg opacity-90">
            Learn Web Development, Firebase, Next.js and more 🚀
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Search + Create */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Searchbar />

          <Link
            href="/createBlog"
            className="rounded-lg bg-[var(--button-color)] px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            + Create Blog
          </Link>
        </div>

        <h3 className="text-2xl font-semibold mb-6">Latest Posts</h3>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Blog Image */}
                {/* {post.image && (
                  <CldImage
                    src={post.image}
                    width={600}
                    height={350}
                    crop="fill"
                    alt={post.title}
                  />
                  
                )} */}

                <div className="p-5">
                  <h4 className="text-xl font-semibold mb-2">
                    {post.title}
                  </h4>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="text-sm text-gray-500 mb-3">
                    By {post.author?.email}
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="text-red-700 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
