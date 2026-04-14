"use client";
export default function SubjectCard({ title, duration, schedule, teacherName, isVerified }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 md:p-6 shadow-sm transition-colors">
      <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
             <i className="fa-solid fa-clock"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Class Duration</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">{duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
             <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Upcoming Classes</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">{schedule}</p>
          </div>
        </div>
      </div>
      {teacherName && (
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div>
             <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
               {teacherName}
               {isVerified && <i className="fa-solid fa-circle-check text-primary text-[10px]" title="Verified"></i>}
             </p>
             <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
          </div>
        </div>
      )}
    </div>
  );
}
