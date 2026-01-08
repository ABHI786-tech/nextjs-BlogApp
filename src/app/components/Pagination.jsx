"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex justify-center">
      <ul className="flex items-center space-x-2 text-sm">
        {/* Previous */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-indigo-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Previous</span>
            <motion.svg
              whileHover={{ x: -2 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((page) => (
          <li key={page}>
            <motion.button
              onClick={() => onPageChange(page)}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium focus:outline-none transition-all duration-300 ${
                page === currentPage
                  ? "bg-indigo-500 text-white shadow-lg animate-pulse"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100 hover:text-indigo-600"
              }`}
            >
              {page}
            </motion.button>
          </li>
        ))}

        {/* Next */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm hover:bg-indigo-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Next</span>
            <motion.svg
              whileHover={{ x: 2 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </button>
        </li>
      </ul>
    </div>
  );
}
