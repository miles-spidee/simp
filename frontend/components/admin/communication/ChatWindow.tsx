'use client';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/src/types/communication.types';
import { CommunicationService } from '@/src/services/communication.service';
import { Send, Paperclip, Check, CheckCheck, Smile, MoreHorizontal, Phone, Video } from 'lucide-react';

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      try {
        const data = await CommunicationService.getMessages(conversationId);
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    try {
      const newMsg = await CommunicationService.sendMessage({
        conversationId,
        content: inputText,
        senderId: 'u1',
        senderName: 'Current User'
      });
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Read') return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
    if (status === 'Delivered') return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
    return <Check className="h-3.5 w-3.5 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
            T
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Conversation Thread</h3>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Phone className="h-5 w-5 hover:text-gray-900 cursor-pointer transition-colors" />
          <Video className="h-5 w-5 hover:text-gray-900 cursor-pointer transition-colors" />
          <MoreHorizontal className="h-5 w-5 hover:text-gray-900 cursor-pointer transition-colors ml-2" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {loading ? (
          <div className="text-center text-gray-500 text-sm mt-10">Loading messages...</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === 'u1';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 mb-1 max-w-[70%]">
                  {!isMe && (
                    <div className="h-6 w-6 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-gray-900 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                    <p>{msg.content}</p>
                    {msg.attachments?.map((att, i) => (
                      <div key={i} className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-2 ${isMe ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Paperclip className="h-3 w-3" /> {att}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] text-gray-400 ${isMe ? 'mr-1' : 'ml-9'}`}>
                  {new Date(msg.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && getStatusIcon(msg.status)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-4 transition-all focus-within:bg-white focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
            <button className="text-gray-400 hover:text-gray-600 p-2 -ml-2">
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none py-3.5 focus:outline-none focus:ring-0 text-sm px-2"
            />
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
