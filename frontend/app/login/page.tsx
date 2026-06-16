"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Toast from '../../components/ui/toast'; 

export default function LoginPage() {
  // 1. Set initial state to false so it doesn't show on load
  const [showToast, setShowToast] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 2. Handle the form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded check (replace with real authentication later)
    // For now, it will ALWAYS show the error unless they type exactly this
    if (username === "admin" && password === "password123") {
      // Simulate success (you would redirect here)
      alert("Login Successful!");
      setShowToast(false);
    } else {
      // Show the error toast if it fails
      setShowToast(true);
      
      // Optional: Auto-hide the toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#4279ea] via-[#6597f3] to-[#c7d9fb] p-12 lg:flex relative overflow-hidden">
        
        <div className="z-10 text-white">
          <div className="mb-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-bl-xl rounded-tr-xl bg-cyan-400">
               <span className="text-blue-900 font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-semibold tracking-widest text-blue-900">PINESPHERE</span>
          </div>
          <h1 className="mb-4 text-3xl font-semibold text-white">Transforming Internships Into Careers</h1>
          <p className="max-w-md text-sm text-blue-100">
            Manage students, internships, learning, performance, certifications, and placements from one unified platform.
          </p>
        </div>

        {/* --- Redesigned Floating Widgets --- */}
        <div className="relative flex-1 z-10 mt-12">
          
          {/* Top Left: Active Skills Badge */}
          <div className="absolute left-0 top-4 w-64 rounded-xl bg-white/10 p-5 backdrop-blur-md border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
             <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-white tracking-wider">TOP SKILLS ACQUIRED</span>
             </div>
             <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/30 text-blue-50 text-xs font-medium border border-blue-400/30">React.js</span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/30 text-cyan-50 text-xs font-medium border border-cyan-400/30">Node.js</span>
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/30 text-indigo-50 text-xs font-medium border border-indigo-400/30">AWS Cloud</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/30 text-emerald-50 text-xs font-medium border border-emerald-400/30">MongoDB</span>
             </div>
          </div>

          {/* Middle Right: Performance Graph */}
          <div className="absolute right-8 top-36 w-72 rounded-xl bg-white/95 p-5 shadow-2xl border border-blue-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-800">WEEKLY ACTIVITY</span>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+24%</span>
            </div>
            {/* Simple CSS Line Graph representation */}
            <div className="relative h-16 w-full flex items-end justify-between gap-1">
               <div className="w-full bg-blue-100 rounded-t-sm h-[30%] relative group cursor-pointer hover:bg-blue-300 transition-colors"></div>
               <div className="w-full bg-blue-200 rounded-t-sm h-[45%] relative group cursor-pointer hover:bg-blue-400 transition-colors"></div>
               <div className="w-full bg-blue-300 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-blue-500 transition-colors"></div>
               <div className="w-full bg-blue-400 rounded-t-sm h-[40%] relative group cursor-pointer hover:bg-blue-600 transition-colors"></div>
               <div className="w-full bg-[#2563eb] rounded-t-sm h-[85%] relative group cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
               <div className="w-full bg-blue-300 rounded-t-sm h-[65%] relative group cursor-pointer hover:bg-blue-500 transition-colors"></div>
               <div className="w-full bg-blue-200 rounded-t-sm h-[50%] relative group cursor-pointer hover:bg-blue-400 transition-colors"></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>

          {/* Bottom Left: Placement Success Ring */}
          <div className="absolute bottom-12 left-4 w-64 rounded-xl bg-white p-4 shadow-xl border border-gray-100 flex items-center gap-4">
             {/* Simple CSS Donut Chart */}
             <div className="relative h-14 w-14 rounded-full border-4 border-gray-100 flex items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray="92, 100"
                    className="animate-[pulse_2s_ease-in-out_infinite]"
                  />
                </svg>
                <span className="text-sm font-bold text-gray-800">92%</span>
             </div>
             <div>
               <p className="font-bold text-gray-900 text-sm">Placement Rate</p>
               <p className="text-xs text-gray-500">2026 Batch Graduates</p>
             </div>
          </div>
        </div>
        {/* --- End Redesigned Widgets --- */}

        <div className="z-10 mt-auto text-xs text-blue-200/80">
          © 2026 Pinesphere Enterprise. Built for Scale.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white">
        <div className="flex flex-1 flex-col justify-center px-8 sm:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to continue to your workspace</p>

            {/* Form is now connected to our handleLogin function */}
            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700">Username</label>
                <div className="mt-1">
                  <input 
                    type="text" 
                    placeholder="Eg: Harini Sarvesh" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border border-gray-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-500">Forgot Password?</Link>
                </div>
                <div className="relative mt-1">
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember Me</label>
              </div>

              <button type="submit" className="flex w-full justify-center rounded-md bg-[#0047FF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                Sign In <span className="ml-2">&rarr;</span>
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 px-8 py-6 text-[10px] font-semibold text-gray-500 lg:px-24">
          <div className="lg:hidden text-gray-400 font-normal">© 2026 Pinesphere Enterprise.</div>
          <div className="flex gap-6 w-full lg:w-auto justify-between lg:justify-end">
             <Link href="#" className="hover:text-gray-900 uppercase">Privacy Policy</Link>
             <Link href="#" className="hover:text-gray-900 uppercase">Terms</Link>
             <Link href="#" className="hover:text-gray-900 uppercase">Support</Link>
          </div>
        </div>
      </div>
      
      {/* Toast only shows when showToast state is true */}
      {showToast && <Toast onClose={() => setShowToast(false)} />}
    </div>
  );
}