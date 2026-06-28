"use client";

import React from 'react';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-500" />
            General Settings
          </h1>
          <p className="text-text-secondary text-sm mt-1">Manage your account preferences and settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: User, active: true },
            { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
            { id: 'security', label: 'Security', icon: Shield, active: false },
            { id: 'appearance', label: 'Appearance', icon: Palette, active: false }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
                tab.active 
                  ? 'bg-selected text-primary' 
                  : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${tab.active ? 'text-primary' : 'text-text-secondary'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">Profile Information</h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                <textarea 
                  className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary min-h-[100px]"
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <div className="pt-4 border-t border-border">
                <button className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
