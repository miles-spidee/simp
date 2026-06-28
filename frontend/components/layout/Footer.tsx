"use client";

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const handleExploreClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      const target = document.getElementById('programs');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full border-t border-border/80 bg-white py-12 px-6 lg:px-16 text-text-secondary font-sans">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 text-sm">
        <div className="md:col-span-6 flex flex-col gap-4">
          <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain self-start" />
          <p className="text-xs leading-relaxed text-text-secondary max-w-sm">
            We offer technology consulting and digital solutions to global enterprises, enabling transformative scale at speed.
          </p>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#programs" onClick={handleExploreClick} className="hover:text-blue-600 transition-colors font-medium">
                Available Programs
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-600 transition-colors font-medium">
                Entrance Portal
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="font-semibold text-text-primary mb-3 uppercase tracking-wider text-xs">Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">Contact Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-text-secondary">
        <div>© 2026 PINESPHERE ENTERPRISE. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-blue-600 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">TERMS</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors">SUPPORT</Link>
        </div>
      </div>
    </footer>
  );
}
