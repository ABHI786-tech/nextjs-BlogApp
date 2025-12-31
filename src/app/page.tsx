"use client";
import React from "react";
import Link from "next/link";
import { app } from "../app/lib/auth";
import { getDatabase, ref, set } from "firebase/database"
import Searchbar from "./components/searchbar"


const db = getDatabase(app)


export default function Home() {
 const putData = () => {
    set(ref(db, "users/1"), {
      id: 1,
      name: "abhi",
      age: 21,
    })
  }

  const posts = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      excerpt: "Learn the basics of Next.js and build modern React apps.",
      author: "Admin",
      date: "Jan 10, 2025",
    },
    {
      id: 2,
      title: "Firebase Authentication Explained",
      excerpt: "Understand how Firebase Auth works with real examples.",
      author: "Abhinash",
      date: "Jan 12, 2025",
    },
    {
      id: 3,
      title: "Firestore CRUD in Easy Steps",
      excerpt: "Create, Read, Update and Delete data in Firestore.",
      author: "Admin",
      date: "Jan 15, 2025",
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className= "bg-blue-600 text-white py-16"> */}
      {/* <section className= "min-h-screen bg-[var(--primary-color)] text-white py-16"> */}
      <section className= "min-h-screen flex items-center justify-center bg-linear-to-r from-red-900 via-red-800 to-red-900 text-white text-center px-6 rounded-b-4xl">  
        <div className="flex-col max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Welcome to MyBlog</h2>
          <p className="text-lg opacity-90">
            Learn Web Development, Firebase, Next.js and more 🚀
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-6xl mx-auto px-4 py-12">
<div >
<Searchbar />
</div>

        <h3 className="text-2xl font-semibold mb-6">Latest Posts</h3>

         {/* <button onClick={putData}
              className="rounded bg-blue-600 px-4 py-2 text-white">PUT DATA</button> */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-5"
            >
              <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-500 mb-3">
                By {post.author} · {post.date}
              </div>
              <Link
                href={`/blog/${post.id}`}
                className="text-red-700 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}

