"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Settings, X, ChevronRight, Mail, MessageSquare, Smartphone, Inbox, Clock, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { usePermissions } from '@/src/hooks/usePermissions';
import { NotificationService } from '@/src/services/notification.service';
import ViewNotificationModal from './notification/ViewNotificationModal';

const channelIcons: Record<string, { icon: any; iconColor: string; bgGradient: string; borderClass: string }> = {
  Email: { icon: Mail, iconColor: 'text-indigo-600', bgGradient: 'from-indigo-500/10 to-indigo-500/5', borderClass: 'border-indigo-200/40' },
  SMS: { icon: MessageSquare, iconColor: 'text-teal-650', bgGradient: 'from-teal-500/10 to-teal-500/5', borderClass: 'border-teal-200/40' },
  WhatsApp: { icon: Smartphone, iconColor: 'text-emerald-650', bgGradient: 'from-emerald-500/10 to-emerald-500/5', borderClass: 'border-emerald-200/40' },
  'Push Notification': { icon: Bell, iconColor: 'text-amber-600', bgGradient: 'from-amber-500/10 to-orange-500/5', borderClass: 'border-amber-200/40' },
  'In-App Notification': { icon: Inbox, iconColor: 'text-violet-600', bgGradient: 'from-violet-500/10 to-fuchsia-500/5', borderClass: 'border-violet-200/40' },
};

function getRelativeTime(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

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
          const filtered = allNotifs.filter((n: any) => {
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
    .filter((m: any) => m.id !== 'dashboard' && m.id !== 'super_admin')
    .map((m: any) => ({
      name: m.name,
      path: m.route === '/feature' ? '/feature' : `/admin${m.route}`,
      description: m.desc || `Manage ${m.name.toLowerCase()}`,
    }));

  const filteredRoutes = searchRoutes.filter((r: any) => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-navbar px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-text-primary lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center" ref={searchRef}>
          <label htmlFor="search-field" className="sr-only">Search modules</label>
          <Search
            className="pointer-events-none absolute left-0 h-5 w-5 text-text-secondary"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-text-primary placeholder:text-placeholder focus:ring-0 sm:text-sm bg-transparent outline-none"
            placeholder="Search modules..."
            type="text"
            value={searchQuery}
            onChange={(e: any) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
              className="absolute right-2 p-1 text-text-secondary hover:text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Dropdown */}
          {showDropdown && searchQuery.length > 0 && (
            <div className="absolute top-14 left-0 w-full max-w-lg bg-white border border-border shadow-xl rounded-xl overflow-hidden z-50">
              <div className="p-2 border-b border-border bg-slate-50 text-xs font-bold text-text-secondary uppercase tracking-wider">
                Quick Navigation
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route: any) => (
                    <li key={route.path}>
                      <button
                        onClick={() => {
                          router.push(route.path);
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-border transition-colors last:border-0"
                      >
                        <div>
                          <div className="text-sm font-bold text-text-primary">{route.name}</div>
                          <div className="text-xs text-text-secondary mt-0.5">{route.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-8 text-center text-sm text-text-secondary">
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
              className={`relative p-2.5 rounded-xl border transition-all duration-300 outline-none ${
                showNotifDropdown 
                  ? 'bg-slate-900 text-white border-border shadow-lg shadow-slate-900/20 scale-95' 
                  : 'text-text-secondary bg-slate-50 hover:bg-white hover:text-indigo-600 border-border/60 hover:border-secondary hover:shadow-md hover:shadow-indigo-500/5'
              }`}
            >
              <span className="sr-only">View notifications</span>
              <Bell className={`h-5 w-5 transition-transform duration-300 ${showNotifDropdown ? 'rotate-12 scale-110' : 'group-hover:rotate-12'}`} aria-hidden="true" />
              {notifications.filter((n: any) => !n.readStatus).length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-rose-500 to-red-600 border border-white shadow-sm"></span>
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 z-50 w-96 rounded-3xl bg-white/95 backdrop-blur-xl border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-300 font-premium">
                <div className="px-5 py-4 border-b border-border/80 bg-slate-50/40 flex justify-between items-center">
                  <span className="font-extrabold text-text-primary text-sm tracking-tight font-display-premium">Notifications</span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-650 border border-indigo-100 px-2.5 py-0.5 rounded-full tracking-wide">
                    {notifications.filter((n: any) => !n.readStatus).length} New
                  </span>
                </div>
                <div className="divide-y divide-border max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-text-secondary">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n: any) => {
                      const ch = channelIcons[n.channel] || channelIcons['In-App Notification'];
                      const ChIcon = ch.icon;
                      const isUnread = !n.readStatus;
                      
                      return (
                        <div 
                          key={n.id}
                          onClick={async () => {
                            setSelectedNotif(n);
                            setIsModalOpen(true);
                            setShowNotifDropdown(false);
                            if (!n.readStatus) {
                              try {
                                await NotificationService.markAsRead(n.id);
                                setNotifications((prev: any) => prev.map((item: any) => item.id === n.id ? { ...item, readStatus: true } : item));
                              } catch (e) {
                                console.error(e);
                              }
                            }
                          }}
                          className={`p-4 hover:bg-slate-50/80 flex items-start gap-3.5 cursor-pointer transition-all duration-200 border-l-4 ${
                            isUnread 
                              ? 'border-indigo-600 bg-indigo-50/10' 
                              : 'border-transparent hover:border-secondary'
                          }`}
                        >
                          <div className="relative shrink-0 mt-0.5">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${ch.bgGradient} border ${ch.borderClass} shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0`}>
                              <ChIcon className={`w-4 h-4 ${ch.iconColor}`} />
                            </div>
                            {isUnread && (
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs truncate font-premium ${isUnread ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                {n.title}
                              </p>
                              <span className="text-[9px] text-text-secondary font-medium shrink-0 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-350" />
                                {getRelativeTime(n.createdTime)}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-secondary line-clamp-2 mt-1 leading-normal font-medium">{n.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary bg-slate-100/80 px-1.5 py-0.5 rounded">
                                {n.module}
                              </span>
                              {n.priority === 'Critical' && (
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                                  <ShieldAlert className="w-2.5 h-2.5" /> CRITICAL
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="p-3.5 border-t border-border bg-slate-50/40 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(false);
                      router.push('/feature/notifications');
                    }}
                    className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-750 transition-all flex items-center justify-center gap-1.5 py-1"
                  >
                    <span>View All in Notification Center</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          


          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />
          
          <button 
            type="button" 
            onClick={() => router.push('/feature/settings')}
            className="-m-2.5 p-2.5 ml-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
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
