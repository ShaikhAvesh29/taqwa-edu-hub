"use client";
import { useState } from "react";
import Link from "next/link";

export default function CourseDashboard() {
  const isEnrolled = false;
  const [activeTab, setActiveTab] = useState("Lectures");

  const sidebarItems = [
    { name: "Lectures", icon: "fa-video" },
    { name: "Notes", icon: "fa-book-open" },
    { name: "Resources", icon: "fa-folder-open" },
    { name: "Important Notices", icon: "fa-bell" },
  ];

  const dummyFaculties = [
    {
      name: "Arsh",
      subject: "Maths & Physics",
      bio: "An expert Computer Engineer who brings complex technical concepts to life through real-world applications.",
      avatar: "https://ui-avatars.com/api/?name=Arsh&background=16a34a&color=fff"
    },
    {
      name: "Obair",
      subject: "Biology",
      bio: "A medical doctor simplifying biology and human anatomy for board-level mastery.",
      avatar: "https://ui-avatars.com/api/?name=Obair&background=15803d&color=fff"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors">

      {/* ─── SIDEBAR ─── */}
      <aside className="w-full md:w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 z-10 transition-colors">
        {/* Back link */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors text-sm font-medium">
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Back to Courses
          </Link>
        </div>

        {/* Nav buttons */}
        <nav className="p-4 flex flex-col gap-1.5">
          <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 px-3 mb-2">Course Menu</p>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left
                ${activeTab === item.name
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span className="flex items-center gap-3">
                <i className={`fa-solid ${item.icon} w-5 text-center ${activeTab === item.name ? "text-green-600" : "text-gray-400"}`}></i>
                {item.name}
              </span>
              {!isEnrolled && (
                <span className="text-gray-400 text-xs">🔒</span>
              )}
            </button>
          ))}
        </nav>

        {/* Enroll CTA in sidebar (mobile-friendly) */}
        {!isEnrolled && (
          <div className="mt-auto p-5 border-t border-gray-100">
            <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
              Enroll in This Batch
            </button>
          </div>
        )}
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">

        {/* Page header */}
        <header className="mb-10">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-green-50 dark:bg-gray-900 text-green-700 dark:text-green-500 text-xs font-bold uppercase tracking-widest border border-green-100 dark:border-green-900">
            Batch Details
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
            10th ICSE Programs
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl leading-relaxed">
            Master the fundamentals of the ICSE curriculum with daily assessments and expert guidance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* ─── BATCH INFORMATION (always visible) ─── */}
          <section className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-sm transition-colors">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-3">
              <i className="fa-solid fa-circle-info border-2 border-green-100 rounded-full p-1"></i>
              Batch Information
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover the detailed syllabus, interactive session timings, assessment schedules, and the complete roadmap designed to build absolute confidence in the subject matter. Start mastering the concepts today with our guided interactive modules.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-4 text-gray-800 text-sm font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <i className="fa-solid fa-check"></i>
                </div>
                <span className="mt-1">Daily interactive live sessions</span>
              </li>
              <li className="flex items-start gap-4 text-gray-800 text-sm font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <i className="fa-solid fa-check"></i>
                </div>
                <span className="mt-1">Weekly assessment &amp; mock tests</span>
              </li>
              <li className="flex items-start gap-4 text-gray-800 text-sm font-medium bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <i className="fa-solid fa-check"></i>
                </div>
                <span className="mt-1">One-on-one doubt clearing sessions</span>
              </li>
            </ul>
          </section>

          {/* ─── FACULTY SECTION (always visible) ─── */}
          <section className="col-span-1 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Faculties</h2>
            <div className="flex flex-col gap-6">
              {dummyFaculties.map((faculty, idx) => (
                <div key={idx} className="flex gap-4 items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{faculty.name}</h3>
                    <p className="text-green-600 text-xs font-semibold uppercase tracking-wider mb-2 mt-1">{faculty.subject}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{faculty.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ─── CONDITIONAL: Course Materials (locked / unlocked) ─── */}
        {isEnrolled ? (
          /* UNLOCKED STATE */
          <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 shadow-sm transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeTab}</h2>
            <p className="text-gray-600">
              Content for <span className="font-semibold">{activeTab}</span> will appear here.
            </p>
          </section>
        ) : (
          /* LOCKED STATE */
          <section className="relative rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 min-h-[420px] shadow-sm transition-colors">

            {/* Blurred fake content behind the overlay */}
            <div className="absolute inset-0 p-10 select-none pointer-events-none blur-[6px] opacity-30">
              <div className="h-7 bg-gray-200 rounded w-2/5 mb-8"></div>
              <div className="space-y-4 mb-10">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="h-36 bg-gray-200 rounded-xl"></div>
                <div className="h-36 bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            {/* CTA overlay */}
            <div className="relative z-10 flex items-center justify-center min-h-[420px] p-6 lg:p-12">
               <div className="flex flex-col items-center text-center max-w-md w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-lg p-10 border border-gray-200 dark:border-gray-800">
                <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-gray-800 text-green-600 dark:text-green-500 flex items-center justify-center mb-6">
                  <i className="fa-solid fa-lock text-3xl"></i>
                </div>
                <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-3">Materials Locked</h3>
                <p className="text-gray-500 mb-8 leading-relaxed text-base">
                  Enroll in this batch to unlock all <span className="font-semibold">{activeTab.toLowerCase()}</span>, study materials, and live class recordings.
                </p>
                <button className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md shadow-green-600/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  Enroll to Unlock Materials
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
