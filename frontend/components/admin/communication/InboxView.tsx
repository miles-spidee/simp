'use client';
import { useState, useEffect } from 'react';
import { Conversation } from '@/src/types/communication.types';
import { CommunicationService } from '@/src/services/communication.service';
import { Search, Edit, Users, User, MessageSquare, Hash, Clock, MoreVertical } from 'lucide-react';
import ChatWindow from './ChatWindow';

export default function InboxView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      try {
        const data = await CommunicationService.getConversations('u1');
        setConversations(data);
        if (data.length > 0) setSelectedConvId(data[0].id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'Group': return <Users className="h-5 w-5 text-indigo-500" />;
      case 'Broadcast': return <Hash className="h-5 w-5 text-amber-500" />;
      default: return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm flex h-[75vh] overflow-hidden">
      
      {/* Sidebar: Conversation List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-900" /> Inbox
          </h2>
          <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading conversations...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.slice(0, 50).map(conv => (
                <div 
                  key={conv.id} 
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer hover:bg-white transition-colors flex gap-3 ${selectedConvId === conv.id ? 'bg-white border-l-2 border-gray-900' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {getIcon(conv.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-gray-900 truncate">
                        {conv.type === 'One-to-One' ? conv.participants.find(p => p.id !== 'u1')?.name : conv.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                        {new Date(conv.updatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs text-gray-500 truncate">
                        {conv.type === 'Broadcast' ? 'Broadcast Message...' : 'Recent message snippet...'}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="h-5 w-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedConvId ? (
          <ChatWindow conversationId={selectedConvId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

    </div>
  );
}
