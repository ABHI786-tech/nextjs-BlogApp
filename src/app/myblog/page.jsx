"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs,} from "firebase/firestore";
import { auth, db } from "../lib/auth";
import Link from "next/link";

export default function MyBlogsPage() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  

  // 🔐 Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 📥 Fetch user blogs
  useEffect(() => {
    if (!user) return;

    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
         where("author.email", "==", user.email)
         );
        //  console.log(user.email,"useremail")
        const querySnapshot = await getDocs(q);

        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [user]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🚫 Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Please login to see your blogs</p>
        <Link href="/login" className="text-red-500 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-26">
      <h1 className="text-3xl font-bold mb-6">My Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-400">
          You haven’t created any blogs yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-800 rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {blog.title}
              </h2>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {blog.description}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{blog.author?.email}</span>

                <Link
                  href={`/blog/${blog.id}`}
                  className="text-red-400 hover:underline"
                >
                  Read
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
