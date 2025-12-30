"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/auth";

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
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
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
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
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
