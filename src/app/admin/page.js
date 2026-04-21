"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const supabase = createClient();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // Fetch teachers from profiles
    const { data: tData } = await supabase.from('profiles').select('*').in('role', ['teacher', 'faculty']);
    if (tData) {
      setTeachers(tData.map(t => ({...t, name: t.full_name || t.name})));
    }

    // Fetch courses
    const { data: cData, error } = await supabase
      .from('courses')
      .select('*');
      
    if (cData) {
      const coursesWithTeachers = cData.map(c => ({
        ...c,
        teachers: { name: tData?.find(t => t.id === c.teacher_id)?.full_name || tData?.find(t => t.id === c.teacher_id)?.name }
      }));
      setCourses(coursesWithTeachers);
    } else {
      // Fallback dummy data if no DB connected
      console.warn("Using fallback admin data", error);
      setCourses([
        { id: "1", title: "10th ICSE Programs", teacher_id: "t1", teachers: {name: "Sarah Johnson"}, total_lectures: 45, class_duration: "60 mins" }
      ]);
      setTeachers([{ id: "t1", name: "Sarah Johnson" }]);
    }
    setLoading(false);
  }

  const handleEditClick = (course) => {
    setEditingCourse({ ...course });
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setEditingCourse({ isNew: true, title: '', teacher_id: '', total_lectures: 0, class_duration: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (editingCourse.isNew) {
      // Live insert to DB for new course
      const { error } = await supabase
        .from('courses')
        .insert([{
          title: editingCourse.title,
          teacher_id: editingCourse.teacher_id || null, // Allow unassigned
          total_lectures: parseInt(editingCourse.total_lectures, 10) || 0,
          class_duration: editingCourse.class_duration
        }]);
        
      if (!error) {
         await fetchData();
      } else {
         console.error("Error creating course:", error);
         alert("Failed to create course. Please try again.");
      }
    } else {
      // Live update to DB for existing course
      const { error } = await supabase
        .from('courses')
        .update({
          title: editingCourse.title,
          teacher_id: editingCourse.teacher_id || null,
          total_lectures: parseInt(editingCourse.total_lectures, 10) || 0,
          class_duration: editingCourse.class_duration
        })
        .eq('id', editingCourse.id);
        
      if (!error) {
         // Refresh local dataset
         await fetchData();
      } else {
         console.error("Error updating course:", error);
         // Local fallback if saving to DB fails
         setCourses(prev => prev.map(c => c.id === editingCourse.id ? { 
             ...editingCourse, 
             teachers: { name: teachers.find(t => t.id === editingCourse.teacher_id)?.name } 
         } : c));
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">Admin Control Center</h1>
            <button 
              onClick={handleNewClick}
              className="min-h-[48px] min-w-[48px] bg-primary hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors text-base self-start md:self-auto"
            >
              + New Course
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Course Title</th>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4">Lectures</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading DB data...</td></tr>
                  ) : courses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-dark">{course.title}</td>
                      <td className="px-6 py-4 text-gray-600">{course.teachers?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-gray-600">{course.total_lectures} Units</td>
                      <td className="px-4 md:px-6 py-4 text-gray-600 truncate max-w-[120px] md:max-w-none">{course.class_duration}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEditClick(course)}
                          className="min-h-[48px] min-w-[48px] text-primary hover:text-emerald-700 font-bold px-4 py-2 rounded-lg bg-accent/30 hover:bg-accent transition-colors truncate"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-dark truncate pr-4">
                {editingCourse.isNew ? "Create New Course" : "Update Course Details"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="min-h-[48px] min-w-[48px] text-gray-400 hover:text-dark transition-colors flex items-center justify-center">
                <i className="fa-solid fa-xmark text-xl md:text-2xl"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto">
              <form onSubmit={handleSave} className="p-4 md:p-6 space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm md:text-base font-bold text-dark mb-1.5 md:mb-2">Course Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingCourse.title || ''}
                    onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                    className="w-full min-h-[48px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-base outline-none truncate"
                  />
                </div>
                
                <div>
                  <label className="block text-sm md:text-base font-bold text-dark mb-1.5 md:mb-2">Assign Teacher</label>
                  <select 
                    value={editingCourse.teacher_id || ''}
                    onChange={(e) => setEditingCourse({...editingCourse, teacher_id: e.target.value})}
                    className="w-full min-h-[48px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-base outline-none truncate"
                  >
                    <option value="">Select Instructor...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-sm md:text-base font-bold text-dark mb-1.5 md:mb-2">Total Lectures</label>
                    <input 
                      type="number" 
                      value={editingCourse.total_lectures || 0}
                      onChange={(e) => setEditingCourse({...editingCourse, total_lectures: e.target.value})}
                      className="w-full min-h-[48px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-base outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base font-bold text-dark mb-1.5 md:mb-2">Duration</label>
                    <input 
                      type="text" 
                      value={editingCourse.class_duration || ''}
                      onChange={(e) => setEditingCourse({...editingCourse, class_duration: e.target.value})}
                      className="w-full min-h-[48px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-base outline-none truncate"
                    />
                  </div>
                </div>

                <div className="pt-6 mt-4 md:mt-2 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                   <button 
                     type="button" 
                     onClick={() => setIsModalOpen(false)}
                     className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 font-semibold text-gray-500 hover:text-dark hover:bg-gray-100 rounded-lg transition-colors border border-transparent text-base"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 font-semibold bg-primary text-white hover:bg-emerald-600 rounded-lg shadow-sm transition-colors text-base"
                   >
                     Save Update
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
