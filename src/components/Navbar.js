"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [session, setSession] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[64px]">
          <div className="flex items-center gap-3">
            {/* Desktop supercool menu button (Moved to Left) */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="hidden md:flex min-h-[48px] min-w-[48px] items-center justify-center text-gray-900 dark:text-gray-100 hover:text-primary transition-colors mr-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900"
              aria-label="Toggle supercool features"
            >
              <i className="fa-solid fa-bars-staggered text-xl"></i>
            </button>
            <div className="text-primary text-xl md:text-2xl">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <Link href="/" className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 tracking-tight min-h-[48px] min-w-[48px] flex items-center">
              Taqwa<span className="text-primary">Edu</span>Hub
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i className="fa-solid fa-search"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search courses or topics..." 
              className="w-full min-h-[48px] pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-primary dark:text-gray-100 transition-colors text-base truncate"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors min-h-[48px] flex items-center justify-center px-2">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors min-h-[48px] flex items-center justify-center px-2">
                  Edit Profile
                </Link>
                <div className="flex items-center justify-center min-h-[40px] px-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-emerald-600 transition-colors" title={session.user?.email}>
                    {session.user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors min-h-[48px] flex items-center justify-center px-2">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-primary text-white min-h-[40px] px-5 py-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center text-gray-900 dark:text-gray-100 hover:text-primary transition-colors"
            >
              <i className="fa-solid fa-bars-staggered text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Supercool Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex justify-start"> {/* Changed from justify-end to justify-start */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl h-full shadow-[20px_0_50px_rgba(0,0,0,0.1)] flex flex-col transform transition-transform duration-300 overflow-y-auto">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-primary"></i> Hub Features
              </h2>
              <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-8">
              {/* Feature Grid */}
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-4">Discover</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/coming-soon" onClick={() => setIsDrawerOpen(false)} className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl text-white shadow-md hover:-translate-y-1 transition-transform cursor-pointer block">
                    <i className="fa-solid fa-chart-line text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-sm">Leaderboard</h3>
                  </Link>
                  <Link href="/coming-soon" onClick={() => setIsDrawerOpen(false)} className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-xl text-white shadow-md hover:-translate-y-1 transition-transform cursor-pointer block">
                    <i className="fa-solid fa-chalkboard-user text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-sm">Live Classes</h3>
                  </Link>
                  <Link href="/coming-soon" onClick={() => setIsDrawerOpen(false)} className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl text-white shadow-md hover:-translate-y-1 transition-transform cursor-pointer block">
                    <i className="fa-solid fa-file-contract text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-sm">Mock Tests</h3>
                  </Link>
                  <Link href="/coming-soon" onClick={() => setIsDrawerOpen(false)} className="bg-gradient-to-br from-rose-500 to-orange-500 p-4 rounded-xl text-white shadow-md hover:-translate-y-1 transition-transform cursor-pointer block">
                    <i className="fa-solid fa-medal text-2xl mb-2 block"></i>
                    <h3 className="font-semibold text-sm">Certificates</h3>
                  </Link>
                </div>
              </div>

              {/* Navigation List */}
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2">Platform</p>
                
                <Link href="/faculty" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <i className="fa-solid fa-chalkboard-teacher"></i>
                  </div>
                  Attendance Portal
                </Link>
                <Link href="/my-batches" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  Enrolled Courses
                </Link>

                <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mb-2 mt-2">Account</p>

                <Link href="/profile" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profile Settings
                </Link>
                <Link href="/coming-soon" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium transition-colors w-full text-left">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  Help & Support
                </Link>
                
                {/* Dark Mode Toggle inside Drawer */}
                <button onClick={toggleTheme} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium transition-colors w-full text-left mt-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
                    <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                  </div>
                  {theme === 'dark' ? 'Light Theme' : 'Theme Settings'}
                </button>
              </div>
            </div>
            
            <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
               {session ? (
                 <button onClick={async () => { await supabase.auth.signOut(); setIsDrawerOpen(false); }} className="w-full py-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center shadow-sm">
                   Sign Out
                 </button>
               ) : (
                 <Link href="/login" onClick={() => setIsDrawerOpen(false)} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center shadow-md">
                   Sign In / Register
                 </Link>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
