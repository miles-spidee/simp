import { Conversation, Message } from '../types/communication.types';

export const MOCK_CONVERSATIONS: Conversation[] = Array.from({ length: 200 }).map((_, i) => {
  const types: ('One-to-One' | 'Group' | 'Broadcast')[] = ['One-to-One', 'Group', 'Broadcast'];
  
  return {
    id: `conv-${i + 1}`,
    type: types[i % types.length],
    name: types[i % types.length] !== 'One-to-One' ? `Discussion Group ${i + 1}` : undefined,
    participants: [
      { id: 'u1', name: 'Current User', role: 'Student' },
      { id: `u${i + 2}`, name: `User ${i + 2}`, role: ['Mentor', 'HR', 'Coordinator'][i % 3] }
    ],
    unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
    updatedTime: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString()
  };
});

export const MOCK_MESSAGES: Message[] = Array.from({ length: 3000 }).map((_, i) => {
  const convId = `conv-${(i % 200) + 1}`;
  const isCurrentUser = Math.random() > 0.5;
  
  return {
    id: `msg-${i + 1}`,
    conversationId: convId,
    senderId: isCurrentUser ? 'u1' : `u${(i % 50) + 2}`,
    senderName: isCurrentUser ? 'Current User' : `User ${(i % 50) + 2}`,
    content: `This is a sample message content for message ${i + 1}. We are discussing project updates and tasks.`,
    attachments: i % 15 === 0 ? ['document.pdf'] : [],
    createdTime: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
    status: ['Sent', 'Delivered', 'Read'][i % 3] as 'Sent' | 'Delivered' | 'Read',
    priority: i % 20 === 0 ? 'High' : 'Normal',
  };
});
