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
    <>
    <style>{`
      @keyframes dropdownFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
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
                <div
                  className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: "rgba(15, 15, 25, 0.85)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    animation: "dropdownFadeIn 0.2s ease forwards",
                  }}
                >
                  {/* User Info Header */}
                  <div className="px-4 py-4 flex items-center gap-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-base flex-shrink-0 ${avatarColor}`}>
                      {userInitial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white/90 truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 px-2">
                    <Link
                      href="/profile"
                      onClick={() => setOpenDesktopProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all duration-150"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontSize: "16px" }}>👤</span>
                      <span>Your Profile</span>
                    </Link>

                    <Link
                      href="/myblogs"
                      onClick={() => setOpenDesktopProfile(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all duration-150"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontSize: "16px" }}>📝</span>
                      <span>My Blogs</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 12px" }} />

                  {/* Sign Out */}
                  <div className="py-2 px-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                    >
                      <span style={{ fontSize: "16px" }}>🚪</span>
                      <span>Sign out</span>
                    </button>
                  </div>
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
                <div
                  className="mt-3 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(15, 15, 25, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    animation: "dropdownFadeIn 0.2s ease forwards",
                  }}
                >
                  <div className="py-1 px-2">
                    <Link
                      href="/profile"
                      onClick={() => { setOpenMobileProfile(false); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all duration-150"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontSize: "15px" }}>👤</span>
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      href="/myblogs"
                      onClick={() => { setOpenMobileProfile(false); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/8 transition-all duration-150"
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontSize: "15px" }}>📝</span>
                      <span>My Blogs</span>
                    </Link>
                  </div>
                </div>
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
    </>
  );
}
