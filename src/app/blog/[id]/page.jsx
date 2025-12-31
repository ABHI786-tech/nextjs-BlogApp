"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/fireStore"; // 👈 Firestore config
import Link from "next/link";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(postsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Loading posts...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-center text-red-600 mb-10">
          Latest Blog Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts available
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4">
                    {post.description.slice(0, 100)}...
                  </p>

                  <Link
                    href={`/posts/${post.id}`}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
