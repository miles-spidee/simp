import { Conversation, Message } from '../types/communication.types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../data/mock-conversations';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const communicationApi = {
  getConversations: async (userId: string): Promise<Conversation[]> => {
    await delay(600);
    
    // Attach last message to conversations
    const sortedConvs = [...MOCK_CONVERSATIONS]
      .filter(c => c.participants.some(p => p.id === userId));
      
    sortedConvs.forEach(conv => {
      const convMsgs = MOCK_MESSAGES.filter(m => m.conversationId === conv.id);
      if (convMsgs.length > 0) {
        convMsgs.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
        conv.lastMessage = convMsgs[0];
      }
    });

    return sortedConvs.sort((a, b) => new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime());
  },
  
  getMessages: async (conversationId: string): Promise<Message[]> => {
    await delay(300);
    return MOCK_MESSAGES
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
  },
  
  sendMessage: async (data: Partial<Message>): Promise<Message> => {
    await delay(300);
    const newMessage: Message = {
      id: `msg-${MOCK_MESSAGES.length + 1}`,
      conversationId: data.conversationId || '',
      senderId: data.senderId || 'u1',
      senderName: data.senderName || 'Current User',
      content: data.content || '',
      attachments: data.attachments || [],
      createdTime: new Date().toISOString(),
      status: 'Sent',
      priority: data.priority || 'Normal'
    };
    MOCK_MESSAGES.push(newMessage);
    
    // Update conversation
    const conv = MOCK_CONVERSATIONS.find(c => c.id === data.conversationId);
    if (conv) {
      conv.updatedTime = newMessage.createdTime;
      conv.lastMessage = newMessage;
    }
    
    return newMessage;
  },

  createConversation: async (data: Partial<Conversation>): Promise<Conversation> => {
    await delay(300);
    const newConv: Conversation = {
      id: `conv-${MOCK_CONVERSATIONS.length + 1}`,
      type: data.type || 'One-to-One',
      name: data.name,
      participants: data.participants || [
        { id: 'u1', name: 'Current User', role: 'Student' }
      ],
      unreadCount: 0,
      updatedTime: new Date().toISOString()
    };
    MOCK_CONVERSATIONS.unshift(newConv);
    return newConv;
  }
};
