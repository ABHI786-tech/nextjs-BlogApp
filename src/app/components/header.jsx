"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-blue-600/90 backdrop-blur-md shadow-lg">
      <div className="max-w-screen mx-auto px-4 py-4 flex items-center justify-between text-white">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          NEXT<span className="text-blue-200">NEWS</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden focus:outline-none"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium mr-14">
          {navItems.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className="hover:text-blue-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* <li>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition">
              Login
            </button>
          </li> */}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-blue-700 text-white shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-500">
          <span className="text-xl font-bold">
            NEXT<span className="text-blue-200">NEWS</span>
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-6 p-6 text-lg">
          {navItems.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-blue-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}

          <li className="mt-6">
            <button className="w-full bg-white text-blue-600 py-2 rounded-full font-semibold hover:bg-blue-100 transition">
              Login
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
