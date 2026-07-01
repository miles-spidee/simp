import { apiClient } from './api.client';
import { Conversation, Message } from '../types/communication.types';
import {} from '../types/conversations.types';


export const communicationApi = {
  getConversations: async (userId: string): Promise<Conversation[]> => {
    try {
      const res = await apiClient.get('/api/v1/communication');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  getMessages: async (conversationId: string): Promise<Message[]> => {
    try {
      const res = await apiClient.get('/api/v1/communication');
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  },
  
  sendMessage: async (data: Partial<Message>): Promise<Message> => {
    try {
      const res = await apiClient.get('/api/v1/communication');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  },

  createConversation: async (data: Partial<Conversation>): Promise<Conversation> => {
    try {
      const res = await apiClient.post('/api/v1/communication');
      return res.data?.data || null as any;
    } catch (error) {
      return null as any;
    }
  }
};
