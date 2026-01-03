"use client";
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-5">
      {/* Hero Section */}
      <section className="bg-red-900/90 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About Our Blog
          </h1>
          <p className="text-lg md:text-xl text-red-100">
            Sharing knowledge, ideas, and stories that inspire
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to our blog! This platform is created for readers who love
            learning, exploring new ideas, and staying updated with the latest
            trends in technology, lifestyle, and development.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our goal is to provide high-quality, easy-to-understand content
            that helps beginners as well as experienced readers grow their
            knowledge.
          </p>
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What We Do
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>✅ Write informative and practical blog posts</li>
            <li>✅ Share tutorials and guides</li>
            <li>✅ Explore latest trends and technologies</li>
            <li>✅ Help beginners learn step-by-step</li>
          </ul>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make learning simple and accessible for everyone.
            We believe that knowledge grows when it is shared, and through this
            blog, we aim to create a community of curious and passionate learners.
          </p>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-red-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Join Our Journey
          </h2>
          <p className="text-gray-600 mb-6">
            Read our blogs, share your thoughts, and grow with us.
          </p>
          <a
            href="/blogs"
            className="inline-block bg-[var(--button-color)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Explore Blogs
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
