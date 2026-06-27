"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Settings, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { NotificationService } from '@/src/services/notification.service';
import ViewNotificationModal from './notification/ViewNotificationModal';

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
}

export function TopNav({ setMobileOpen }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { modules } = usePermissions();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideNotif = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideNotif);
    return () => document.removeEventListener('mousedown', handleClickOutsideNotif);
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const allNotifs = await NotificationService.getNotifications();
        if (user && user.roleName !== 'Super Admin') {
          const filtered = allNotifs.filter(n => {
            const recipientLower = n.recipient.toLowerCase();
            const emailLower = user.email.toLowerCase();
            const roleLower = n.role.toLowerCase();
            const userRoleLower = user.roleName.toLowerCase();
            
            return (
              recipientLower === 'all' || 
              recipientLower === emailLower || 
              roleLower === userRoleLower || 
              roleLower === 'all'
            );
          });
          setNotifications(filtered);
        } else {
          setNotifications(allNotifs);
        }
      } catch (e) {
        console.error("Failed to load notifications in header", e);
      }
    }
    loadNotifications();
  }, [user]);

  // Generate search routes dynamically from user's modules
  const searchRoutes = modules
    .filter(m => m.id !== 'dashboard' && m.id !== 'super_admin')
    .map(m => ({
      name: m.name,
      path: m.route === '/feature' ? '/feature' : `/admin${m.route}`,
      description: m.desc || `Manage ${m.name.toLowerCase()}`,
    }));

  const filteredRoutes = searchRoutes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button" 
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative -m-2.5 p-2.5 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100/50 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              {notifications.filter(n => !n.readStatus).length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border border-white">
                  {notifications.filter(n => !n.readStatus).length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 z-50 w-80 rounded-2xl bg-white border border-slate-150 shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Notifications</span>
                  <span className="text-xxs font-semibold bg-blue-50 text-blue-750 border border-blue-150 px-2 py-0.5 rounded-full">
                    {notifications.filter(n => !n.readStatus).length} New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div 
                        key={n.id}
                        onClick={async () => {
                          setSelectedNotif(n);
                          setIsModalOpen(true);
                          setShowNotifDropdown(false);
                          if (!n.readStatus) {
                            try {
                              await NotificationService.markAsRead(n.id);
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, readStatus: true } : item));
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer transition-colors ${
                          !n.readStatus ? 'bg-blue-50/10' : ''
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full shrink-0 mt-1.5 ${
                          !n.readStatus ? 'bg-teal-500' : 'bg-transparent'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs truncate ${!n.readStatus ? 'font-bold text-slate-900' : 'text-slate-650'}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-450 truncate mt-0.5">{n.message}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{new Date(n.createdTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(false);
                      router.push('/feature/self-service');
                    }}
                    className="text-xxs font-bold text-teal-650 hover:text-teal-700 hover:underline"
                  >
                    View All in Self-Service
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
          
          <button type="button" className="-m-2.5 p-2.5 ml-2 text-slate-400 hover:text-slate-500">
            <span className="sr-only">Settings</span>
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ViewNotificationModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotif(null);
        }}
        data={selectedNotif}
      />
    </header>
  );
}
