// lib/avatarColor.js

export const getAvatarColor = (value) => {
  if (!value) return "bg-gray-700";

  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-gray-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  return colors[Math.abs(hash) % colors.length];
};
