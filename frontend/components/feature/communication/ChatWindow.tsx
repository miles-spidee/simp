'use client';
import { useState, useEffect, useRef } from 'react';
import { Message, Conversation } from '@/src/types/communication.types';
import { CommunicationService } from '@/src/services/communication.service';
import { Send, Paperclip, Check, CheckCheck, Smile, MoreHorizontal, Phone, Video, Loader2, X, PhoneOff, Users } from 'lucide-react';

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  
  // Attachments State
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Emojis State
  const [showEmojis, setShowEmojis] = useState(false);

  // Calling Simulation State
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [callState, setCallState] = useState<'Dialling...' | 'Connected'>('Dialling...');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojis = ['👍', '❤️', '😂', '🎉', '🔥', '🚀', '👋', '😢', '🙌', '💯', '✨', '✔️'];

  useEffect(() => {
    loadConversationDetails();
    loadMessages();
  }, [conversationId]);

  const loadConversationDetails = async () => {
    try {
      const convs = await CommunicationService.getConversations('u1');
      const found = convs.find(c => c.id === conversationId);
      if (found) setConversation(found);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await CommunicationService.getMessages(conversationId);
      setMessages(data);
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !attachedFile) return;
    
    try {
      const attachments = attachedFile ? [attachedFile] : [];
      const newMsg = await CommunicationService.sendMessage({
        conversationId,
        content: inputText.trim() || `Attached File: ${attachedFile}`,
        senderId: 'u1',
        senderName: 'Current User',
        attachments
      });

      setMessages(prev => [...prev, newMsg]);
      setInputText('');
      setAttachedFile(null);
      setShowEmojis(false);
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttachMockFile = () => {
    const files = ['resume_draft.pdf', 'screenshot_bug.png', 'payment_receipt.png', 'completion_certificate.pdf'];
    const randomFile = files[Math.floor(Math.random() * files.length)];
    setAttachedFile(randomFile);
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setCallActive(true);
    setCallState('Dialling...');
    
    setTimeout(() => {
      setCallState('Connected');
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Read') return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
    if (status === 'Delivered') return <CheckCheck className="h-3.5 w-3.5 text-slate-400" />;
    return <Check className="h-3.5 w-3.5 text-slate-400" />;
  };

  // Resolve Header Details
  const titleName = (conversation?.type === 'One-to-One' 
    ? conversation.participants.find(p => p.id !== 'u1')?.name 
    : conversation?.name) || 'Discussion Group';
  
  const roleLabel = conversation?.type === 'One-to-One'
    ? conversation.participants.find(p => p.id !== 'u1')?.role || 'Mentor'
    : `${conversation?.participants?.length || 2} Members`;

  return (
    <div className="flex flex-col h-full relative font-sans">
      
      {/* 1. Header Area */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center font-extrabold text-indigo-650 text-sm">
            {conversation?.type === 'Group' ? <Users className="w-4 h-4 text-indigo-600" /> : titleName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-snug">{titleName}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{roleLabel} • Active Now</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button 
            onClick={() => handleStartCall('voice')}
            className="p-1.5 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
            title="Start Call"
          >
            <Phone className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => handleStartCall('video')}
            className="p-1.5 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
            title="Start Video Call"
          >
            <Video className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* 2. Messages Bubble Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === 'u1';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}>
                <div className="flex items-end gap-2 mb-1 max-w-[70%]">
                  {!isMe && (
                    <div className="h-6 w-6 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-600">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-xs font-semibold ${
                    isMe 
                      ? 'bg-slate-900 text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {msg.attachments.map((att, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border ${
                              isMe 
                                ? 'bg-white/10 border-white/10 text-white' 
                                : 'bg-slate-50 border-slate-200 text-indigo-650'
                            }`}
                          >
                            <Paperclip className="h-3 w-3 shrink-0" />
                            {att}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 ${isMe ? 'mr-1' : 'ml-8 font-semibold'}`}>
                  {new Date(msg.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && getStatusIcon(msg.status)}
                </div>
              </div>
            );
          })
        )}

      </div>

      {/* 3. Attachment Preview & Emoji Selector overlays */}
      <div className="bg-white px-4 shrink-0">
        
        {attachedFile && (
          <div className="py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-600 font-mono">
            <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-xl">
              <Paperclip className="w-3 h-3 text-indigo-600" />
              {attachedFile}
            </span>
            <button 
              onClick={() => setAttachedFile(null)}
              className="p-1 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {showEmojis && (
          <div className="py-3 border-t border-slate-100 flex flex-wrap gap-2 animate-fade-in">
            {emojis.map(e => (
              <button 
                key={e} 
                type="button"
                onClick={() => handleSelectEmoji(e)}
                className="text-lg p-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 transition-all focus-within:bg-white focus-within:border-indigo-550 focus-within:ring-1 focus-within:ring-indigo-550">
            <button 
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className={`text-slate-400 hover:text-slate-650 p-2 -ml-2 cursor-pointer ${showEmojis ? 'text-indigo-600' : ''}`}
            >
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none py-3.5 focus:outline-none focus:ring-0 text-xs px-2 font-medium text-slate-800 placeholder-slate-400"
            />
            <button 
              type="button"
              onClick={handleAttachMockFile}
              className="text-slate-400 hover:text-slate-650 p-2 cursor-pointer"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() && !attachedFile}
            className="h-12 w-12 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-lg shadow-slate-900/10"
          >
            <Send className="h-4.5 w-4.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 5. Floating Call Simulation Overlay */}
      {callActive && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white animate-fade-in p-6">
          <div className="relative mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-3xl shadow-2xl animate-pulse">
              {titleName.charAt(0)}
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-indigo-500/25 animate-ping"></div>
          </div>
          
          <h2 className="text-xl font-bold text-slate-100">{titleName}</h2>
          <p className="text-sm font-semibold text-slate-400 mt-1 capitalize">{callType} Call • {callState}</p>

          {callType === 'video' && callState === 'Connected' && (
            <div className="w-full max-w-sm aspect-video bg-slate-900 border border-slate-800 rounded-2xl mt-6 overflow-hidden relative shadow-inner flex items-center justify-center text-slate-500 font-mono text-xs">
              [ Camera Feed Active: Simulated Video Stream ]
            </div>
          )}

          <button
            onClick={() => setCallActive(false)}
            className="mt-12 h-14 w-14 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center shadow-lg shadow-rose-600/30 hover:scale-115 transition-all cursor-pointer"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

    </div>
  );
}
