export type MessageStatus = 'Sent' | 'Delivered' | 'Read' | 'Failed';
export type MessagePriority = 'Normal' | 'High';
export type ConversationType = 'One-to-One' | 'Group' | 'Broadcast';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  attachments: string[];
  createdTime: string;
  readTime?: string;
  status: MessageStatus;
  priority: MessagePriority;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For groups
  participants: { id: string; name: string; role: string }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedTime: string;
}
