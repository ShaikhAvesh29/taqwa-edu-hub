import Navbar from "@/components/Navbar";
import SubjectCard from "@/components/SubjectCard";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const dummySubjects = [
    { title: "English Literature", duration: "45 Mins / session", schedule: "Tue, Thu (10:00 AM)", teacherName: "Sarah Johnson", isVerified: true },
    { title: "Chemistry Advanced", duration: "60 Mins / session", schedule: "Mon, Wed (01:00 PM)", teacherName: "Ahsan Sammar", isVerified: true },
    { title: "Calculus & Algebra", duration: "90 Mins / session", schedule: "Fri, Sat (09:00 AM)", teacherName: "Michael Chang", isVerified: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      
      <main className="flex-grow pb-16">
        <div className="bg-white border-b border-light pt-8 pb-12 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-dark tracking-tight mb-2">Parent Quick View</h1>
            <p className="text-gray-500 mb-8 max-w-2xl text-lg">Search or select a student to see their peer summary, verified instructors, and upcoming academic progress modules.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-xl">
              <div className="relative flex-1 w-full">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                   <i className="fa-solid fa-search"></i>
                 </div>
                 <input 
                   type="text" 
                   placeholder="Enter student name or ID..." 
                   className="w-full min-h-[48px] pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base truncate"
                 />
              </div>
              <button className="min-h-[48px] min-w-[48px] w-full sm:w-auto bg-primary hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all whitespace-nowrap text-base">
                Search DB
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
