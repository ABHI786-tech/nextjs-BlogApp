"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/auth";
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
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">
          Register Now
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
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Already have account */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
