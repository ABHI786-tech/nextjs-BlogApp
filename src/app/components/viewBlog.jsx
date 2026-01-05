"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
import { MessageCircle, View } from "lucide-react";

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
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="max-w-4xl mx-auto">

        {/* 🔙 BACK */}
        <Link
          href="/"
          className="inline-block mb-6 text-sm text-red-700 font-medium hover:underline"
        >
          ← Back to Home
        </Link>

        {/* 📝 BLOG CARD */}
        <article className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <span>By</span>
            <span className="font-medium text-gray-700">
              {post.author?.email}
            </span>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-line">
              {post.content}
            </p>
          </div>
        </article>

        {/* 💬 COMMENTS */}
        <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="text-red-600" size={22} />
            <h3 className="text-2xl font-semibold text-gray-900">
              Comments ({comments.length})
            </h3>
          </div>

          {/* ✍️ WRITE COMMENT */}
          {user ? (
            <div className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full rounded-xl border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleComment}
                  className="bg-[var(--button-color)] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-800 transition"
                >
                  Post Comment
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-8">
              Please{" "}
              <Link href="/login" className="text-red-700 font-medium">
                login
              </Link>{" "}
              to join the discussion.
            </p>
          )}

          {/* 📃 COMMENT LIST */}
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No comments yet. Be the first one 🚀
            </p>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {comment.userEmail}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
