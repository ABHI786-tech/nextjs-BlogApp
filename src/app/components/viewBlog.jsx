"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, app } from "../lib/auth";
import { MessageCircle, ArrowLeft, Send } from "lucide-react";

export default function ViewBlog() {
  const { id } = useParams();
  const db = getFirestore(app);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 📄 Fetch blog
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPost(docSnap.data());
      setLoading(false);
    };
    fetchPost();
  }, [id, db]);

  // 💬 Fetch comments
  useEffect(() => {
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsub();
  }, [db, id]);

  // ➕ Add comment
  const handleComment = async () => {
    if (!commentText.trim()) return;
    await addDoc(collection(db, "posts", id, "comments"), {
      text: commentText,
      userEmail: user.email,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setCommentText("");
  };

  // -------------------------------------------------------
  // 🖼️ Smart Content Renderer
  // Detects image / video / YouTube URLs anywhere in content
  // and renders them as actual media — not as links.
  // -------------------------------------------------------
  const renderContent = (content) => {
    if (!content) return null;

    // Split on URLs while keeping the URL in the result array
    const URL_SPLIT = /(https?:\/\/[^\s]+)/g;

    const isYouTube = (url) =>
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/.test(url);

    const getYouTubeId = (url) => {
      const m = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
      );
      return m ? m[1] : null;
    };

    const isImage = (url) =>
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(url) ||
      /firebasestorage\.googleapis\.com.*\.(jpg|jpeg|png|gif|webp|svg)/i.test(url);

    const isVideo = (url) =>
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) ||
      /firebasestorage\.googleapis\.com.*\.(mp4|webm|ogg|mov)/i.test(url);

    // Renders a single URL as media or a plain link
    const renderUrl = (url, key) => {
      if (isYouTube(url)) {
        return (
          <div key={key} className="my-6 rounded-2xl overflow-hidden shadow-lg w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(url)}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        );
      }
      if (isVideo(url)) {
        return (
          <div key={key} className="my-6 rounded-2xl overflow-hidden shadow-lg">
            <video
              src={url}
              controls
              className="w-full rounded-2xl max-h-[500px] object-contain bg-black"
            />
          </div>
        );
      }
      if (isImage(url)) {
        return (
          <div key={key} className="my-6 rounded-2xl overflow-hidden shadow-md">
            <img
              src={url}
              alt="Blog media"
              className="w-full object-contain rounded-2xl max-h-[500px]"
            />
          </div>
        );
      }
      // Non-media URL → clickable link
      return (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline underline-offset-2 hover:text-red-800 break-all"
        >
          {url}
        </a>
      );
    };

    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();

      // Empty line → spacer
      if (!trimmed) return <div key={lineIdx} className="h-4" />;

      // Split line into [text, url, text, url, ...] parts
      const parts = trimmed.split(URL_SPLIT);

      // Entire line is a single URL → block-level media
      if (parts.length === 3 && parts[0] === "" && parts[2] === "") {
        return (
          <div key={lineIdx}>
            {renderUrl(parts[1], `${lineIdx}-0`)}
          </div>
        );
      }

      // Mixed line: inline text + media/links
      return (
        <p key={lineIdx} className="mb-4 text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
          {parts.map((part, i) =>
            /^https?:\/\//.test(part)
              ? renderUrl(part, `${lineIdx}-${i}`)
              : part
          )}
        </p>
      );
    });
  };

  // -------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Blog not found</h2>
        <Link href="/" className="text-red-600 font-medium hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* 🔙 BACK */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm text-gray-500 font-semibold hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Posts
        </Link>

        {/* 📝 BLOG CARD */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-12"
        >
          {post.imageUrl && (
            <div className="relative w-full h-[40vh] md:h-[60vh]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 text-white">
                <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase bg-red-600 rounded-full mb-6 shadow-lg shadow-red-600/30">
                  Article
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-md">
                  {post.title}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border border-white/30">
                    {post.author?.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="font-semibold text-white/90">
                      {post.author?.email?.split("@")[0] || post.author?.email}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!post.imageUrl && (
            <div className="p-8 sm:p-12 pb-0">
              <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest text-red-700 uppercase bg-red-50 rounded-full mb-6">
                Article
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
                  {post.author?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author?.email?.split("@")[0] || post.author?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 📄 Blog Content */}
          <div className="p-8 sm:p-12 pt-8 max-w-none leading-relaxed text-gray-700">
            {renderContent(post.content)}
          </div>
        </motion.article>

        {/* 💬 COMMENTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Discussion ({comments.length})
            </h3>
          </div>

          {/* ✍️ WRITE COMMENT */}
          {user ? (
            <div className="mb-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold shrink-0 mt-1">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Join the conversation..."
                    className="w-full rounded-2xl bg-gray-50/50 border border-gray-200 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500 transition-all resize-none placeholder:text-gray-400"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Reply
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-10 border border-gray-100">
              <p className="text-gray-600 font-medium">
                Want to join the discussion?{" "}
                <Link href="/login" className="text-red-600 font-bold hover:underline">
                  Sign in to your account
                </Link>
              </p>
            </div>
          )}

          {/* 📃 COMMENT LIST */}
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 font-medium">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={comment.id}
                  className="group flex gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0 border border-gray-200 shadow-sm">
                    {comment.userEmail?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow bg-gray-50/80 rounded-2xl p-5 border border-gray-100 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-900">
                        {comment.userEmail?.split("@")[0]}
                      </p>
                      <span className="text-xs font-medium text-gray-400">
                        {comment.createdAt
                          ? new Date(comment.createdAt.toDate()).toLocaleDateString()
                          : "Just now"}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
