"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '../../components/ui/toast'; 

export default function LoginPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Accept either "admin" with "password123" OR "Harini Sarvesh" with any password
    const isValidUsername = username.trim().toLowerCase() === "admin" || username.trim() === "Harini Sarvesh";
    const isValidPassword = username.trim().toLowerCase() === "admin" ? password === "password123" : password.length >= 4;

    if (isValidUsername && isValidPassword) {
      setShowToast(false);
      router.push('/success?type=login');
    } else {
      setShowToast(true);
      // Auto-hide the toast after 4 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-[#f8fafc] animate-slide-in">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#4279ea] via-[#6597f3] to-[#c7d9fb] p-12 lg:flex relative overflow-hidden border-r border-gray-100">
        
        <div className="z-10">
          <div className="mb-10 flex items-center bg-white/95 px-4 py-2.5 rounded-xl w-fit shadow-sm backdrop-blur-md border border-white/20">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-blue-900 leading-tight">Transforming Internships Into Careers</h1>
          <p className="max-w-md text-sm text-blue-900/80 font-medium">
            Manage students, internships, learning, performance, certifications, and placements from one unified platform.
          </p>
        </div>

        {/* --- Redesigned Floating Widgets --- */}
        <div className="relative flex-1 z-10 mt-12">
          
          {/* Top Left: Active Skills Badge */}
          <div className="absolute left-0 top-4 w-64 rounded-xl bg-white/20 p-5 backdrop-blur-md border border-white/30 shadow-[0_8px_30px_rgba(59,130,246,0.06)]">
             <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-blue-900 tracking-wider">TOP SKILLS ACQUIRED</span>
             </div>
             <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-900 text-xs font-semibold border border-blue-500/20">React.js</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-900 text-xs font-semibold border border-blue-500/20">Node.js</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-900 text-xs font-semibold border border-blue-500/20">AWS Cloud</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-900 text-xs font-semibold border border-blue-500/20">MongoDB</span>
             </div>
          </div>

          {/* Middle Right: Performance Graph */}
          <div className="absolute right-8 top-36 w-72 rounded-xl bg-white/95 p-5 shadow-xl border border-gray-100/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-gray-800 tracking-wider">WEEKLY ACTIVITY</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">✓ 24% Increase</span>
            </div>
            {/* Simple CSS Line Graph representation */}
            <div className="relative h-16 w-full flex items-end justify-between gap-1.5 pt-2">
               <div className="w-full bg-blue-100 rounded-t-sm h-[30%] relative group cursor-pointer hover:bg-blue-300 transition-all duration-200"></div>
               <div className="w-full bg-blue-200 rounded-t-sm h-[45%] relative group cursor-pointer hover:bg-blue-400 transition-all duration-200"></div>
               <div className="w-full bg-blue-300 rounded-t-sm h-[60%] relative group cursor-pointer hover:bg-blue-550 transition-all duration-200"></div>
               <div className="w-full bg-blue-400 rounded-t-sm h-[40%] relative group cursor-pointer hover:bg-blue-600 transition-all duration-200"></div>
               <div className="w-full bg-blue-600 rounded-t-sm h-[85%] relative group cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.2)]"></div>
               <div className="w-full bg-blue-300 rounded-t-sm h-[65%] relative group cursor-pointer hover:bg-blue-500 transition-all duration-200"></div>
               <div className="w-full bg-blue-200 rounded-t-sm h-[50%] relative group cursor-pointer hover:bg-blue-450 transition-all duration-200"></div>
            </div>
            <div className="flex justify-between mt-2.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>

          {/* Bottom Left: Placement Success Ring */}
          <div className="absolute bottom-12 left-4 w-64 rounded-xl bg-white p-4 shadow-lg border border-gray-100/80 flex items-center gap-4">
             {/* Simple CSS Donut Chart */}
             <div className="relative h-14 w-14 rounded-full border-4 border-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray="92, 100"
                  />
                </svg>
                <span className="text-xs font-bold text-gray-800">92%</span>
             </div>
             <div>
                <p className="font-bold text-gray-900 text-xs">Placement Rate</p>
                <p className="text-[10px] text-gray-500 font-medium">2026 Batch Graduates</p>
             </div>
          </div>
        </div>
        {/* --- End Redesigned Widgets --- */}

        <div className="z-10 mt-auto text-[10px] font-bold text-blue-900/60 uppercase tracking-wider">
          © 2026 Pinesphere Enterprise. Built for Scale.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col lg:w-1/2 bg-white justify-between">
        <div className="flex flex-1 flex-col justify-center px-8 sm:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-sm">
            {/* Logo in Right Panel for mobile and brand reinforcement */}
            <div className="mb-8 block lg:hidden">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="mb-6 hidden lg:block">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to continue to your workspace</p>

            {/* Form */}
            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
                <div className="mt-1.5">
                  <input 
                    type="text" 
                    placeholder="Eg: Harini Sarvesh" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder-gray-400" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative mt-1.5">
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-gray-600 select-none">Remember Me</label>
              </div>

              <button type="submit" className="flex w-full justify-center rounded-lg bg-[#0047FF] hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow transition-all duration-250 hover:scale-[1.01]">
                Sign In <span className="ml-2">→</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-gray-150 px-8 py-6 text-[10px] font-bold text-gray-400 lg:px-24">
          <div className="lg:hidden">© 2026 Pinesphere.</div>
          <div className="flex gap-6 w-full lg:w-auto justify-between lg:justify-end">
             <Link href="#" className="hover:text-blue-600 transition-colors">PRIVACY POLICY</Link>
             <Link href="#" className="hover:text-blue-600 transition-colors">TERMS</Link>
             <Link href="#" className="hover:text-blue-600 transition-colors">SUPPORT</Link>
          </div>
        </div>
      </div>
      
      {/* Toast only shows when showToast state is true */}
      {showToast && <Toast onClose={() => setShowToast(false)} />}
    </div>
  );
}