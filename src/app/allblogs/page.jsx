"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Calendar } from "lucide-react";
import { app } from "../lib/auth";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Pagination from "../components/Pagination";

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const db = getFirestore(app);

  // 🔥 Fetch blogs
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsArr);
    });

    return () => unsubscribe();
  }, [db]);

  // 🔍 Search + Date filter
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.content?.toLowerCase().includes(search.toLowerCase());

    if (!blog.createdAt?.seconds) return false;

    const blogDate = new Date(blog.createdAt.seconds * 1000);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    const matchesDate = (!from || blogDate >= from) && (!to || blogDate <= to);

    return matchesSearch && matchesDate;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">All Blogs</h1>
          <p className="text-gray-500 mt-1">Search and filter blogs by date</p>
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 flex flex-col gap-4 sm:grid sm:grid-cols-4 sm:items-center">
          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
            <button onClick={() => setShowDateFilter(!showDateFilter)} className="sm:hidden border rounded-lg px-3">
              <Calendar size={18} />
            </button>
          </div>

          {/* Desktop Start Date */}
          <div className="relative hidden sm:block">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg pl-10 px-4 py-2"
            />
          </div>

          {/* Desktop End Date */}
          <div className="relative hidden sm:block">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-lg pl-10 px-4 py-2"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
            }}
            className="hidden sm:block bg-gray-200 rounded-lg px-4 py-2"
          >
            Clear
          </button>
        </div>

        {/* Mobile Date Filter */}
        {showDateFilter && (
          <div className="mb-6 flex flex-col gap-3 sm:hidden">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-4 py-2" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-4 py-2" />
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setShowDateFilter(false);
              }}
              className="bg-gray-200 rounded-lg px-4 py-2"
            >
              Clear Dates
            </button>
          </div>
        )}

        {/* BLOG LIST */}
        {currentBlogs.length === 0 ? (
          <p className="text-gray-500 text-center">No blogs found</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>By {blog.author?.email}</p>
                  {blog.createdAt?.seconds && <p>{new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>}
                </div>
                <Link href={`/blog/${blog.id}`} className="text-red-700 font-medium hover:underline">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
