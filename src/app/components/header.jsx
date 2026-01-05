"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/auth";
import { getAvatarColor } from "../lib/avtarColor"; // ✅ added

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openDesktopProfile, setOpenDesktopProfile] = useState(false);
  const [openMobileProfile, setOpenMobileProfile] = useState(false);
  const desktopProfileRef = useRef(null);
  const mobileProfileRef = useRef(null);

  // console.log(pathname, "pathname")
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blogs", href: "/allblogs" },
    { name: "My Blogs", href: "/myblogs" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  // 🔐 Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ❌ Outside Click Close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(e.target)
      ) {
        setOpenDesktopProfile(false);
      }

      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      ) {
        setOpenMobileProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    setOpenDesktopProfile(false);
    setOpenMobileProfile(false);
    setIsMobileMenuOpen(false);
  };

  // 🔤 User Initial
  const userInitial =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "";

  // 🎨 SAME avatar color as Profile Page
  const avatarColor = user ? getAvatarColor(user.email) : "bg-gray-500";

  // 🔁 Filter Nav Items
  const filteredNavItems = navItems.filter((item) =>
    user ? item.name !== "Login" && item.name !== "Register" : true
  );

  return (
    <nav className="fixed top-3 left-5 right-5 z-50 bg-gray-400/50 backdrop-blur-lg rounded-4xl shadow-lg">
      <div className="max-w-screen mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🔵 Logo */}
        <Link href="/" className="text-2xl font-bold">
          BLOG <span className="text-red-500">APP</span>
        </Link>

        {/* 📱 Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 🖥 Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium">
          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "text-white font-semibold"
                    : "hover:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* 👤 Desktop Profile */}
          {user && (
            <li className="relative" ref={desktopProfileRef}>
              <button
                onClick={() => setOpenDesktopProfile(!openDesktopProfile)}
                className={`h-9 w-9 rounded-full flex items-center justify-center 
                text-white font-semibold ${avatarColor}`}
              >
                {userInitial}
              </button>

              {openDesktopProfile && (
                <div className="absolute right-0 mt-3 w-48 rounded-md text-white bg-gray-800 shadow-lg">
                  <div className="px-4 py-2 text-sm border-b">
                    {user.email}
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setOpenDesktopProfile(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/5"
                  >
                    Your Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* 📱 Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 rounded-2xl text-white transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
        }`}
      >
        <div className="p-4 border-b flex justify-between bg-gray-900 rounded-2xl items-center">
          <Link href="/" className="text-xl font-bold">
            BLOG <span className="text-red-500">APP</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>

        <ul className="flex flex-col gap-6 p-6 bg-gray-900 rounded-2xl">
          {user && (
            <li ref={mobileProfileRef}>
              <button
                onClick={() => setOpenMobileProfile(!openMobileProfile)}
                className="flex items-center gap-3"
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center 
                  justify-center font-semibold text-white ${avatarColor}`}
                >
                  {userInitial}
                </div>
                <span className="truncate text-sm">{user.email}</span>
              </button>

              {openMobileProfile && (
                <Link
                  href="/profile"
                  onClick={() => {
                    setOpenMobileProfile(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block mt-3 pl-11 text-sm hover:text-gray-300"
                >
                  Your Profile
                </Link>
              )}
            </li>
          )}

          {filteredNavItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-gray-300"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 py-2 rounded-full"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
