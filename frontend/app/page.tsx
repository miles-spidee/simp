"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const opportunities = [
    { 
      title: "Free Internship", 
      type: "Free", 
      value: "free", 
      desc: "Build practical skills through guided learning and real-world projects.", 
      duration: "4 Weeks",
      mode: "Online",
      seats: "15 Left",
      eligibility: "B.E / B.Tech / MCA / BCA",
      startDate: "July 1, 2026",
      color: "text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full" 
    },
    { 
      title: "Paid Internship", 
      type: "Paid", 
      value: "paid", 
      desc: "Work on live enterprise projects while earning industry experience and compensation.", 
      duration: "12 Weeks",
      mode: "Hybrid",
      seats: "5 Left",
      eligibility: "B.E / B.Tech / MCA",
      startDate: "July 10, 2026",
      color: "text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full" 
    },
    { 
      title: "Stipend Internship", 
      type: "Stipend", 
      value: "stipend", 
      desc: "Gain hands-on experience with monthly stipend support.", 
      duration: "24 Weeks",
      mode: "Offline",
      seats: "8 Left",
      eligibility: "Graduates / Postgraduates",
      startDate: "July 15, 2026",
      color: "text-purple-700 bg-purple-50 border border-purple-100 rounded-full" 
    },
    { 
      title: "Corporate Sponsored Internship", 
      type: "Corporate", 
      value: "corporate", 
      desc: "Contribute to enterprise-grade initiatives backed by corporate partners.", 
      duration: "16 Weeks",
      mode: "Hybrid",
      seats: "12 Left",
      eligibility: "Final Year Students",
      startDate: "July 20, 2026",
      color: "text-amber-700 bg-amber-50 border border-amber-100 rounded-full" 
    },
    { 
      title: "Research Internship", 
      type: "Research", 
      value: "research", 
      desc: "Explore advanced research, methodologies, and emerging tech.", 
      duration: "24 Weeks",
      mode: "Online",
      seats: "4 Left",
      eligibility: "M.Tech / MS / Ph.D Candidates",
      startDate: "August 1, 2026",
      color: "text-rose-700 bg-rose-50 border border-rose-100 rounded-full" 
    },
    { 
      title: "Industrial Internship", 
      type: "Industrial", 
      value: "industrial", 
      desc: "Acquire essential industrial engineering and planning experience.", 
      duration: "8 Weeks",
      mode: "Offline",
      seats: "10 Left",
      eligibility: "B.E / B.Tech / MCA",
      startDate: "July 5, 2026",
      color: "text-blue-700 bg-blue-50 border border-blue-100 rounded-full" 
    },
  ];

  // Scroll reveal trigger state
  const [programsVisible, setProgramsVisible] = useState(false);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgramsVisible(true);
          // Stop observing once visible to maintain animation state
          if (programsRef.current) observer.unobserve(programsRef.current);
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
    );

    if (programsRef.current) {
      observer.observe(programsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('programs');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-slate-800">
      <div>
        {/* Navigation Header */}
        <header className="h-20 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40 animate-slide-in">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>
 
            {/* Desktop Navbar Menu (Programs) */}
            <nav className="hidden sm:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
              <a href="#programs" onClick={handleExploreClick} className="hover:text-blue-650 transition-colors">Programs</a>
            </nav>
          </div>
 
          <div className="flex items-center gap-6">
            {/* Search Action */}
            <button className="text-slate-900 hover:text-blue-650 transition-colors cursor-pointer" aria-label="Search">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
 
            {/* Original Login Button */}
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:text-blue-650 transition-colors">
              Login
            </Link>
          </div>
        </header>
 
        {/* Hero Section with Diagonal Clip Design and Background Video */}
        <div className="relative w-full h-[calc(100vh-5rem)] bg-[#050505] overflow-hidden flex flex-col justify-between">
          
          {/* Background Video playing behind the black section */}
          <div className="absolute inset-0 w-full h-full z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://pinesphere.com/static/assets/videos/pines_banner2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[#050505]/75" />
          </div>
 
          {/* Upper-Left White Background Slant Overlay (Hides video on top left) */}
          <div 
            className="absolute inset-0 bg-white z-1"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 32%, 0 68%)' }}
          />
 
          {/* Vertical lines overlay on the black section (decorations) */}
          <div className="absolute inset-0 z-5 pointer-events-none">
            <div className="absolute top-[32%] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" style={{ left: '20%' }} />
            <div className="absolute top-[45%] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" style={{ left: '41%' }} />
            <div className="absolute top-[28%] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" style={{ left: '58%' }} />
            <div className="absolute top-[38%] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" style={{ left: '77%' }} />
            <div className="absolute top-[30%] bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent" style={{ left: '88%' }} />
          </div>
 
          {/* Content Wrapper */}
          <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 lg:px-16 py-12 md:py-16 flex flex-col justify-between">
            
            {/* Top Text Content (Original text, lies on the white background overlay) */}
            <div className="text-left mt-8 md:mt-12 max-w-3xl z-10">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-[#0a0a0a] leading-[1.15] mb-6 animate-slide-in">
                Start Your <br />
                Internship Journey <br />
                With Enterprise Leaders
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-slate-650 max-w-xl animate-slide-in" style={{ animationDelay: '70ms' }}>
                Pinesphere ERP offers a diverse range of internship programs designed to bridge the gap between academic learning and industrial excellence. Join our global talent ecosystem today.
              </p>
            </div>
 
            {/* Bottom Slider & Commitment Section (Lies on the black background overlay) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pb-4 z-10">
              
              {/* Left Side: 4 Horizontal Slider Indicators */}
              <div className="flex gap-4 w-60 md:w-80">
                <div className="h-[2px] bg-white flex-1 transition-all" />
                <div className="h-[2px] bg-white/20 flex-1 transition-all" />
                <div className="h-[2px] bg-white/20 flex-1 transition-all" />
                <div className="h-[2px] bg-white/20 flex-1 transition-all" />
              </div>
 
              {/* Right Side: The Pinesphere Commitment & Explore Action */}
              <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-5">
                <h2 className="text-xl md:text-2xl font-light tracking-wide text-white leading-snug">
                  The Pinesphere <br className="hidden sm:inline" />
                  Commitment
                </h2>
                <a 
                  href="#programs" 
                  onClick={handleExploreClick}
                  className="inline-flex bg-white hover:bg-slate-100 text-black text-xs font-bold uppercase tracking-[0.25em] py-3.5 px-8 transition-all active:scale-[0.98] rounded-none animate-slide-in"
                  style={{ animationDelay: '150ms' }}
                >
                  Dive Deeper
                </a>
              </div>
 
            </div>
 
          </div>
 
        </div>

        {/* Programs Section */}
        <div ref={programsRef} id="programs" className="mx-auto max-w-7xl px-6 py-24 lg:px-16 scroll-mt-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-3">Entrance Portal</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Available Opportunities</h2>
            <p className="mt-2 text-sm text-slate-500">Select a program that matches your career trajectory</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 ${
                  programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
                }`}
                style={{ 
                  transitionDelay: programsVisible ? `${idx * 100}ms` : '0ms',
                  transitionProperty: 'opacity, transform'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 border tracking-wide uppercase ${opp.color}`}>
                    {opp.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{opp.title}</h3>
                <p className="text-sm text-slate-500 flex-1 leading-relaxed mb-6">{opp.desc}</p>
                
                <div className="space-y-3 border-t border-slate-100 pt-5 mb-6 text-slate-650 text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-400 font-medium">Duration:</span>
                    <span className="font-semibold text-slate-800 ml-auto">{opp.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-slate-400 font-medium">Mode:</span>
                    <span className="font-semibold text-slate-800 ml-auto">{opp.mode}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-slate-400 font-medium">Seats:</span>
                    <span className="font-semibold text-slate-800 ml-auto">{opp.seats}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="text-slate-400 font-medium">Eligibility:</span>
                    <span className="font-semibold text-slate-800 ml-auto">{opp.eligibility}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-400 font-medium">Start Date:</span>
                    <span className="font-semibold text-slate-800 ml-auto">{opp.startDate}</span>
                  </div>
                </div>

                <Link 
                  href={`/apply?type=${opp.value}`} 
                  className="block w-full rounded-xl bg-slate-55 border border-slate-200 py-3.5 text-center text-sm font-semibold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 active:scale-[0.98]"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-12 px-6 lg:px-16 text-slate-500">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 text-sm">
          <div className="md:col-span-6 flex flex-col gap-4">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain self-start" />
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              We offer technology consulting and digital solutions to global enterprises, enabling transformative scale at speed.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#programs" onClick={handleExploreClick} className="hover:text-blue-600 transition-colors">Available Programs</a></li>
              <li><Link href="/login" className="hover:text-blue-600 transition-colors">Entrance Portal</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-slate-400">
          <div>© 2026 PINESPHERE ENTERPRISE. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-blue-600 transition-colors">PRIVACY POLICY</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">TERMS</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">SUPPORT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}