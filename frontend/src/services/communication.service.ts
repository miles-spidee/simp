import { communicationApi } from '../api/communication.api';
import { Conversation, Message } from '../types/communication.types';

export class CommunicationService {
  static async getConversations(userId: string = 'u1'): Promise<Conversation[]> {
    return communicationApi.getConversations(userId);
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    return communicationApi.getMessages(conversationId);
  }

  static async getUnreadCount(userId: string = 'u1'): Promise<number> {
    const conversations = await communicationApi.getConversations(userId);
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  static async sendMessage(data: Partial<Message>): Promise<Message> {
    return communicationApi.sendMessage(data);
  }

  static async createConversation(data: Partial<Conversation>): Promise<Conversation> {
    return communicationApi.createConversation(data);
  }

  static async getCommunicationActivity(userId: string = 'u1'): Promise<{ totalConversations: number, activeGroups: number }> {
    const conversations = await communicationApi.getConversations(userId);
    return {
      totalConversations: conversations.length,
      activeGroups: conversations.filter(c => c.type === 'Group').length
    };
  }
}
