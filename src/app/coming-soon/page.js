"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="relative mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full"></div>
            <i className="fa-solid fa-person-digging text-5xl text-primary relative z-10"></i>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            We're working on this!
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            This highly anticipated feature is currently under active development. Our team is building something amazing, and it will be available soon. Please check back later.
          </p>
          
          <div className="pt-8">
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-primary hover:bg-emerald-600 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <i className="fa-solid fa-arrow-left"></i> Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
