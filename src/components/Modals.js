"use client";
import { useState, useEffect } from "react";

export default function Modals() {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.openEnrollModal = () => setEnrollModalOpen(true);
    }
  }, []);

  const closeModal = () => setEnrollModalOpen(false);

  return (
    <>
      {/* Enroll Modal */}
      {enrollModalOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if(e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button className="absolute top-5 right-5 text-gray-400 hover:text-dark text-xl transition-colors" onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="text-2xl font-bold text-primary mb-2">Enroll Now</h2>
            <p className="text-gray-500 mb-6 text-sm">Please fill out your details to secure your batch.</p>
            <form 
              className="space-y-4" 
              onSubmit={(e) => { e.preventDefault(); alert('Enrollment submitted successfully!'); closeModal(); }}
            >
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Student Name</label>
                <input type="text" required placeholder="Enter student name" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Phone Number</label>
                <input type="tel" required placeholder="Enter valid phone number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Class / Additional Details</label>
                <textarea rows="3" placeholder="Enter standard and other requests" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"></textarea>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors mt-2">Submit Application</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

