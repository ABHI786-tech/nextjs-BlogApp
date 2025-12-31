"use client";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      alert("Login Successful ✅");
      router.push("/");
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
          onSubmit={onSubmitHandler}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-extrabold text-center mb-6 text-red-600">
            Login Now
          </h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-md font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={inputHandler}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-md font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={inputHandler}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* 🔐 Forgot Password */}
          <div className="text-right mb-4">
            <Link  href={"/forgetpassword"}
              type="button"
              className="text-sm text-red-500 hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-900 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-red-500 hover:underline font-bold"
            >
              Register
            </button>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 hidden md:flex items-center justify-center bg-blue-100">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Login Illustration"  
          className="object-cover h-full w-full rounded-l-lg opacity-70"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Login;
