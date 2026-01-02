"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/auth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "My Blog", href: "/myblog" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  // 🔐 Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    setOpenProfile(false);
    setIsMobileMenuOpen(false);
  };

  // 🔤 First letter logic
  const userInitial =
    user?.displayName
      ? user.displayName.charAt(0).toUpperCase()
      : user?.email
        ? user.email.charAt(0).toUpperCase()
        : "";

  // 🔁 Filter nav
  const filteredNavItems = navItems.filter((item) =>
    user ? item.name !== "Login" && item.name !== "Register" : true
  );

  return (
    <nav className="fixed top-3 left-5 right-5 bg-gray-400/50 backdrop-blur-lg shadow-lg rounded-4xl px-6 z-50">
      <div className="max-w-screen mx-auto px-4 py-4 flex items-center justify-between">

        {/* 🔵 Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          BLOG <span className="text-red-500">APP</span>
        </Link>

        {/* 📱 Mobile toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 🖥️ Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium">
          {filteredNavItems.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={`${pathname === item.href
                  ? "text-white font-semibold"
                  : "hover:text-gray-300"
                  }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* 👤 Profile dropdown */}
          {user && (
            <li className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="h-9 w-9 rounded-full bg-red-700 text-white flex items-center justify-center font-semibold"
              >
                {userInitial}
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-48 rounded-md bg-gray-800 shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-400 border-b border-white/10">
                    {user.email}
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setOpenProfile(false)}
                  >
                    Your Profile
                  </Link>

                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setOpenProfile(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* 📱 Mobile Menu */}


      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-800 rounded-2xl text-white transform transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
          } lg:hidden`}
      >

        <div className="flex items-center justify-between bg-gray-800  rounded-2xl p-4 border-b">
          <Link href="/" className="text-2xl font-bold">
            BLOG <span className="text-red-500">APP</span>
          </Link>


          <button onClick={() => setIsMobileMenuOpen(false)}>
            ✕
          </button>

        </div>


        <ul className="flex flex-col gap-6 p-6 text-lg bg-gray-800 rounded-2xl">
          {user && (
            <div className="relative lg:hidden flex items-center gap-2" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full"
              >
                <div className="h-8 w-8 rounded-full bg-red-700 flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
              
              <span>
                    <div className="px-4 py-2 text-md text-gray-400 border-b border-white/10 truncate">
                      {user.email}
                    </div>
                {openProfile && (
                  <div className="absolute right-0 top-12 w-48 rounded-md bg-gray-800 shadow-lg z-50">

                    <Link
                      href="/profile"
                      onClick={() => {
                        setOpenProfile(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    >
                      Your Profile
                    </Link>
                  </div>
                )}
              </span>
              </button>
            </div>
          )}

          {/* <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
                  >
                    Sign out
                  </button> */}


          {filteredNavItems.map((item, i) => (
            <li key={i}>
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
      </div >
    </nav >
  );
}
