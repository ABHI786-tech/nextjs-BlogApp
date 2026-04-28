"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/auth";
import { getAvatarColor } from "../../lib/avtarColor";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldCheck, Camera, Save, Lock, Eye, EyeOff } from "lucide-react";

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

  // 🎨 Avatar Color
  const avatarColor = getAvatarColor(user.email || user.uid);

  return (
    <div className="min-h-screen bg-gray-50/50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your profile information and security settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="relative group">
                <div
                  className={`h-24 w-24 rounded-full flex items-center justify-center 
                  text-white text-3xl font-bold shadow-inner ring-4 ring-white border border-gray-100 ${avatarColor}`}
                >
                  {firstLetter}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-colors">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-lg font-bold text-gray-900">{name || "Your Name"}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="mt-6 w-full pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Account Verified</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={18} className="text-blue-500" />
                  <span>Email Sync Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-red-600" />
                  Personal Information
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Lock size={18} className="text-red-600" />
                  Security & Password
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <PasswordInput
                  label="Old Password"
                  value={oldPassword}
                  setValue={setOldPassword}
                  show={showOld}
                  setShow={setShowOld}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔐 Reusable Password Input */
function PasswordInput({ label, value, setValue, show, setShow }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
