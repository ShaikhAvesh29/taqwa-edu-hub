"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import InstructorCard from "@/components/InstructorCard";
import Modals from "@/components/Modals";

export default function Home() {
  const supabase = createClient();
  const scrollRef = useRef(null);
  const [gradientColor, setGradientColor] = useState(0);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroAds = [
    {
      title: "Master Your Board Exams",
      subtitle: "Comprehensive study material, interactive live classes, and expert guidance to help you secure a top rank.",
      button: "Start Learning Now"
    },
    {
      title: "What's New: AI Doubt Solver",
      subtitle: "Get instant answers to your hardest math and science problems 24/7 with our brand new AI assistant.",
      button: "Try it Free"
    },
    {
      title: "1-on-1 Mentorship Batches",
      subtitle: "Exclusive early access to our premium mentorship program. Extremely limited seats available.",
      button: "Claim Your Spot"
    }
  ];

  useEffect(() => {
    const swiper = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth > 400 ? 320 : clientWidth, behavior: 'smooth' });
        }
      }
    }, 3000);

    const colorInterval = setInterval(() => {
      setGradientColor(prev => (prev + 1) % 4);
      setHeroSlide(prev => (prev + 1) % 3);
    }, 4000);

    async function fetchCourses() {
      const { data, error } = await supabase.from('courses').select('*');
      if (error) {
        console.warn("Courses fetching error:", error);
      }
      
      if (!error && data && data.length > 0) {
        console.log("Successfully fetched DB courses:", data);
        setCourses(data);
      } else {
        console.log("DB returned empty or error, using dummy courses.");
        // Fallback to hardcoded courses when DB is empty or unreachable
        setCourses(dummyCourses);
      }
      setCoursesLoading(false);
    }
    fetchCourses();

    return () => {
      clearInterval(swiper);
      clearInterval(colorInterval);
    };
  }, []);

  const gradients = [
    "from-emerald-500 to-teal-600",
    "from-indigo-500 to-blue-600",
    "from-purple-500 to-pink-600",
    "from-rose-500 to-orange-500"
  ];
  const dummyCourses = [
    { id: "10th-icse", name: "10th ICSE Programs", description: "Master the fundamentals of the ICSE curriculum with daily assessments.", image_url: "/assets/course_10th_icse.png", status: "active" },
    { id: "9th-icse",  name: "9th ICSE Programs",  description: "An interactive deep dive to build a strong foundation for your boards.", image_url: "/assets/course_9th_icse.png",  status: "active" },
    { id: "7th-icse",  name: "7th ICSE Programs",  description: "Engaging and interactive courses tailored for junior high success.",   image_url: "/assets/course_7th_icse.png",  status: "active" },
    { id: "12th-boards", name: "12th Boards Preparation", description: "In-depth materials spanning core science and commerce tracks.", image_url: "/assets/course_12th_boards.png", status: "active" }
  ];

  const dummyFaculty = [
    { name: "Arsh", role: "Computer Engineer", subjects: ["Maths", "Physics"] },
    { name: "Obair", role: "Doctor", subjects: ["Biology"] },
    { name: "Avesh", role: "Computer Engineer", subjects: ["Maths", "Physics"] },
    { name: "Nabil", role: "AI/ML Engineer", subjects: ["Maths"] },
    { name: "Aryan", role: "B.Pharma", subjects: ["Chemistry"] },
    { name: "Umair", role: "Computer Engineer", subjects: ["Maths"] },
    { name: "Abdullah Sir", role: "Masters in Economics", subjects: ["SSC", "Geography"] },
    { name: "Uzair", role: "BSc Zoology", subjects: ["Languages"] },
    { name: "Mehvish", role: "BSc in Chemistry", subjects: ["English", "Chemistry"] }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-900/10 dark:via-gray-950 dark:to-gray-950">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
        {/* Promotional Ad Banner Carousel */}
        <section className="pt-8 pb-4">
          <div>
            <div className={`bg-gradient-to-r relative overflow-hidden ${gradients[gradientColor]} transition-colors duration-1000 border border-white/20 dark:border-gray-800 rounded-3xl p-10 md:p-16 text-center flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[360px] justify-center`}>
              {/* Glass decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
              
              <div className="transition-all duration-700 ease-in-out transform">
                <h2 className="text-white tracking-tight font-extrabold text-4xl md:text-6xl mb-6 drop-shadow-sm z-10 relative" key={`title-${heroSlide}`}>
                  {heroAds[heroSlide].title}
                </h2>
                <p className="text-white/90 mb-10 max-w-2xl mx-auto text-xl font-medium drop-shadow-sm z-10 relative min-h-[56px]" key={`sub-${heroSlide}`}>
                  {heroAds[heroSlide].subtitle}
                </p>
                <button className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 rounded-2xl py-4 px-10 text-lg font-bold transition-all active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10 relative">
                  {heroAds[heroSlide].button}
                </button>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-6 flex gap-2 z-10">
                {heroAds.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setHeroSlide(i); setGradientColor(i % gradients.length); }}
                    className={`h-2 rounded-full transition-all duration-300 ${heroSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Banner Section */}
        <section className="pb-16 pt-12">
          <div>
            {/* Promotional Ads Carousel / Grid */}
            <div ref={scrollRef} className="flex overflow-x-auto pb-8 gap-6 hide-scrollbar snap-x snap-mandatory mb-16 scroll-smooth px-1">
               {/* Ad 1 */}
               <div className="min-w-[85%] sm:min-w-[340px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-white p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] snap-center flex-shrink-0 flex flex-col justify-between overflow-hidden relative">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 blur-3xl rounded-full pointer-events-none"></div>
                 <div className="relative z-10">
                   <span className="inline-block bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-green-200 dark:border-green-800">Admissions Open</span>
                   <h3 className="text-2xl font-bold mb-3 tracking-tight leading-tight">Master your syllabus today.</h3>
                   <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed font-medium">Comprehensive video lectures and mock tests for board preparation.</p>
                 </div>
                 <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-max relative z-10">
                   Enroll Now
                 </button>
               </div>
               
               {/* Ad 2 */}
               <div className="min-w-[85%] sm:min-w-[340px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-white p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] snap-center flex-shrink-0 flex flex-col justify-between overflow-hidden relative">
                 <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
                 <div className="relative z-10">
                   <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800">Trending</span>
                   <h3 className="text-2xl font-bold mb-3 tracking-tight leading-tight">Crack 12th Boards with Ease</h3>
                   <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed font-medium">Intensive preparation material for Physics, Chemistry, and Mathematics.</p>
                 </div>
                 <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-max relative z-10">
                   Claim Offer
                 </button>
               </div>

               {/* Ad 3 */}
               <div className="min-w-[85%] sm:min-w-[340px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-white p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] snap-center flex-shrink-0 flex flex-col justify-between overflow-hidden relative">
                 <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
                 <div className="relative z-10">
                   <span className="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-purple-200 dark:border-purple-800">Early Bird</span>
                   <h3 className="text-2xl font-bold mb-3 tracking-tight leading-tight">9th & 7th ICSE Batch</h3>
                   <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed font-medium">Start your foundation strong. Up to 30% off on early enrollment.</p>
                 </div>
                 <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-max relative z-10">
                   Learn More
                 </button>
               </div>
               
               {/* Ad 4 */}
               <div className="min-w-[85%] sm:min-w-[340px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-white p-8 rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] snap-center flex-shrink-0 flex flex-col justify-between overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full pointer-events-none"></div>
                 <div className="relative z-10">
                   <span className="inline-block bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-sky-200 dark:border-sky-800">Limited Offer</span>
                   <h3 className="text-2xl font-bold mb-3 tracking-tight leading-tight">1-on-1 Mentorship</h3>
                   <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed font-medium">Get personal guidance from top educators to clear your doubts instantly.</p>
                 </div>
                 <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 w-max relative z-10">
                   Claim Now
                 </button>
               </div>
            </div>

            <div className="flex items-center justify-between mb-10 mt-12 px-2">
               <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
                 Recently Released Courses
               </h2>
               <Link href="/coming-soon" className="hidden sm:flex items-center justify-center bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-gray-800 text-gray-900 dark:text-gray-100 font-bold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-transform">
                 View All <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {coursesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] overflow-hidden flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-[1.5rem] m-3"></div>
                    <div className="p-6 pt-3 flex flex-col gap-3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.name || course.title}
                    desc={course.description}
                    img={course.image_url || course.img}
                    status={course.status}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Faculty Section */}
        <section className="pb-24 pt-16">
          <div>
            <div className="text-center mb-16">
               <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 inline-block bg-primary/10 px-3 py-1.5 rounded-full">World Class Network</span>
               <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-5">Meet Our Expert Faculty</h2>
               <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">Learn from completely verified educators and industry professionals dedicated to your success.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {dummyFaculty.map((faculty, i) => (
                <InstructorCard 
                   key={i} 
                   name={faculty.name} 
                   role={faculty.role} 
                   subjects={faculty.subjects} 
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <Modals />
    </div>
  );
}
