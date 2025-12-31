"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/fireStore";
import { useRouter } from "next/navigation";

const Register = () => {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("Registered User:", userCredential.user);
      alert("User Registered Successfully ✅");

      // clear form
      setFormData({ email: "", password: "" });

      // redirect to login page
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
          onSubmit={onSubmitHandler}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-extrabold text-center mb-6 text-red-600">
            Register Now
          </h2>

          <div className="mb-4">
            <label className="block text-md font-semibold mb-1">Email</label>
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
            <label className="block text-md font-semibold mb-1">Password</label>
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
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-900 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-red-500 hover:underline font-bold"
            >
              Login
            </button>
          </p>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 hidden md:flex items-center justify-center bg-blue-100 h-full">
        <img
          src="https://images.unsplash.com/photo-1766767673683-168676b97f4c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your image path
          alt="Register Illustration"
          className="object-fit max-h-screen w-full rounded-l-lg opacity-70"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Register;
