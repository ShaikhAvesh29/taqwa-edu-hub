import Navbar from "@/components/Navbar";
import SubjectCard from "@/components/SubjectCard";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let attendanceRecords = [];
  let presentCount = 0;
  let totalDays = 0;
  let percentage = 0;

  if (user) {
    const { data: records, error } = await supabase
      .from('attendance')
      .select('date, status')
      .eq('student_id', user.id)
      .order('date', { ascending: false });

    if (!error && records) {
      attendanceRecords = records;
      totalDays = records.length;
      presentCount = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
    }
  }

  const recentHistory = attendanceRecords.slice(0, 5);

  const dummySubjects = [
    { title: "English Literature", duration: "45 Mins / session", schedule: "Tue, Thu (10:00 AM)", teacherName: "Sarah Johnson", isVerified: true },
    { title: "Chemistry Advanced", duration: "60 Mins / session", schedule: "Mon, Wed (01:00 PM)", teacherName: "Ahsan Sammar", isVerified: true },
    { title: "Calculus & Algebra", duration: "90 Mins / session", schedule: "Fri, Sat (09:00 AM)", teacherName: "Michael Chang", isVerified: false },
  ];

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      
      <main className="flex-grow pb-16">
        <div className="bg-white border-b border-light pt-8 pb-12 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-dark tracking-tight mb-2">Student Dashboard</h1>
            <p className="text-gray-500 mb-8 max-w-2xl text-lg">
              Welcome back! Here is your overall attendance summary and upcoming classes.
            </p>
            
            {/* Attendance Section */}
            <div className="bg-[#F9FAFB] rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start max-w-4xl">
               
               {/* Left: Progress Ring */}
               <div className="flex flex-col items-center justify-center shrink-0">
                 <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Attendance</h2>
                 <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-gray-200" />
                      <circle 
                        cx="72" cy="72" r="56" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-primary transition-all duration-1000 ease-in-out"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-extrabold text-gray-900">{percentage}%</span>
                    </div>
                 </div>
                 <p className="text-sm font-medium text-gray-500 mt-3">{presentCount} out of {totalDays} days</p>
               </div>

               {/* Right: Recent History */}
               <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-md font-bold text-gray-800">Recent 5 Days</h3>
                   <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Log</span>
                 </div>
                 
                 {recentHistory.length > 0 ? (
                   <ul className="divide-y divide-gray-50">
                     {recentHistory.map((rec, i) => (
                       <li key={i} className="py-3 flex justify-between items-center">
                         <span className="text-sm font-bold text-gray-700">{new Date(rec.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                         <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wide border ${
                           rec.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                           rec.status === 'Late'    ? 'bg-amber-50 text-amber-700 border-amber-100' :
                           'bg-red-50 text-red-600 border-red-100'
                         }`}>
                           {rec.status}
                         </span>
                       </li>
                     ))}
                   </ul>
                 ) : (
                   <div className="py-8 text-center text-sm font-medium text-gray-400">
                     No attendance records found yet.
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {dummySubjects.map((sub, i) => (
              <SubjectCard 
                key={i}
                title={sub.title}
                duration={sub.duration}
                schedule={sub.schedule}
                teacherName={sub.teacherName}
                isVerified={sub.isVerified}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
