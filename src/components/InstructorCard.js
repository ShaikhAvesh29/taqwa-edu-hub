"use client";
export default function InstructorCard({ name, role, subjects }) {
  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform hover:-translate-y-1 text-center flex flex-col items-center">
      <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-1">{name}</h3>
      <p className="text-xs text-primary font-extrabold uppercase tracking-widest mb-6">{role}</p>
      
      <div className="w-12 h-1 bg-gray-200/80 dark:bg-gray-800/80 rounded-full mb-6"></div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-auto">
        {subjects.map((sub, i) => (
          <span key={i} className="text-[11px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full font-bold shadow-sm">
            {sub}
          </span>
        ))}
      </div>
    </div>
  );
}
