"use client";

import React from 'react';
import { Send } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function ChatPage() {
  const {
    activeChatThread,
    setActiveChatThread,
    chatInputText,
    setChatInputText,
    mentorMessages,
    supportMessages,
    handleSendChatMessage
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-205 pb-5">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-[#3794d1] uppercase tracking-widest flex items-center gap-2">
            <span>ERP Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">Communication Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sync & Support Desk</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Communicate directly with your assigned project mentor Mr. Anand Jayavel or contact the helpdesk.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl h-[600px] overflow-hidden shadow-sm flex flex-col lg:flex-row card-premium-hover">
        {/* Contacts Sidebar Panel */}
        <div className="w-full lg:w-80 bg-[#0b1120] text-slate-300 flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="p-5 border-b border-slate-800 bg-slate-950/30">
            <h4 className="font-bold text-[10px] text-white uppercase tracking-widest">Active Channels</h4>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {[
              { key: 'mentor', label: 'Guide & Mentor Sync', desc: 'Mr. Anand Jayavel (Senior Architect)', online: true },
              { key: 'support', label: 'ERP Helpdesk Support', desc: 'Billing, credentials, & session audits', online: true }
            ].map((th) => {
              const isSelected = activeChatThread === th.key;
              return (
                <button
                  key={th.key}
                  onClick={() => setActiveChatThread(th.key as 'mentor' | 'support')}
                  className={`w-full text-left p-4 transition-all rounded-xl border text-xs relative group flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/80 border-slate-700/50 text-white shadow-md'
                      : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                  }`}
                >
                  {/* Selected bar indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-[#3794d1] rounded-r" />
                  )}

                  {/* Status Dot */}
                  <div className="relative mt-1">
                    <span className={`h-2.5 w-2.5 rounded-full block ${th.online ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-600'}`} />
                    {th.online && (
                      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`font-bold block truncate transition-colors ${isSelected ? 'text-[#3794d1]' : 'text-slate-200 group-hover:text-[#3794d1]'}`}>
                        {th.label}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-450 truncate">{th.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Message Box */}
        <div className="flex-1 flex flex-col justify-between bg-white relative">
          {/* Header bar */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-xs text-slate-805 uppercase tracking-widest">
                  {activeChatThread === 'mentor' ? 'Direct Sync: Mr. Anand Jayavel' : 'Pinesphere Desk Support'}
                </h4>
                <span className="text-[9px] text-slate-400 block font-bold mt-0.5 uppercase tracking-wider">
                  Active Session Coordinator
                </span>
              </div>
            </div>
            
            <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50/60 border border-emerald-100/50 px-3 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 min-h-[300px] bg-[radial-gradient(circle_at_center,rgba(55,148,209,0.01)_0%,transparent_100%)] scrollbar-thin">
            {(activeChatThread === 'mentor' ? mentorMessages : supportMessages).map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[70%] animate-slide-in ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div
                    className={`px-4.5 py-3 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#3794d1] text-white rounded-2xl rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold mt-1.5 uppercase tracking-wider font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Send message form */}
          <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
            <input
              type="text"
              required
              placeholder="Type updates or queries..."
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-4.5 py-3 text-xs text-slate-800 rounded-xl focus:outline-none focus:bg-white focus:border-[#3794d1] focus:ring-1 focus:ring-[#3794d1] transition-all shadow-inner font-semibold placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="h-10.5 w-10.5 bg-slate-900 hover:bg-[#3794d1] text-white flex items-center justify-center rounded-xl transition-all duration-300 btn-premium-hover cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

