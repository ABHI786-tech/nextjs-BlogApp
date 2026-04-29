# Blog App

A modern, full-stack blog application built with Next.js, featuring user authentication, blog creation, editing, and a responsive design.

## Features

- **User Authentication**: Login, register, password reset, and user profiles
- **Blog Management**: Create, edit, view, and delete blog posts
- **Search & Filter**: Advanced search functionality with filtering options
- **Pagination**: Efficient loading of blog posts with pagination
- **Image Upload**: Cloudinary integration for image uploads
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Animations**: Smooth animations using Framer Motion
- **Chatbot**: Integrated chatbot for user assistance

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Image Storage**: Cloudinary
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase project
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nextjs-BlogApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
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
│   │   ├── header.jsx
│   │   ├── Footer.jsx
│   │   ├── searchbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── viewBlog.jsx
│   │   └── chatbot.jsx
│   ├── lib/
│   │   ├── auth.js
│   │   └── avtarColor.js
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.