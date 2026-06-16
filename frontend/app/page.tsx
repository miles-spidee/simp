"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const opportunities = [
    { title: "Free Internship", type: "FREE", value: "free", desc: "Build practical skills through guided learning and real-world projects.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { title: "Paid Internship", type: "PAID", value: "paid", desc: "Work on live projects while earning industry experience and compensation.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { title: "Stipend Based Internship", type: "WILL PAID", value: "stipend", desc: "Gain hands-on experience with monthly stipend support.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { title: "Corporate Sponsored Internship", type: "PAID", value: "corporate", desc: "Contribute to projects backed by industry partners.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { title: "Research Internship", type: "PAID", value: "research", desc: "Explore research, innovation, and emerging technologies.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
    { title: "Industrial Internship", type: "PAID", value: "industrial", desc: "Experience real Industrial workflows and practical assignments.", color: "text-blue-600 bg-blue-50 border border-blue-100" },
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
        <header className="h-16 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-13.5 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>

            {/* Desktop Navbar Menu (Simplified) */}
            <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#programs" onClick={handleExploreClick} className="hover:text-blue-600 transition-colors">Programs</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="inline-flex text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md">
              Login
            </Link>
          </div>
        </header>

        {/* Hero Section with Diagonal Clip Video Background (Fills display page below navbar) */}
        <div className="relative w-full h-[calc(100vh-4rem)] bg-white overflow-hidden flex items-center">
          
          {/* Background Video - Diagonally Clipped in half from right top to left bottom */}
          <div 
            className="absolute inset-0 w-full h-full z-0 hidden md:block transition-all duration-700"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)' }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://pinesphere.com/static/assets/videos/pines_banner2.mp4" type="video/mp4" />
              <source src="https://pinesphere.com/static/assets/videos/pines_banner1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>

          {/* Background Video for Mobile (Full-bleed, no diagonal cut) */}
          <div className="absolute inset-0 w-full h-full z-0 md:hidden">
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
            <div className="absolute inset-0 bg-slate-950/75" />
          </div>

          {/* Left/Upper text content (Constrained within the diagonal cut bounds) */}
          <div className="relative z-20 mx-auto max-w-7xl w-full h-full px-6 lg:px-16 flex items-center h-full pointer-events-none">
            <div className="text-left text-white max-w-[420px] lg:max-w-[450px] animate-slide-in mt-[-4rem] md:mt-0 pointer-events-auto">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mb-6 leading-tight drop-shadow-sm">
                Start Your <br className="hidden sm:inline" />
                <span className="text-blue-400">Internship Journey</span> <br />
                With Enterprise Leaders
              </h1>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200 mb-8 drop-shadow-md">
                Pinesphere ERP offers a diverse range of internship programs designed to bridge the gap between academic learning and industrial excellence. Join our global talent ecosystem today.
              </p>
            </div>
          </div>

          {/* Static Explore CTA (Aligned md:text-right and positioned in bottom-right corner to stay on white background) */}
          <div 
            className="absolute z-30 animate-slide-in text-left md:text-right max-w-xs md:max-w-[280px] w-[90%] md:w-auto left-6 md:left-auto right-6 md:right-12 lg:right-16 bottom-8 md:bottom-12"
            style={{ animationDelay: '150ms', animationFillMode: 'both' }}
          >
            <span className="text-[10px] font-bold tracking-widest text-blue-400 md:text-blue-600 uppercase block mb-2">
              Ready to Start?
            </span>
            <h2 className="text-2xl font-extrabold text-white md:text-slate-900 mb-3 tracking-tight">
              Explore Programs
            </h2>
            <p className="text-xs leading-relaxed text-slate-300 md:text-slate-500 mb-6">
              Start your career journey with hands-on corporate sponsorships and guidance.
            </p>
            <a 
              href="#programs" 
              onClick={handleExploreClick}
              className="inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 px-8 shadow-md shadow-blue-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore Programs <span>↓</span>
            </a>
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
                className={`flex flex-col h-full rounded-none border border-slate-200/60 bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-1000 ease-out ${
                  programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
                }`}
                style={{ 
                  transitionDelay: programsVisible ? `${idx * 150}ms` : '0ms',
                  transitionProperty: 'opacity, transform'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-blue-50/80 text-blue-600 transition-transform duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-none tracking-wide ${opp.color}`}>
                    {opp.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{opp.title}</h3>
                <p className="text-sm text-slate-500 flex-1 leading-relaxed">{opp.desc}</p>
                
                <div className="mt-8 space-y-3 border-t border-slate-100 pt-6 mb-8 text-slate-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Seats</span>
                    <span className="font-semibold text-slate-800">12 Left</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Eligibility</span>
                    <span className="font-semibold text-slate-800">B.E / B.Tech</span>
                  </div>
                </div>

                <Link href={`/apply?type=${opp.value}`} className="block w-full rounded-none bg-slate-50 border border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200">
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