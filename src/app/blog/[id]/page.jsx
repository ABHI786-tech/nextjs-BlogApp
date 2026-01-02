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
import { auth, app } from "../../lib/auth";

export default function BlogDetails() {
  const { id } = useParams();
  const db = getFirestore(app);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
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
      if (docSnap.exists()) {
        setPost(docSnap.data());
      }
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
      const commentsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArr);
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

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!post) return <p className="text-center mt-20">Blog not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/" className="text-red-700 hover:underline text-sm">
          ← Back to Home
        </Link>

        {/* 📝 BLOG CONTAINER */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 sm:p-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            By {post.author?.email}
          </p>

          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p className="whitespace-pre-line">
              {post.content}
            </p>
          </div>
        </div>

        {/* 💬 COMMENTS CONTAINER */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-semibold mb-4">Comments</h3>

          {/* Write comment */}
          {user ? (
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
              />
              <button
                onClick={handleComment}
                className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
              >
                Post Comment
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mb-6">
              Please{" "}
              <Link href="/login" className="text-red-700 font-medium">
                login
              </Link>{" "}
              to comment.
            </p>
          )}

          {/* Show comments */}
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {comment.userEmail}
                  </p>
                  <p className="text-gray-700">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
