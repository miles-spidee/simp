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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white border border-slate-200 rounded-xl h-[600px] overflow-hidden shadow-sm">
        {/* Contact List Sidebar */}
        <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Contacts Desk</h4>
          </div>

          <div className="flex-1 p-2 space-y-1">
            {[
              { key: 'mentor', label: 'Guide / Mentor Chat', desc: 'Syncs regarding capstone tasks' },
              { key: 'support', label: 'Helpdesk Support', desc: 'Queries regarding billing / ERP checks' }
            ].map((th) => {
              const isSelected = activeChatThread === th.key;
              return (
                <button
                  key={th.key}
                  onClick={() => setActiveChatThread(th.key as any)}
                  className={`w-full text-left p-3.5 transition-all border text-xs ${isSelected
                      ? 'bg-blue-50 border-blue-200 text-blue-600 font-bold'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100/60'
                    }`}
                >
                  <span className="block text-slate-800 font-bold">{th.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-1 truncate">{th.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread Panel */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-250 bg-slate-50/30 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                {activeChatThread === 'mentor' ? 'Direct Sync: Mr. Anand Jayavel' : 'Pinesphere Desk Support'}
              </h4>
              <span className="text-[9px] text-emerald-600 block font-bold mt-0.5">● Connected</span>
            </div>
          </div>

          {/* Messages Scroller */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[300px]">
            {(activeChatThread === 'mentor' ? mentorMessages : supportMessages).map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[75%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-3 text-xs leading-relaxed ${isUser
                      ? 'bg-blue-600 text-white rounded-none shadow-sm'
                      : 'bg-slate-100 border border-slate-200 text-slate-700'
                    }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Input Box Form */}
          <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              required
              placeholder="Type updates or queries..."
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-855 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
