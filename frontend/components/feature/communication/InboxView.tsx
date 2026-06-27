'use client';
import { useState, useEffect } from 'react';
import { Conversation } from '@/src/types/communication.types';
import { CommunicationService } from '@/src/services/communication.service';
import { Search, Edit, Users, User, MessageSquare, Hash, Plus, Loader2 } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { Drawer } from '../ui/Drawer';

export default function InboxView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Start chat drawer
  const [isStartChatOpen, setIsStartChatOpen] = useState(false);
  const [chatType, setChatType] = useState<'One-to-One' | 'Group'>('One-to-One');
  const [groupName, setGroupName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('u2');
  const [initialMessage, setInitialMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockUsers = [
    { id: 'u2', name: 'Alice Smith (Mentor)', role: 'Mentor' },
    { id: 'u3', name: 'Bob Johnson (HR)', role: 'HR' },
    { id: 'u4', name: 'Charlie Davis (Coordinator)', role: 'Coordinator' },
    { id: 'u5', name: 'Diana Prince (Student Lead)', role: 'Student' }
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async (selectFirst = true) => {
    setLoading(true);
    try {
      const data = await CommunicationService.getConversations('u1');
      setConversations(data);
      if (selectFirst && data.length > 0) {
        setSelectedConvId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatType === 'Group' && !groupName.trim()) return;
    if (!initialMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const userObj = mockUsers.find(u => u.id === selectedUserId);
      const participants = [
        { id: 'u1', name: 'Current User', role: 'Student' }
      ];
      if (userObj) {
        participants.push({ id: userObj.id, name: userObj.name.split(' (')[0], role: userObj.role });
      }

      // Create conversation
      const newConv = await CommunicationService.createConversation({
        type: chatType,
        name: chatType === 'Group' ? groupName : undefined,
        participants
      });

      // Send initial message
      await CommunicationService.sendMessage({
        conversationId: newConv.id,
        content: initialMessage,
        senderId: 'u1',
        senderName: 'Current User'
      });

      // Clear state
      setGroupName('');
      setInitialMessage('');
      setIsStartChatOpen(false);

      // Reload conversations and select the new conversation
      await fetchConversations(false);
      setSelectedConvId(newConv.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Group': return <Users className="h-5 w-5 text-indigo-650" />;
      case 'Broadcast': return <Hash className="h-5 w-5 text-amber-600 animate-pulse" />;
      default: return <User className="h-5 w-5 text-slate-400" />;
    }
  };

  // Filter conversations based on participant names or discussion group names
  const filteredConversations = conversations.filter(conv => {
    const name = conv.type === 'One-to-One' 
      ? conv.participants.find(p => p.id !== 'u1')?.name 
      : conv.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex h-[75vh] overflow-hidden font-sans">
      
      {/* Sidebar: Conversation List */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-650 animate-pulse" /> Inbox Channels
          </h2>
          <button 
            onClick={() => setIsStartChatOpen(true)}
            className="h-8.5 w-8.5 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            title="Start Conversation"
          >
            <Edit className="h-4.5 w-4.5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-550 font-medium text-slate-700 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading chats...
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white">
              {filteredConversations.map(conv => {
                const titleName = conv.type === 'One-to-One' 
                  ? conv.participants.find(p => p.id !== 'u1')?.name 
                  : conv.name;
                const lastMsgText = conv.lastMessage?.content || 'Empty conversation thread';
                
                return (
                  <div 
                    key={conv.id} 
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-colors flex gap-3 relative ${
                      selectedConvId === conv.id ? 'bg-indigo-50/40 border-l-3 border-indigo-600' : ''
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      {getIcon(conv.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-slate-800 truncate text-xs">
                          {titleName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap ml-2">
                          {new Date(conv.updatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                          {lastMsgText}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No conversations match search.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedConvId ? (
          <ChatWindow conversationId={selectedConvId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="h-12 w-12 mb-4 text-slate-200 animate-pulse" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select a channel conversation</p>
          </div>
        )}
      </div>

      {/* --- DRAWERS --- */}

      {/* Start Chat Drawer */}
      <Drawer
        isOpen={isStartChatOpen}
        onClose={() => setIsStartChatOpen(false)}
        title="Start New Conversation Channel"
      >
        <form onSubmit={handleStartChat} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversation Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setChatType('One-to-One')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  chatType === 'One-to-One' 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                One-to-One Direct Chat
              </button>
              <button
                type="button"
                onClick={() => setChatType('Group')}
                className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  chatType === 'Group' 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Group Discussion Room
              </button>
            </div>
          </div>

          {chatType === 'Group' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Group Name</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., FSD Placement Batch 1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Recipient</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 cursor-pointer"
              >
                {mockUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5 flex-1 flex flex-col min-h-[150px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Message</label>
            <textarea
              required
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your initial welcoming message here..."
              className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-550 transition-all font-medium text-slate-800 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsStartChatOpen(false)}
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
                  Creating...
                </>
              ) : (
                'Create Channel'
              )}
            </button>
          </div>
        </form>
      </Drawer>

    </div>
  );
}
