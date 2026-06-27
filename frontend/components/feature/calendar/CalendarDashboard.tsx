'use client';
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/src/types/calendar.types';
import { CalendarService } from '@/src/services/calendar.service';
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const all = await CalendarService.getEvents();
        const today = await CalendarService.getTodaysEvents();
        setEvents(all);
        setTodaysEvents(today);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getTypeColor = (type: string) => {
    const map: Record<string, string> = {
      Interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      Meeting: 'bg-blue-100 text-blue-700 border-blue-200',
      Assessment: 'bg-purple-100 text-purple-700 border-purple-200',
      Holiday: 'bg-rose-100 text-rose-700 border-rose-200',
      Leave: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return map[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Calendar & Scheduler</h1>
          <p className="text-sm text-gray-500 mt-1">Manage schedules, interviews, assessments, and meetings.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Calendar View Placeholder */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">June 2026</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="h-4 w-4" /></button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="text-center text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Full Month Calendar UI Placeholder</p>
              <p className="text-xs mt-1">Integrates with FullCalendar or BigCalendar</p>
            </div>
          </div>
        </div>

        {/* Today's Agenda */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[70vh]">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" /> Today's Agenda
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500 text-center mt-10">Loading events...</p>
            ) : todaysEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-10">No events scheduled for today.</p>
            ) : (
              todaysEvents.map(event => (
                <div key={event.id} className="relative pl-6 pb-6 border-l-2 border-gray-100 last:border-0 last:pb-0">
                  <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-white ${getTypeColor(event.type).split(' ')[0]}`}></div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-gray-900">{event.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Users className="h-3.5 w-3.5" />
                          {event.participants.length} participants
                        </div>
                      )}
                      
                      {event.meetingLink ? (
                        <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                          <Video className="h-3.5 w-3.5" /> Join Meeting
                        </div>
                      ) : event.location && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5" /> {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
