"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Register() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const submitHistory = useRef([]);

  // Human-readable error messages
  function parseError(err) {
    const msg = (err?.message || err || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed')) {
      return 'Something went wrong. Please try again later.';
    }
    if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('password') && msg.includes('weak')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    if (msg.includes('user already exists') || msg.includes('already registered')) {
      return 'An account with this email already exists. Please log in.';
    }
    return err?.message || 'Something went wrong during registration. Please try again.';
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;

    // Rate Limiting: max 3 submits in 60 seconds
    const now = Date.now();
    const recentSubmits = submitHistory.current.filter(time => now - time < 60000);
    if (recentSubmits.length >= 3) {
      setError('Too many attempts. Please wait a minute before trying again.');
      const remainingTime = 60 - Math.floor((now - recentSubmits[0]) / 1000);
      setCooldown(remainingTime);
      startCooldownOverride(remainingTime);
      return;
    }
    submitHistory.current = [...recentSubmits, now];

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Enforce at least 2 seconds delay for generous but secure debouncing
      const minWait = new Promise(resolve => setTimeout(resolve, 2000));

      const supabase = createClient();
      
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      // Wait for both supabase action AND the 2 second minimum
      const [signUpResult] = await Promise.all([signUpPromise, minWait]);
      const { error: signUpError } = signUpResult;

      if (signUpError) throw signUpError;

      // Note: By default Supabase requires email verification.
      // If it's disabled, the user is logged in immediately.
      setSuccess(true);
      
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const startCooldownOverride = (secs) => {
    setCooldown(secs);
    const timer = setInterval(() => {
      secs -= 1;
      setCooldown(secs);
      if (secs <= 0) clearInterval(timer);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 text-gray-900 justify-center">
          <div className="text-primary text-2xl md:text-3xl">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="font-extrabold text-2xl md:text-3xl tracking-tight">Taqwa<span className="text-primary">Edu</span>Hub</span>
        </Link>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium tracking-wide">
          Join Taqwa Edu Hub and start learning today.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl border border-gray-100">

          {success ? (
            <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100 flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
              <h3 className="text-emerald-800 font-bold text-lg mb-2 tracking-tight">
                Check your email
              </h3>
              <p className="text-emerald-600 text-sm font-medium mb-1">
                We've sent a verification link to
              </p>
              <p className="text-emerald-900 font-bold text-sm mb-6 break-all">{email}</p>
              <p className="text-emerald-600 text-xs font-medium mb-6">
                Please click the link in that email to complete your registration.
              </p>

              <Link href="/login" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 underline transition-colors mt-4 block">
                Go to Login Page
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm font-medium text-gray-900 transition-all bg-gray-50/50 hover:bg-white"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm font-medium text-gray-900 transition-all bg-gray-50/50 hover:bg-white pr-12"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex="-1"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium flex items-start gap-2.5 bg-red-50 p-4 rounded-xl border border-red-100">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-notch fa-spin text-sm"></i> Creating account...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center space-y-4">
            {!success && (
              <p className="text-sm text-gray-600 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-primary hover:text-emerald-700 transition-colors cursor-pointer">
                  Log in
                </Link>
              </p>
            )}
            
            <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors flex justify-center items-center gap-2 mt-4">
              <i className="fa-solid fa-arrow-left"></i> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
