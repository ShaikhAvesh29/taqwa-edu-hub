"use client";
import Link from 'next/link';

export default function CourseCard({ id, title, desc, img, status }) {
  const courseId = id || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "1");
  const isComingSoon = status === 'coming_soon';

  return (
    <div className="w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] overflow-hidden flex flex-col group h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] m-3 shadow-inner">
        <img src={img || "/course_thumbnail.png"} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
      </div>
      <div className="p-6 pt-3 flex flex-col flex-1">
        <h3 className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100 mb-2 leading-tight">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1 font-medium leading-relaxed">{desc}</p>
        <div className="flex gap-3 mt-auto">
           {isComingSoon ? (
             <div className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center rounded-xl text-sm font-bold shadow-md opacity-50 cursor-not-allowed select-none">
               Coming Soon
             </div>
           ) : (
             <Link href={`/courses/${courseId}`} className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
               View Batch
             </Link>
           )}
           <button onClick={() => window.openEnrollModal?.()} className="flex-1 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 text-center rounded-xl text-sm font-bold hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm">
             Enroll Now
           </button>
        </div>
      </div>
    </div>
  );
}
