"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, PlusCircle, Sparkles, Search } from "lucide-react";
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
    // <div className="min-h-screen bg-gray-50/50">
    //   {/* 🌟 Premium Hero Section */}
    //   <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-950 text-white px-6">
    //     {/* Abstract Background Glows */}
    //     <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    //       <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-900/30 blur-[120px] rounded-full" />
    //       <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-red-800/20 blur-[100px] rounded-full" />
    <div className="min-h-screen  font-sans selection:bg-red-500/30 text-white">
      {/*  Hero Section */}
      <section className="relative w-full h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] border-b-[2px] sm:border-b-[3px] border-[#ff3535]  overflow-hidden flex flex-col bg-[#050000] shadow-[0_0_50px_rgba(255,0,0,0.15)] mb-12">

        {/* Background Gradients & Web Pattern */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-900/30 blur-[120px] rounded-full" />
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-red-800/20 blur-[100px] rounded-full" />
          {/* <div className="absolute inset-0 pointer-events-none"> */}
          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px]" /> */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Layer 1: Solid Text (Behind Image) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden">
          <motion.h1
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[14vw] md:text-[16vw] font-black tracking-tighter leading-none text-white whitespace-nowrap select-none"
          >
            TECH-BLOG
          </motion.h1>
        </div>

        {/* Layer 2: Central 3D Image (In Middle) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mt-[8vh]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="relative w-[130%] md:w-[100%] h-[70vh] md:h-[90vh] max-w-5xl"
          >
            {/* <Image
              src="/images/man_reading_newspaer.ico"
              alt="Person reading newspaper 3D"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              priority
            /> */}
            {/* Bottom fade to blend the bottom of the character */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050000] via-transparent to-transparent opacity-90" />
          </motion.div>
        </div>

        {/* Layer 3: Outlined Text (In Front of Image) */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none overflow-hidden">
          <motion.h1
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-[14vw] md:text-[16vw] font-black tracking-tighter leading-none text-transparent whitespace-nowrap select-none"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.85)' }}
          >
            TECH-BLOG
          </motion.h1>
        </div>
      </section>
      {/* 📚 Blogs Section */}
      <section id="blogs" className="relative z-20 max-w-7xl mx-auto px-4 py-12">

        {/* Search & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 flex flex-col sm:flex-row gap-5 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="w-full sm:w-[60%] lg:w-[70%] relative">
            <Searchbar value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <Link
            href="/create-blog"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-white font-medium shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-red-600/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Blog</span>
          </Link>
        </motion.div>

        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Latest Posts</h3>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h4>
            <p className="text-gray-500">We couldn't find anything matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={post.id}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(220,38,38,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                {post.imageUrl ? (
                  <div className="relative w-full h-60 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="relative w-full h-60 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">No Image</span>
                  </div>
                )}

                <div className="flex flex-col flex-grow p-6 sm:p-8">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-red-700 uppercase bg-red-50 rounded-full mb-4">
                      Article
                    </span>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-red-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {post.author?.email?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                        {post.author?.email?.split('@')[0]}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                    >
                      Read
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-12">
            <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-16">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
              You've reached the end! 🏁
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
