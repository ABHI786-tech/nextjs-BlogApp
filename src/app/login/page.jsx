"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/auth";
import { useRouter } from "next/navigation";

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

      console.log("Logged In User:", userCredential.user);
      alert("Login Successful ✅");

      // clear form
      setFormData({ email: "", password: "" });

      // redirect after login
      router.push("/");

    } catch (error) {
      alert(error.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Login Now
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={inputHandler}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={inputHandler}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot password */}
        <p className="text-sm text-center mt-4">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-blue-700 hover:underline"
          >
            Forgot Password?
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
