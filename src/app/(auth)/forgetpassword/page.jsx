"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/auth";
import Image from "next/image";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email ✅");
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-red-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-extrabold text-red-600 text-center mb-2">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Enter your registered email and we’ll send you a reset link
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Messages */}
          {message && (
            <p className="mt-4 text-sm text-green-600 text-center">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-red-500 hover:underline font-semibold"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 hidden md:block relative min-h-screen">
              <Image
                src="/images/forget.jpg"
                alt="forget password Illustration"
                fill
                className="object-fit opacity-80"
                priority
              />
            </div>
    </div>
  );
}
