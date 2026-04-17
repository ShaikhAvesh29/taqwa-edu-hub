"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    async function loadUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login"); // Redirect if not authenticated
        return;
      }
      setUser(user);
      
      // Load user metadata if using user_metadata field natively
      setFullName(user.user_metadata?.full_name || "");
      setPhoneNumber(user.phone || user.user_metadata?.phone || "");
      
      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Basic validation for password change
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
      }

      const updateData = {
        data: {
          full_name: fullName,
          phone: phoneNumber
        }
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const { error: updateError } = await supabase.auth.updateUser(updateData);

      if (updateError) throw updateError;

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-light">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-primary font-bold">
            <i className="fa-solid fa-circle-notch fa-spin"></i> Loading Profile...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-[2rem] shadow-md">
          <h1 className="text-3xl font-bold text-dark mb-2">Edit Profile</h1>
          <p className="text-gray-500 mb-8">Update your personal details and account preferences.</p>
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 font-medium text-sm ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              <i className={`fa-solid mt-0.5 ${message.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}`}></i>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Parent / Student Name"
                  className="w-full px-4 py-3 bg-light rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 outline-none text-gray-400 cursor-not-allowed shadow-inner font-medium"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-light rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Account Status</label>
                <input 
                  type="text" 
                  value="Active User"
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 outline-none text-gray-400 cursor-not-allowed shadow-inner font-medium"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-8">
              <h2 className="text-lg font-semibold text-dark mb-4">Change Password</h2>
              <p className="text-sm text-gray-500 mb-6">Leave blank if you do not wish to change your password.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-light rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-light rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark font-medium"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-8">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
