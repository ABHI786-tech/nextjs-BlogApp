"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { app } from "../lib/auth";
import { Searchbar, FilterPosts } from "../components/searchbar";
import Pagination from "../components/Pagination";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BLOGS_PER_PAGE = 12;

export default function AllBlogs() {
  const db = getFirestore(app);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  const { startDate, endDate } = dateRange[0];

  /* Fetch Blogs */
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, [db]);

  /* Search + Date Filter */
  const filteredBlogs = useMemo(() => {
    let blogs = FilterPosts(posts, search);

    if (!startDate || !endDate) return blogs;

    return blogs.filter((blog) => {
      if (!blog.createdAt?.seconds) return false;
      const date = new Date(blog.createdAt.seconds * 1000);
      return date >= startDate && date <= endDate;
    });
  }, [posts, search, startDate, endDate]);

  /* Pagination */
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);

  const currentBlogs = useMemo(
    () =>
      filteredBlogs.slice(
        (currentPage - 1) * BLOGS_PER_PAGE,
        currentPage * BLOGS_PER_PAGE
      ),
    [filteredBlogs, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">All Blogs</h1>
          <p className="text-gray-500 mt-1">
            Search and filter blogs by date
          </p>
        </header>

        <div className="mb-6 flex items-center gap-3">
          <Searchbar value={search} onChange={(e) => setSearch(e.target.value)} />

          <button
            onClick={() => setShowDateFilter((v) => !v)}
            className="border rounded-lg px-3 py-2 flex items-center gap-1"
          >
            <Calendar size={18} />
            <span className="hidden sm:block text-sm">
              {startDate && endDate
                ? `${format(startDate, "dd MMM")} - ${format(
                    endDate,
                    "dd MMM"
                  )}`
                : "Date"}
            </span>
          </button>
        </div>

        {showDateFilter && (
          <div className="mb-6 bg-white rounded-xl shadow p-4 w-fit">
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              editableDateInputs
              moveRangeOnFirstSelection={false}
            />

            <button
              onClick={() => {
                setDateRange([
                  { startDate: null, endDate: null, key: "selection" },
                ]);
                setShowDateFilter(false);
              }}
              className="mt-3 bg-gray-200 rounded-lg px-4 py-2 w-full"
            >
              Clear Date Range
            </button>
          </div>
        )}

        {currentBlogs.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No blogs found</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentBlogs.map((blog) => (
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
                  </div>
                ) : (
                  <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">No Image</span>
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
                    {blog.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-700 truncate max-w-[130px]">{blog.author?.email?.split("@")[0]}</p>
                      {blog.createdAt?.seconds && (
                        <p className="text-xs text-gray-400">
                          {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
