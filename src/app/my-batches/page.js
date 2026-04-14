import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";

export default function MyBatches() {
  // Mock array to simulate enrolled courses (empty for the empty state UI)
  const enrolledCourses = [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl tracking-tight font-semibold mb-2 text-gray-900 dark:text-gray-100">
            My Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and access your active batches.</p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map((c, i) => (
              <CourseCard key={i} title={c.title} desc={c.desc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 mb-6">
              <i className="fa-solid fa-book-open text-2xl"></i>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
              Your Next Breakthrough Awaits.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
              You haven't enrolled in any active batches yet. Explore our curated, industry-leading programs and start mastering your syllabus today.
            </p>
            <Link href="/" className="bg-primary hover:bg-emerald-600 text-white rounded-md py-3 px-8 text-base font-semibold transition-colors inline-block">
              Explore Premium Courses
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
