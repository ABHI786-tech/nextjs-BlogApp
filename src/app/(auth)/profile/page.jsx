"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/auth";
import  {getAvatarColor}  from "../../lib/avtarColor";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";



export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);



  // 🔐 Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setName(currentUser.displayName || "");
      }
    });

    return () => unsub();
  }, [router]);

  // ✏️ Update profile
  const handleUpdateProfile = async () => {
    if (!name.trim()) return alert("Name cannot be empty");

    if (newPassword || confirmPassword) {
      if (newPassword.length < 6)
        return alert("Password must be at least 6 characters");

      if (newPassword !== confirmPassword)
        return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      alert("Profile updated successfully ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // 🔤 First Letter
  const firstLetter =
    user.displayName?.charAt(0).toUpperCase() ||
    user.email.charAt(0).toUpperCase();

  // 🎨 Avatar Color (same user = same color)
  const avatarColor = getAvatarColor(user.email || user.uid);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-gray-100 flex items-center justify-center py-26 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* 👤 Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className={`h-28 w-28 rounded-full flex items-center justify-center 
            text-white text-4xl font-bold shadow-lg ${avatarColor}`}
          >
            {firstLetter}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          My Profile
        </h2>

        {/* 📧 Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 w-full px-4 py-2 rounded-lg border bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 🧑 Name */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* 🔐 Password Section */}
        <h3 className="text-lg font-semibold mt-3 mb-1">
          Change Password
        </h3>

        <PasswordInput
          label="Old Password"
          value={oldPassword}
          setValue={setOldPassword}
          show={showOld}
          setShow={setShowOld}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          setValue={setNewPassword}
          show={showNew}
          setShow={setShowNew}
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
        />

        {/* ✅ Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="mt-4 w-full bg-[var(--button-color)] text-white py-2.5 rounded-lg font-semibold hover:bg-red-800 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}

/* 🔐 Reusable Password Input */
function PasswordInput({ label, value, setValue, show, setShow }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 pr-12 rounded-lg border focus:ring-2 focus:ring-red-500 outline-none"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
