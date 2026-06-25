"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Settings, X, ChevronRight, ChevronDown, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { MOCK_USERS } from '@/src/data/mock-users';

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
}

export function TopNav({ setMobileOpen }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const userSwitcherRef = useRef<HTMLDivElement>(null);
  const { user, switchUser, logout } = useAuth();
  const { modules } = usePermissions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (userSwitcherRef.current && !userSwitcherRef.current.contains(event.target as Node)) {
        setShowUserSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate search routes dynamically from user's modules
  const searchRoutes = modules
    .filter(m => m.id !== 'dashboard' && m.id !== 'super_admin')
    .map(m => ({
      name: m.name,
      path: m.route === '/admin' ? '/admin' : `/admin${m.route}`,
      description: m.desc || `Manage ${m.name.toLowerCase()}`,
    }));

  const filteredRoutes = searchRoutes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Available seed users for switching
  const switchableUsers = MOCK_USERS.filter(u => u.status === 'Active');

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center" ref={searchRef}>
          <label htmlFor="search-field" className="sr-only">Search modules</label>
          <Search
            className="pointer-events-none absolute left-0 h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search modules..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Dropdown */}
          {showDropdown && searchQuery.length > 0 && (
            <div className="absolute top-14 left-0 w-full max-w-lg bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quick Navigation
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <li key={route.path}>
                      <button
                        onClick={() => {
                          router.push(route.path);
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors last:border-0"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-900">{route.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{route.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-8 text-center text-sm text-slate-500">
                    No modules matching &quot;{searchQuery}&quot;
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
          
          {/* Dev User Switcher */}
          <div className="relative" ref={userSwitcherRef}>
            <button
              type="button"
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <UserCircle className="h-5 w-5 text-slate-400" />
              <span className="hidden sm:inline max-w-[120px] truncate">{user?.name || 'User'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {showUserSwitcher && (
              <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch User (Dev)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Test different roles</p>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {switchableUsers.map((u) => (
                    <li key={u.id}>
                      <button
                        onClick={() => {
                          switchUser(u.id);
                          setShowUserSwitcher(false);
                          router.push('/admin');
                        }}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors last:border-0 ${
                          user?.user_id === u.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                          {u.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 truncate">{u.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{u.roleName} · {u.email}</div>
                        </div>
                        {user?.user_id === u.id && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
