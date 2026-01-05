"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const ForgetPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent 📧");
      router.push("/login");
    } catch (error) {
      alert(error.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-blue-50 p-6">
        <form
          onSubmit={handleResetPassword}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-extrabold text-center mb-6 text-red-600">
            Reset Password
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Enter your registered email. We will send you a reset link.
          </p>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-md font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--button-color)] text-white py-2 rounded hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-sm text-center mt-4">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-red-500 hover:underline font-bold"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 hidden md:block relative min-h-screen">
        <Image
          src="/images/forget.jpg"
          alt="Reset Password Illustration"
          fill
          className="object-fit opacity-80"
          priority
        />
      </div>
    </div>
  );
};

export default ForgetPassword;
