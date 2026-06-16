"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// --- Bulletproof Scroll Reveal Component ---
function RevealCard({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Failsafe: Automatically show the cards after 1.5 seconds if the user 
    // is on a strange browser where IntersectionObserver fails.
    const fallbackTimer = setTimeout(() => setIsVisible(true), 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger the moment the card gets within 100px of the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { rootMargin: '100px', threshold: 0 } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      // We use native CSS for the stagger delay now, which is much more reliable
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
}

// ... the rest of your LandingPage code stays exactly the same ...

export default function LandingPage() {
  const opportunities = [
    { title: "Free Internship", type: "FREE", value: "free", desc: "Build practical skills through guided learning and real-world projects.", color: "text-blue-500 bg-blue-50" },
    { title: "Paid Internship", type: "PAID", value: "paid", desc: "Work on live projects while earning industry experience and compensation.", color: "text-blue-600 bg-blue-100" },
    { title: "Stipend Based Internship", type: "WILL PAID", value: "stipend", desc: "Gain hands-on experience with monthly stipend support.", color: "text-blue-600 bg-blue-100" },
    { title: "Corporate Sponsored Internship", type: "PAID", value: "corporate", desc: "Contribute to projects backed by industry partners.", color: "text-blue-600 bg-blue-100" },
    { title: "Research Internship", type: "PAID", value: "research", desc: "Explore research, innovation, and emerging technologies.", color: "text-blue-600 bg-blue-100" },
    { title: "Industrial Internship", type: "PAID", value: "industrial", desc: "Experience real Industrial workflows and practical assignments.", color: "text-blue-600 bg-blue-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Dark Hero Section */}
      <div className="bg-[#0b1120] px-8 py-16 lg:px-24 relative overflow-hidden">
        {/* Top Nav inside Hero */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-6 lg:px-24 z-20">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-bl-lg rounded-tr-lg bg-cyan-400">
                    <span className="text-blue-900 font-bold">P</span>
                </div>
                <span className="text-lg font-bold tracking-widest text-white">PINESPHERE</span>
            </div>
            <Link href="/login" className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-lg transition-colors backdrop-blur-md">
                Login
            </Link>
        </div>

        <div className="mx-auto max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-[fadeIn_1s_ease-out]">
            {/* Font size reduced to text-3xl / sm:text-4xl / lg:text-5xl */}
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6 leading-tight">
              Start Your <span className="text-[#3b82f6]">Internship Journey</span> With Enterprise Leaders
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-gray-400 mb-8 max-w-lg">
              Pinesphere ERP offers a diverse range of internship programs designed to bridge the gap between academic learning and industrial excellence. Join our global talent ecosystem today.
            </p>
            <a href="#programs" className="inline-flex items-center rounded-lg bg-[#2563eb] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 shadow-lg shadow-blue-900/50">
              Explore Programs &darr;
            </a>
          </div>
          
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl animate-[fadeInRight_1s_ease-out]">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
               alt="Professionals working around a table" 
               className="w-full h-full object-cover opacity-90"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1120]/80 via-transparent to-transparent"></div>
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Programs Section with Reveal Animations */}
      <div id="programs" className="mx-auto max-w-7xl px-8 py-20 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900">Available Opportunities</h2>
          <p className="mt-2 text-sm text-gray-500">Select a program that matches your career trajectory</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp, idx) => (
            // Passing the delay to create the waterfall effect
            <RevealCard key={idx} delay={idx * 100}>
              <div className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-md tracking-wide ${opp.color}`}>
                    {opp.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{opp.title}</h3>
                <p className="text-sm text-gray-500 flex-1 leading-relaxed">{opp.desc}</p>
                
                <div className="mt-8 space-y-3 border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Seats</span>
                    <span className="font-bold text-gray-900">12 Left</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Eligibility</span>
                    <span className="font-bold text-gray-900">B.E / B.Tech</span>
                  </div>
                </div>

                <Link href={`/apply?type=${opp.value}`} className="block w-full rounded-lg bg-gray-50 border border-gray-200 py-3 text-center text-sm font-bold text-gray-700 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all">
                  Apply Now
                </Link>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </div>
  );
}