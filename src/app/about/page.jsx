"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Terminal, Code2, Globe, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#050000] font-sans p-2 sm:p-4 selection:bg-red-500/30 text-white pb-20">
      {/* 🚀 Cinematic Hero Section */}
      <section className="relative w-full h-[60vh] border-[2px] sm:border-[3px] border-[#ff3535] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden flex flex-col bg-[#050000] shadow-[0_0_50px_rgba(255,0,0,0.15)] mb-12">
        
        {/* Background Gradients & Web Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Top Nav */}
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-10 py-8">
          <Link href="/" className="w-8 h-8 flex items-center justify-center group cursor-pointer">
            <Sparkles className="w-6 h-6 text-white group-hover:text-red-500 transition-colors" />
          </Link>
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
            About Us
          </div>
        </nav>

        {/* Central Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-4"
          >
             <span className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest font-bold">
               The Mission
             </span>
          </motion.div>
          
          {/* Layered Text Concept */}
          <div className="relative flex items-center justify-center">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-none text-white whitespace-nowrap"
            >
              WHO WE ARE
            </motion.h1>
          </div>
        </div>

        {/* Bottom Borders */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
          <span>01. ORIGINS</span>
          <span>02. VISION</span>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="h-full p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Globe className="w-32 h-32 text-white" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
               <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ff3535]" />
               The Journey
             </h2>
             <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
               Welcome to our tech sanctuary! This platform is created for developers, thinkers, and innovators who love exploring new paradigms and staying ahead of the curve.
             </p>
             <p className="text-sm text-gray-400 leading-relaxed font-medium">
               Our goal is to dissect complex architectural patterns and deliver high-quality, easy-to-understand content that transforms novices into architects. We believe that knowledge grows when it is shared.
             </p>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <div className="h-full p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Terminal className="w-32 h-32 text-white" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
               <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ff3535]" />
               What We Do
             </h2>
             <ul className="space-y-5 text-sm text-gray-400 font-medium">
               <li className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   <Code2 className="w-4 h-4 text-red-500" />
                 </div>
                 Write practical, deep-dive posts
               </li>
               <li className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   <Code2 className="w-4 h-4 text-red-500" />
                 </div>
                 Share bleeding-edge tutorials
               </li>
               <li className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   <Code2 className="w-4 h-4 text-red-500" />
                 </div>
                 Explore modern JS frameworks
               </li>
               <li className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   <Code2 className="w-4 h-4 text-red-500" />
                 </div>
                 Help beginners build their first app
               </li>
             </ul>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="max-w-4xl mx-auto mt-6 mb-16 px-4"
      >
        <div className="p-12 text-center rounded-[2rem] bg-gradient-to-br from-red-900/20 to-[#050000] border border-red-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-500" />
          <Rocket className="w-12 h-12 text-red-500 mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-500" />
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Join Our Universe</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            Read our blogs, share your architectural insights, and let's push the web forward together.
          </p>
          <Link
            href="/allblogs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-105 transition-all duration-300 relative z-10"
          >
            Explore Articles
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
