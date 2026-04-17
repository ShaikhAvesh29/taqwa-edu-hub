"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Human-readable error messages
  function parseError(err) {
    const msg = (err?.message || err || '').toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed')) {
      return 'Something went wrong. Please try again later.';
    }
    if (msg.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('email rate limit') || msg.includes('too many requests') || msg.includes('rate limit')) {
      return 'Too many requests. Please wait a minute before trying again.';
    }
    if (msg.includes('email not confirmed')) {
      return 'This email is not confirmed. Please check your inbox for a previous verification link.';
    }
    if (msg.includes('user not found')) {
      return 'No account found for this email. Please check your spelling or sign up.';
    }
    return err?.message || 'Something went wrong. Please try again.';
  }

  const startCooldown = () => {
    let secs = 60;
    setCooldown(secs);
    const timer = setInterval(() => {
      secs -= 1;
      setCooldown(secs);
      if (secs <= 0) clearInterval(timer);
    }, 1000);
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      
      if (isForgotPassword) {
        // Handle Password Reset
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/profile`,
        });

        if (resetError) throw resetError;
        setSuccess(true);
        startCooldown();
      } else {
        // Handle Standard Login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;
        
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
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
          {isForgotPassword ? 'Reset your password' : 'Log in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium tracking-wide">
          {isForgotPassword 
            ? 'Enter your email to receive a password reset link.' 
            : 'Welcome back! Please enter your details.'}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl border border-gray-100">

          {success && isForgotPassword ? (
            <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100 flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <h3 className="text-emerald-800 font-bold text-lg mb-2 tracking-tight">
                Reset link sent!
              </h3>
              <p className="text-emerald-600 text-sm font-medium mb-1">
                We've sent a password reset link to
              </p>
              <p className="text-emerald-900 font-bold text-sm mb-6 break-all">{email}</p>
              <p className="text-emerald-600 text-xs font-medium mb-6">
                Check your spam/junk folder if you don't see it within 2 minutes.
              </p>

              {cooldown > 0 ? (
                <p className="text-xs text-gray-400 font-medium">
                  Resend available in {cooldown}s
                </p>
              ) : (
                <button
                  onClick={() => { setSuccess(false); setError(null); }}
                  className="text-sm font-bold text-emerald-700 hover:text-emerald-800 underline transition-colors"
                >
                  Try a different email
                </button>
              )}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleAuthAction}>
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
                    disabled={loading || (isForgotPassword && success)}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm font-medium text-gray-900 transition-all bg-gray-50/50 hover:bg-white"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm font-medium flex items-start gap-2.5 bg-red-50 p-4 rounded-xl border border-red-100">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              {!isForgotPassword && (
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="font-bold text-primary hover:text-emerald-700 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || (isForgotPassword && cooldown > 0)}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-notch fa-spin text-sm"></i> Processing...
                    </span>
                  ) : isForgotPassword && cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : isForgotPassword ? (
                    'Send Reset Link'
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center space-y-4">
            {isForgotPassword ? (
              <button 
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setSuccess(false);
                }} 
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex justify-center items-center gap-2 mx-auto"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Login
              </button>
            ) : (
              <p className="text-sm text-gray-600 font-medium">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-primary hover:text-emerald-700 transition-colors cursor-pointer">
                  Sign up
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
