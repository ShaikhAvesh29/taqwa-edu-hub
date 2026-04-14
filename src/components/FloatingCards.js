export default function FloatingCards() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm transition-colors">
        <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-check-circle"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Subject Conditions</span>
          <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-0.5">Optimal</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm transition-colors">
        <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-stopwatch"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Duration</span>
          <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-0.5">Semester</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm transition-colors">
        <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-calendar-alt"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Upcoming Classes</span>
          <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-0.5">3 Today</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center gap-4 shadow-sm transition-colors">
        <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-user-circle"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Instructor Profile</span>
          <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100 mt-0.5">Verified</span>
        </div>
      </div>
    </div>
  );
}
