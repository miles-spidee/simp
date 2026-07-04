"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { opportunitiesService } from '@/src/services/opportunities.service';
import { Opportunity } from '@/src/types/opportunities.types';
import { Footer } from '@/components/layout/Footer';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";

const heroData = {
  badge: "GLOBAL INTERNSHIP PROGRAMS",
  headline: "The Pinesphere Commitment to Start With Enterprise Leaders",
  subtitle:
    "Pinesphere ERP offers a diverse range of internship programs designed to bridge the gap between academic learning and industrial excellence. Join our global talent ecosystem today.",
  buttons: {
    primary: "EXPLORE MORE",
    
  },
};

// --- COMMON COMPONENTS ---
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`max-w-[1440px] mx-auto px-6 md:px-12 ${className || ""}`} {...props}>
      {children}
    </div>
  )
);
Container.displayName = "Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {}
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...props }, ref) => (
    <section ref={ref} className={`py-12 md:py-24 lg:py-32 ${className || ""}`} {...props}>
      {children}
    </section>
  )
);
Section.displayName = "Section";


// --- HERO COMPONENTS ---
const HeroBadge = () => (
  <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-[family-name:var(--font-outfit)] font-bold text-text-secondary tracking-widest uppercase mb-6">
    <span className="w-4 h-4 rounded-full border-[3px] border-border flex items-center justify-center">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
    </span>
    {heroData.badge}
  </div>
);

const HeroContent = () => (
  <div className="max-w-[800px]">
    <h1 className="text-4xl sm:text-5xl md:text-[4rem] font-[family-name:var(--font-outfit)] font-extrabold tracking-tight text-text-primary leading-[1.1] mb-6">
      {heroData.headline}
    </h1>
    <p className="text-base md:text-lg text-text-primary leading-relaxed max-w-xl">
      {heroData.subtitle}
    </p>
  </div>
);

const HeroButtons = () => {
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('programs');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mt-10 mb-12">
      <button 
        onClick={handleExploreClick}
        className="rounded-xl px-8 py-4 text-xs font-[family-name:var(--font-outfit)] font-bold tracking-widest uppercase bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-3 transition-colors shadow-lg shadow-orange-500/20 cursor-pointer"
      >
        EXPLORE MORE
        <ArrowRight className="w-4 h-4" />
      </button>
      {/* <a 
        href="#programs"
        onClick={handleExploreClick}
        className="rounded-xl px-8 py-4 text-xs font-bold tracking-widest uppercase bg-white border border-border text-text-primary hover:bg-slate-50 flex items-center gap-3 transition-colors shadow-sm"
      >
        DIVE DEEPER
        <ArrowRight className="w-4 h-4" />
      </a> */}
    </div>
  );
};

// const TrustedBy = () => (
  // <div className="mt-12 sm:mt-16">
    // <p className="text-[10px] font-bold tracking-widest text-text-secondary uppercase mb-6">
      // TRUSTED BY LEADING COMPANIES
    // </p>
    // <div className="flex flex-wrap items-center gap-6 sm:gap-10 opacity-60 grayscale">
      {/* <span className="text-xl font-bold font-sans tracking-tighter text-text-primary">Google</span>
      <span className="text-lg font-semibold flex items-center gap-1.5 text-text-primary">
        <span className="grid grid-cols-2 gap-[2px]">
          <span className="w-2 h-2 bg-slate-700"></span><span className="w-2 h-2 bg-slate-700"></span>
          <span className="w-2 h-2 bg-slate-700"></span><span className="w-2 h-2 bg-slate-700"></span>
        </span>
        Microsoft
      </span>
      <span className="text-xl font-bold font-serif tracking-tighter text-text-primary">amazon</span>
      <span className="text-xl font-bold font-sans text-text-primary">Deloitte.</span>
      <span className="text-xl font-medium font-sans tracking-tight text-text-primary">Infosys</span> */}
    {/* </div> */}
  {/* </div> */}
// );

const Hero = () => (
  <Section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center bg-white pt-8 md:pt-12 lg:pt-16 pb-20">
    {/* Full Height Background Image on Right with Fade */}
    <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[60%] pointer-events-none z-0 opacity-40 lg:opacity-100">
      <Image 
        src="/images/hero/hero-team.png" 
        alt="Pinesphere enterprise professionals" 
        fill 
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover object-right-top" 
        priority 
      />
      {/* Gradient fade to white on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 lg:via-white/0 to-transparent w-full" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent w-full" />
    </div>

    <Container className="relative z-10 w-full px-4 sm:px-6 md:px-12">
      <div className="w-full lg:w-[65%] xl:w-[60%] flex flex-col justify-center">
        <HeroBadge />
        <HeroContent />
        <HeroButtons />
        {/* <TrustedBy /> */}
      </div>
    </Container>
  </Section>
);

export default function LandingPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch opportunities from the mock service layer
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await opportunitiesService.getOpportunities();
        setOpportunities(data as any);
      } catch (error) {
        console.error("Failed to fetch opportunities from service:", error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Scroll reveal trigger state
  const [programsVisible, setProgramsVisible] = useState(true);
  const programsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force play of background video to resolve React/browser autoplay constraints
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    
    const handlePlay = () => {
      video.play().catch((err) => {
        console.warn("Autoplay was prevented by browser:", err);
      });
    };

    if (video.readyState >= 3) {
      handlePlay();
    } else {
      video.addEventListener('canplay', handlePlay);
    }
    return () => {
      video.removeEventListener('canplay', handlePlay);
    };
  }, []);

  // Auto-scroll to #programs if hash is present in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#programs') {
      const timeoutId = setTimeout(() => {
        const target = document.getElementById('programs');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          setProgramsVisible(true);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    // Robust fallback timer to guarantee program card visibility after 1.5 seconds
    const timer = setTimeout(() => {
      setProgramsVisible(true);
    }, 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgramsVisible(true);
          clearTimeout(timer);
          if (programsRef.current) observer.unobserve(programsRef.current);
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
    );

    if (programsRef.current) {
      observer.observe(programsRef.current);
    }

    return () => {
      clearTimeout(timer);
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
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between text-text-primary">
      <div>
        {/* Navigation Header */}
        <header className="h-20 w-full bg-white flex items-center justify-between px-4 sm:px-6 lg:px-16 border-b border-border sticky top-0 z-40 animate-slide-in">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform hover:scale-[1.02]" />
            </Link>
 
            {/* Desktop Navbar Menu (Programs) */}
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-[family-name:var(--font-outfit)] font-bold uppercase tracking-[0.2em] text-text-primary">
              <a href="#programs" onClick={handleExploreClick} className="hover:text-orange-500 transition-colors cursor-pointer">Programs</a>
            </nav>
          </div>
 
          <div className="flex items-center gap-6">
            {/* Search Action */}
            {/* <button className="text-text-primary hover:text-blue-650 transition-colors cursor-pointer" aria-label="Search">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button> */}
 
            {/* Original Login Button */}
            <Link href="/login" className="text-[11px] font-[family-name:var(--font-outfit)] font-bold uppercase tracking-[0.2em] text-text-primary hover:text-orange-500 transition-colors">
              Login
            </Link>
          </div>
        </header>
 
        <Hero />

        {/* Programs Section */}
        <div ref={programsRef} id="programs" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:px-16 scroll-mt-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-[family-name:var(--font-outfit)] font-bold text-text-secondary uppercase tracking-widest block mb-3">Entrance Portal</span>
            <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-outfit)] font-extrabold text-text-primary">Available Opportunities</h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary">Select a program that matches your career trajectory</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-text-secondary">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p>Loading opportunities...</p>
              </div>
            ) : opportunities.map((opp, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col h-full rounded-2xl border border-border bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 ${
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
                <h3 className="text-xl font-bold text-text-primary mb-2">{opp.title}</h3>
                <p className="text-sm text-text-secondary flex-1 leading-relaxed mb-6">{opp.description}</p>
                
                <div className="space-y-3 border-t border-border pt-5 mb-6 text-text-secondary text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-text-secondary font-medium">Duration:</span>
                    <span className="font-semibold text-text-primary ml-auto">{opp.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-text-secondary font-medium">Internship Type:</span>
                    <span className="font-semibold text-text-primary ml-auto capitalize">
                      {opp.internshipType || 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-text-secondary font-medium">Mode:</span>
                    <span className="font-semibold text-text-primary ml-auto">{opp.mode}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-text-secondary font-medium">Seats:</span>
                    <span className="font-semibold text-text-primary ml-auto">{opp.seats}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="text-text-secondary font-medium">Eligibility:</span>
                    <span className="font-semibold text-text-primary ml-auto">{opp.eligibility}</span>
                  </div>



                  <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-text-secondary font-medium">Start Date:</span>
                    <span className="font-semibold text-text-primary ml-auto">{opp.startDate}</span>
                  </div>

                  {opp.internshipType && (
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-text-secondary font-medium">Compensation:</span>
                      <span className="font-semibold text-text-primary ml-auto">
                        {opp.internshipType === 'free' ? 'Free / Unpaid' : 
                         opp.internshipType === 'stipend' ? `Stipend (${opp.amount || 'Yes'})` :
                         opp.internshipType === 'paid' ? `Paid (${opp.amount || 'Yes'})` : 
                         opp.internshipType}
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOpp(opp);
                    setVerifyModalOpen(true);
                  }}
                  className="block w-full rounded-xl bg-orange-50 border border-orange-200 py-3.5 text-center text-sm font-[family-name:var(--font-outfit)] font-bold text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DigiLocker Verification Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-sky-50 rounded-full">
                <ShieldCheck className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-xl font-[family-name:var(--font-outfit)] font-bold text-center text-text-primary mb-2">
                Verify with DigiLocker
              </h3>
              <p className="text-sm text-center text-text-secondary mb-6">
                To proceed with your application for <span className="font-semibold text-text-primary">{selectedOpp?.title}</span>, please verify your identity securely.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsVerifying(true);
                    setTimeout(() => {
                      setIsVerifying(false);
                      setVerifyModalOpen(false);
                      if (selectedOpp) {
                        router.push(`/apply?type=${selectedOpp.internshipType || selectedOpp.value || 'stipend'}&id=${selectedOpp.id}`);
                      }
                    }, 2000);
                  }}
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Proceed to Verify"
                  )}
                </button>
                <button
                  onClick={() => {
                    if (!isVerifying) {
                      setVerifyModalOpen(false);
                      setSelectedOpp(null);
                    }
                  }}
                  disabled={isVerifying}
                  className="w-full py-3 px-4 bg-white border border-border hover:bg-sky-50 text-text-primary rounded-xl font-[family-name:var(--font-outfit)] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}