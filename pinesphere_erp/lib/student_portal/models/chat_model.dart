class ChatMessage {
  final String id;
  final String sender; // 'user' | 'system' | 'mentor'
  final String text;
  final String time;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.time,
  });
}

class ChatThreadState {
  final List<ChatMessage> mentorMessages;
  final List<ChatMessage> supportMessages;
  final String activeThread; // 'mentor' | 'support'
  final bool isSending;

  ChatThreadState({
    required this.mentorMessages,
    required this.supportMessages,
    required this.activeThread,
    this.isSending = false,
  });

  ChatThreadState copyWith({
    List<ChatMessage>? mentorMessages,
    List<ChatMessage>? supportMessages,
    String? activeThread,
    bool? isSending,
  }) {
    return ChatThreadState(
      mentorMessages: mentorMessages ?? this.mentorMessages,
      supportMessages: supportMessages ?? this.supportMessages,
      activeThread: activeThread ?? this.activeThread,
      isSending: isSending ?? this.isSending,
    );
  }
}
