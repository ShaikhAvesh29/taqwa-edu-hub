"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function FacultyAttendanceDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Available batches (dummy or hardcoded for now)
  const availableBatches = ["Batch A", "Batch B", "Batch C"];

  useEffect(() => {
    async function resolveAuth() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        setAuthLoading(false);
        return;
      }
      setUser(u);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();

      setRole(profile?.role ?? null);
      setAuthLoading(false);
    }
    resolveAuth();
  }, [supabase]);

  // Fetch students when batch changes
  const fetchStudents = useCallback(async () => {
    if (!batch) {
      setStudents([]);
      setAttendanceState({});
      return;
    }
    
    setLoadingStudents(true);
    setMessage(null);
    try {
      // Fetch students for the selected batch
      const { data: profiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, name, full_name, batch, role")
        .eq("role", "student")
        .eq("batch", batch);
        
      if (profileErr) throw profileErr;
      
      const studentList = profiles || [];
      setStudents(studentList);

      // Pre-fill attendance if already marked for this date
      const { data: existingAttendance, error: attErr } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("date", date)
        .in("student_id", studentList.map(s => s.id));
        
      if (attErr) throw attErr;

      const newState = {};
      studentList.forEach(s => {
        const found = existingAttendance?.find(a => a.student_id === s.id);
        newState[s.id] = found ? found.status : "Present"; // default to Present
      });
      setAttendanceState(newState);

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load students. " + err.message });
    } finally {
      setLoadingStudents(false);
    }
  }, [batch, date, supabase]);

  useEffect(() => {
    if (user && (role === "teacher" || role === "faculty" || role === "admin")) {
      fetchStudents();
    }
  }, [fetchStudents, user, role]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const recordsToUpsert = students.map(s => ({
        student_id: s.id,
        date: date,
        status: attendanceState[s.id],
        batch: batch,
        // Since we are upserting, we need to make sure we don't duplicate. 
        // We assume attendance table has a unique exact constraint on (student_id, date)
      }));

      const { error } = await supabase
        .from("attendance")
        .upsert(recordsToUpsert, { onConflict: "student_id, date" });

      if (error) throw error;
      
      setMessage({ type: "success", text: "✅ Attendance saved successfully for " + batch });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save attendance: " + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-gray-500 font-medium animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  if (!user || (role !== "teacher" && role !== "faculty" && role !== "admin")) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white border border-red-200 rounded-2xl p-10 text-center max-w-sm w-full shadow-sm">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-500 text-sm">
              This portal is restricted to faculty members only.
            </p>
            <Link href="/" className="mt-6 inline-block text-primary font-bold hover:underline">
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate stats
  const total = students.length;
  const presentCount = students.filter(s => attendanceState[s.id] === 'Present' || attendanceState[s.id] === 'Late').length;
  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-gray-900 transition-colors">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Mark Attendance
            </h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">
              Manage daily presence and absence for your students.
            </p>
          </div>
          <Link href="/faculty" className="text-sm font-bold text-primary hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors border border-emerald-100">
             <i className="fa-solid fa-arrow-left mr-2"></i> Back to Hub
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100 mb-6">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
               <input 
                 type="date"
                 value={date}
                 onChange={e => setDate(e.target.value)}
                 className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-gray-900 font-medium bg-gray-50/50 hover:bg-white transition-colors"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Select Batch</label>
               <select
                 value={batch}
                 onChange={e => setBatch(e.target.value)}
                 className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary text-gray-900 font-medium bg-gray-50/50 hover:bg-white transition-colors"
               >
                 <option value="">-- Choose Batch --</option>
                 {availableBatches.map(b => (
                   <option key={b} value={b}>{b}</option>
                 ))}
               </select>
             </div>
          </div>

          {batch && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
               <div>
                 <h2 className="text-lg font-bold text-gray-900">Batch Overview</h2>
                 <p className="text-sm text-gray-500">{batch} • {date}</p>
               </div>
               <div className="mt-4 sm:mt-0 flex gap-6 text-center">
                  <div>
                    <span className="block text-3xl font-extrabold text-gray-900">{total}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total</span>
                  </div>
                  <div>
                    <span className="block text-3xl font-extrabold text-emerald-600">{percentage}%</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Pres. / Late</span>
                  </div>
               </div>
            </div>
          )}

          {message && (
             <div className={`rounded-xl px-5 py-4 mb-6 text-sm font-semibold border flex items-center gap-3 ${
               message.type === "success"
                 ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                 : "bg-red-50 border-red-200 text-red-600"
             }`}>
               {message.text}
             </div>
          )}

          {loadingStudents ? (
            <div className="text-center py-12">
               <i className="fa-solid fa-circle-notch fa-spin text-3xl text-primary mb-4 block"></i>
               <p className="text-gray-500 font-medium">Fetching students...</p>
            </div>
          ) : students.length > 0 ? (
            <div>
               <div className="overflow-x-auto rounded-2xl border border-gray-100 mb-6">
                 <table className="min-w-full divide-y divide-gray-100 text-sm">
                   <thead className="bg-gray-50">
                     <tr>
                       <th scope="col" className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-widest text-xs">Student ID</th>
                       <th scope="col" className="px-6 py-4 text-left font-bold text-gray-500 uppercase tracking-widest text-xs">Name</th>
                       <th scope="col" className="px-6 py-4 text-right font-bold text-gray-500 uppercase tracking-widest text-xs">Status</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-100">
                     {students.map((student) => (
                       <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{student.id.substring(0, 8)}...</td>
                         <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{student.name || student.full_name || "Unknown"}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-right">
                           <div className="inline-flex rounded-lg shadow-sm">
                             {['Present', 'Late', 'Absent'].map(status => {
                               const isActive = attendanceState[student.id] === status;
                               let colorClasses = "bg-white text-gray-700 hover:bg-gray-50 border-gray-200";
                               if (isActive) {
                                 if (status === 'Present') colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold z-10";
                                 if (status === 'Late') colorClasses = "bg-amber-100 text-amber-800 border-amber-200 font-bold z-10";
                                 if (status === 'Absent') colorClasses = "bg-red-100 text-red-800 border-red-200 font-bold z-10";
                               }
                               
                               return (
                                 <button
                                   key={status}
                                   type="button"
                                   onClick={() => handleStatusChange(student.id, status)}
                                   className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-primary ${colorClasses}`}
                                 >
                                   {status}
                                 </button>
                               );
                             })}
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="flex justify-end">
                 <button
                   onClick={handleSaveAttendance}
                   disabled={isSubmitting}
                   className="flex items-center justify-center py-3.5 px-8 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? (
                     <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Saving...</>
                   ) : "Save Attendance"}
                 </button>
               </div>
            </div>
          ) : batch ? (
            <div className="text-center py-12 text-gray-500 font-medium">
               No students found for this batch.
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
