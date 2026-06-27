'use client';
import { useState, useEffect } from 'react';
import { CalendarEvent, EventType, EventStatus } from '@/src/types/calendar.types';
import { CalendarService } from '@/src/services/calendar.service';
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, Plus, ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function CalendarDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [todaysEvents, setTodaysEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Month navigation state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Event drawers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // New Event form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>('Meeting');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleOpenAdd = (dateStr?: string) => {
    setTitle('');
    setDescription('');
    setType('Meeting');
    setEventDate(dateStr || new Date().toISOString().split('T')[0]);
    setStartTime('09:00');
    setEndTime('10:00');
    setLocation('');
    setMeetingLink('');
    setParticipantsText('');
    setIsAddOpen(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    setIsSubmitting(true);
    try {
      const startISO = new Date(`${eventDate}T${startTime}`).toISOString();
      const endISO = new Date(`${eventDate}T${endTime}`).toISOString();
      const participants = participantsText.split(',').map(p => p.trim()).filter(p => p !== '');

      await CalendarService.createEvent({
        title,
        description,
        type,
        startTime: startISO,
        endTime: endISO,
        location: location.trim() ? location : undefined,
        meetingLink: meetingLink.trim() ? meetingLink : undefined,
        participants: participants.length > 0 ? participants : ['Current User'],
        status: 'Scheduled'
      });

      setIsAddOpen(false);
      await fetchEvents();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get grid days
  const getGridDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startOffset = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
    const totalDays = lastDay.getDate();

    const daysList: { date: Date; isCurrentMonth: boolean }[] = [];

    // Fill previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      daysList.push({
        date: new Date(year, month, -i),
        isCurrentMonth: false
      });
    }

    // Fill current month days
    for (let i = 1; i <= totalDays; i++) {
      daysList.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Fill next month days to align grid to 42 cells (6 rows)
    const remaining = 42 - daysList.length;
    for (let i = 1; i <= remaining; i++) {
      daysList.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return daysList;
  };

  const getEventsForDay = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];
    return events.filter(e => e.startTime.startsWith(formatted));
  };

  const getTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      Interview: 'bg-indigo-50 text-indigo-700 border-indigo-150',
      Meeting: 'bg-blue-50 text-blue-700 border-blue-150',
      Assessment: 'bg-purple-50 text-purple-700 border-purple-150',
      Holiday: 'bg-rose-50 text-rose-700 border-rose-150',
      Leave: 'bg-orange-50 text-orange-700 border-orange-150'
    };
    return styles[type] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const gridDays = getGridDays();

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-indigo-650" />
            Calendar & Scheduler
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage schedules, interviews, assessments, and meetings.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer animate-fade-in"
          >
            <Plus className="h-4 w-4" /> New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Grid: Main Month Calendar (spans 8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1.5">
              <button 
                onClick={handlePrevMonth}
                className="p-2 border border-slate-200 text-slate-550 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 border border-slate-200 text-slate-550 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month grid cells */}
          <div className="grid grid-cols-7 gap-1 border-t border-l border-slate-100 rounded-xl overflow-hidden bg-slate-100">
            {loading ? (
              <div className="col-span-7 py-32 bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              gridDays.map(({ date, isCurrentMonth }, idx) => {
                const dayEvents = getEventsForDay(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleOpenAdd(date.toISOString().split('T')[0])}
                    className={`bg-white min-h-[90px] p-2 flex flex-col justify-between hover:bg-slate-50/50 cursor-pointer transition-colors border-r border-b border-slate-100 relative ${
                      !isCurrentMonth ? 'text-slate-300 opacity-60' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-extrabold ${
                        isToday ? 'h-5 w-5 bg-indigo-600 text-white rounded-full flex items-center justify-center' : 'text-slate-550'
                      }`}>
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Events indicators */}
                    <div className="flex flex-col gap-1 mt-1 flex-1 overflow-hidden max-h-[60px]">
                      {dayEvents.slice(0, 2).map(evt => (
                        <div 
                          key={evt.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(evt);
                          }}
                          className={`text-[9px] font-bold border px-1.5 py-0.5 rounded truncate transition-all hover:shadow-sm ${getTypeStyle(evt.type)}`}
                          title={evt.title}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] font-bold text-slate-400 pl-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Grid: Today's Agenda (spans 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col h-[585px]">
          <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-650" /> Today's Active Agenda
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : todaysEvents.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium">
                <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                No events scheduled for today.
              </div>
            ) : (
              todaysEvents.map(event => (
                <div key={event.id} className="relative pl-5 pb-5 border-l-2 border-slate-100 last:border-0 last:pb-0">
                  <div className={`absolute -left-[6.5px] top-0 h-3 w-3 rounded-full border-2 border-white ${
                    event.type === 'Interview' ? 'bg-indigo-600' :
                    event.type === 'Meeting' ? 'bg-blue-600' :
                    'bg-slate-405'
                  }`}></div>
                  
                  <div 
                    onClick={() => setSelectedEvent(event)}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 leading-tight">{event.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shrink-0 ${getTypeStyle(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 mt-3 text-slate-500 font-medium text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {event.participants.length} participants
                        </div>
                      )}
                      
                      {event.meetingLink ? (
                        <a 
                          href={event.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-indigo-650 font-bold hover:underline"
                        >
                          <Video className="h-3.5 w-3.5 shrink-0" /> Join Google Meet
                        </a>
                      ) : event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
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

      {/* --- DRAWERS --- */}

      {/* 1. Add Event Drawer */}
      <Drawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule New Event"
      >
        <form onSubmit={handleCreateEvent} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Technical Interview - Phase 2"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                <option value="Meeting">Meeting</option>
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Training">Training</option>
                <option value="Holiday">Holiday</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Date</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-850"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-850"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide event description and agenda..."
              className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Physical Location (Optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Conference Room A"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-805"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meeting URL (Optional)</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="e.g., https://meet.google.com/abc"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-805"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participants (Comma-separated emails)</label>
            <input
              type="text"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              placeholder="e.g., harin@pinesphere.com, mentor@pinesphere.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Event'
              )}
            </button>
          </div>
        </form>
      </Drawer>

      {/* 2. View Event Details Drawer */}
      <Drawer
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title="Event Schedule Details"
      >
        {selectedEvent && (
          <div className="p-6 space-y-6 overflow-y-auto font-sans">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled Event</span>
                <h4 className="text-sm font-bold text-slate-850">{selectedEvent.title}</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0 ${getTypeStyle(selectedEvent.type)}`}>
                {selectedEvent.type}
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-650" /> Agenda & Context
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {selectedEvent.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Event Date</span>
                <p className="text-slate-800 font-bold">
                  {new Date(selectedEvent.startTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration Time</span>
                <p className="text-slate-800 font-bold">
                  {new Date(selectedEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedEvent.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {selectedEvent.meetingLink ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Join Meeting (Virtual)</span>
                <a
                  href={selectedEvent.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 border border-indigo-150 rounded-xl font-bold text-xs transition-colors"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  Join Google Meet Link
                </a>
              </div>
            ) : selectedEvent.location && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Physical Venue Location</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedEvent.location}
                </p>
              </div>
            )}

            <div className="space-y-3 pt-3.5 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invitees ({selectedEvent.participants.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.participants.map(p => (
                  <span key={p} className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-650">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Schedule
              </button>
            </div>
          </div>
        )}
      </Drawer>

    </div>
  );
}
