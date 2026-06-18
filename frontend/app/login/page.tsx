"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '../../components/ui/toast'; 
import { API_ENDPOINTS } from '@/src/config'; 

export default function LoginPage() {
  const router = useRouter();
  const [toastConfig, setToastConfig] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    title: '',
    message: '',
    type: 'error'
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.ok) {
        setToastConfig({
          show: true,
          title: 'Login Successful',
          message: 'Redirecting to your workspace...',
          type: 'success'
        });
        
        // Save authenticated user info
        if (typeof window !== 'undefined') {
          localStorage.setItem('pinesphere_username', username.trim());
        }
        
        // Brief delay to let the toast show
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        setToastConfig({
          show: true,
          title: 'Authentication Failed',
          message: 'Invalid username or password. Please try again.',
          type: 'error'
        });
        
        setTimeout(() => {
          setToastConfig(prev => ({ ...prev, show: false }));
        }, 4000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setToastConfig({
        show: true,
        title: 'Connection Error',
        message: 'Unable to reach the authentication server. Please check your network.',
        type: 'error'
      });
      setTimeout(() => {
        setToastConfig(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-slate-800 animate-slide-in">
      
      {/* Navigation Header */}
      <header className="h-16 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Pinesphere Logo" className="h-13.5 w-auto object-contain transition-transform hover:scale-[1.02]" />
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5">
          <span>←</span> Return to Homepage
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-4rem)]">
        
        {/* Left Panel - Premium Gradient & Background Video & Ambient Glow */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-slate-950 text-white border-r border-slate-950/20">
          
          {/* Looping corporate background video from pinesphere.com */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
          >
            <source src="https://pinesphere.com/static/assets/videos/pines_banner3.mp4" type="video/mp4" />
            <source src="https://pinesphere.com/static/assets/videos/pines_banner2.mp4" type="video/mp4" />
            <source src="https://pinesphere.com/static/assets/videos/pines_banner1.mp4" type="video/mp4" />
            <source src="https://pinesphere.com/static/assets/videos/pines_banner4.mp4" type="video/mp4" />
          </video>
          
          {/* Dark gradient overlay with blue tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/60 to-slate-950/85 z-10" />

          {/* Tech Grid Blueprint Overlay */}
          <div className="absolute inset-0 tech-grid z-10 opacity-40 pointer-events-none" />

          {/* Centered Typography Content */}
          <div className="relative z-20 flex-1 flex flex-col justify-center max-w-md my-auto animate-slide-in">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 self-start rounded-none mb-6">
              Enterprise Portal
            </span>
            
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
              Transforming <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-400">
                Internships Into Careers
              </span>
            </h1>
            
            <p className="text-sm text-slate-355 leading-relaxed mb-10">
              Manage students, internships, learning, performance, certifications, and placements from one unified platform.
            </p>

            {/* Premium minimal horizontal metrics row */}
            <div className="border-t border-white/10 pt-8 flex items-center gap-10">
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">10K+</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Careers Launched</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">92%</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Placement Rate</div>
              </div>
            </div>
          </div>

          {/* Ambient Glowing Orbs / Particles */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            {/* Orb 1: Soft Cyan/Blue Glow */}
            <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] animate-float-1" />
            {/* Orb 2: Soft Violet/Indigo Glow */}
            <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-indigo-500/8 blur-[120px] animate-float-2" />
            {/* Orb 3: Soft Teal Glow */}
            <div className="absolute top-[50%] left-[40%] w-60 h-60 rounded-full bg-teal-500/5 blur-[90px] animate-float-3" />
            
            {/* Floating particles - small glowing dots/sparks */}
            <div className="absolute top-[30%] right-[30%] w-2 h-2 bg-blue-400/25 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute top-[70%] left-[20%] w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
            
            {/* Decorative Vector Path (Sleek tech line overlay) */}
            <svg className="absolute inset-0 w-full h-full opacity-5" fill="none" viewBox="0 0 400 600">
              <path d="M 0 100 Q 150 150 200 300 T 400 450" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="5, 5" />
              <path d="M 400 200 Q 250 350 200 400 T 0 550" stroke="url(#line-grad-2)" strokeWidth="1.2" />
              <defs>
                <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="line-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Panel - Login Form & Footer (Colored White to match main right division) */}
        <div className="flex w-full flex-col lg:w-1/2 bg-white justify-between">
          <div className="flex flex-1 flex-col justify-center px-8 sm:px-16 lg:px-24">
            <div className="mx-auto w-full max-w-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="mt-1.5 text-sm text-slate-500">Sign in to continue to your workspace</p>

              {/* Form */}
              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
                  <div className="mt-2">
                    <input 
                      type="text" 
                      placeholder="Eg: Harini" 
                      required 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-none border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 transition-all placeholder-slate-400" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</Link>
                  </div>
                  <div className="relative mt-2">
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-none border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-0 transition-all placeholder-slate-400" 
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded-none border-slate-300 text-blue-600 focus:ring-blue-600" />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-semibold text-slate-600 select-none">Remember Me</label>
                </div>

                <button type="submit" className="flex w-full justify-center rounded-none bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]">
                  Sign In <span className="ml-2">→</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastConfig.show && (
        <Toast 
          title={toastConfig.title}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))} 
        />
      )}
    </div>
  );
}