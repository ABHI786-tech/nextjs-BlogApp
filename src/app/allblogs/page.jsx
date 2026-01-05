"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { app } from "../lib/auth";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import Pagination from "../components/Pagination";
import { Searchbar, FilterPosts } from "../components/searchbar";

import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function AllBlogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

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
      setPosts(blogsArr);
    });

    return () => unsubscribe();
  }, [db]);

  // 🔍 Search filter
  let filteredBlogs = FilterPosts(posts, search);

  // 📅 Date range filter
  const { startDate, endDate } = dateRange[0];

  if (startDate && endDate) {
    filteredBlogs = filteredBlogs.filter((blog) => {
      const blogDate = blog.createdAt?.seconds
        ? new Date(blog.createdAt.seconds * 1000)
        : null;

      return blogDate && blogDate >= startDate && blogDate <= endDate;
    });
  }

  // 📄 Pagination
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">All Blogs</h1>
          <p className="text-gray-500 mt-1">
            Search and filter blogs by date
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="mb-6 flex items-center gap-3">
          <Searchbar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
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

        {/* DATE RANGE PICKER */}
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
                  {
                    startDate: null,
                    endDate: null,
                    key: "selection",
                  },
                ]);
                setShowDateFilter(false);
              }}
              className="mt-3 bg-gray-200 rounded-lg px-4 py-2 w-full"
            >
              Clear Date Range
            </button>
          </div>
        )}

        {/* BLOG LIST */}
        {currentBlogs.length === 0 ? (
          <p className="text-gray-500 text-center">No blogs found</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {currentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition p-6"
              >
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>By {blog.author?.email}</p>
                  {blog.createdAt?.seconds && (
                    <p>
                      {new Date(
                        blog.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Link
                  href={`/blog/${blog.id}`}
                  className="text-red-700 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
