# Blog App

A modern, scalable full-stack blog platform built with a powerful tech stack, enabling seamless content creation, user authentication, and an engaging user experience.

## ✨ Overview

This application provides a complete blogging ecosystem where users can create, manage, and explore blog content efficiently. It is designed with performance, responsiveness, and scalability in mind using modern web technologies.

## 🔑 Key Features
🔐 Authentication System
User registration, login, password reset
Secure authentication with Firebase
User profile management
📝 Blog Management
Create, edit, delete blog posts
Rich content display with images
Personalized "My Blogs" section
🔍 Search & Filtering
Advanced blog search functionality
Dynamic filtering options for better discoverability
📄 Pagination
Optimized data loading for better performance
🖼️ Image Upload
Cloud-based image storage using Cloudinary
📱 Responsive UI
Fully responsive design using Tailwind CSS
🎬 Smooth Animations
Enhanced UI experience with Framer Motion
🤖 Chatbot Integration
Built-in chatbot for user assistance
🛠️ Tech Stack
Frontend
Next.js 16
React 19
TypeScript
Backend & Services
Firebase (Authentication & Firestore)
Cloudinary (Image Storage)
UI & Utilities
Tailwind CSS
Framer Motion
date-fns
Lucide React
⚙️ Getting Started
📌 Prerequisites

Ensure you have the following installed:

Node.js (v18 or higher)
npm or yarn
Firebase Project
Cloudinary Account
📥 Installation
# Clone the repository
git clone <repository-url>

# Navigate into the project directory
cd nextjs-BlogApp

# Install dependencies
npm install
🔐 Environment Variables

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
▶️ Run the Application
npm run dev

Open your browser and visit:
👉 http://localhost:3000

📜 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build for production
npm run start	Run production server
npm run lint	Run ESLint checks
📂 Project Structure
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── profile/
│   │   ├── forgetpassword/
│   │   └── resetpassword/
│   ├── about/
│   ├── allblogs/
│   ├── blog/[id]/
│   ├── create-blog/
│   ├── editblog/[id]/
│   ├── myblogs/
│   ├── api/upload/
│   ├── components/
│   ├── lib/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
🤝 Contributing

Contributions are welcome! Follow these steps:

# Fork the repository
# Create your feature branch
git checkout -b feature/YourFeature

# Commit your changes
git commit -m "Add YourFeature"

# Push to GitHub
git push origin feature/YourFeature

Then open a Pull Request 🚀
