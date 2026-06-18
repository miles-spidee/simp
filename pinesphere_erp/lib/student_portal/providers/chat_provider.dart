import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/chat_model.dart';
import 'package:pinesphere_erp/student_portal/services/mock_chat_service.dart';

class ChatNotifier extends StateNotifier<ChatThreadState> {
  ChatNotifier()
      : super(
          ChatThreadState(
            activeThread: 'mentor',
            mentorMessages: [
              ChatMessage(id: 'm1', sender: 'mentor', text: 'Hi Harini, please review Module 3 of React architecture before taking the evaluation.', time: '02:30 PM'),
              ChatMessage(id: 'm2', sender: 'user', text: 'Yes guide, I am working through caching and route revalidation topics.', time: '02:45 PM'),
              ChatMessage(id: 'm3', sender: 'mentor', text: 'Good. Let me know when you submit the Capstone link in the workspace.', time: '02:48 PM'),
            ],
            supportMessages: [
              ChatMessage(id: 's1', sender: 'system', text: 'Welcome to Pinesphere ERP Direct Support Desk. How may we assist you?', time: '09:00 AM'),
              ChatMessage(id: 's2', sender: 'user', text: 'I am unable to see my updated KPI rating from last week.', time: '10:15 AM'),
              ChatMessage(id: 's3', sender: 'system', text: 'Guide ratings are synced at the end of every week. Please expect updates by Friday.', time: '10:16 AM'),
            ],
          ),
        );

  void setActiveThread(String thread) {
    state = state.copyWith(activeThread: thread);
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final now = DateTime.now();
    final timeStr = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}";

    final userMsg = ChatMessage(
      id: "msg-${DateTime.now().millisecondsSinceEpoch}",
      sender: 'user',
      text: text.trim(),
      time: timeStr,
    );

    if (state.activeThread == 'mentor') {
      state = state.copyWith(
        mentorMessages: [...state.mentorMessages, userMsg],
        isSending: true,
      );
    } else {
      state = state.copyWith(
        supportMessages: [...state.supportMessages, userMsg],
        isSending: true,
      );
    }

    try {
      final reply = await MockChatService.generateReply(state.activeThread, text);
      if (state.activeThread == 'mentor') {
        state = state.copyWith(
          mentorMessages: [...state.mentorMessages, reply],
          isSending: false,
        );
      } else {
        state = state.copyWith(
          supportMessages: [...state.supportMessages, reply],
          isSending: false,
        );
      }
    } catch (_) {
      state = state.copyWith(isSending: false);
    }
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatThreadState>((ref) {
  return ChatNotifier();
});
