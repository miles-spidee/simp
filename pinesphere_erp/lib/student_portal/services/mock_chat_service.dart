import 'dart:async';
import 'package:pinesphere_erp/student_portal/models/chat_model.dart';

class MockChatService {
  static Future<ChatMessage> generateReply(String thread, String userMessage) async {
    await Future.delayed(Duration(milliseconds: 1200));
    final now = DateTime.now();
    final timeStr = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}";

    String replyText;
    if (thread == 'mentor') {
      if (userMessage.toLowerCase().contains('capstone') || userMessage.toLowerCase().contains('project')) {
        replyText = "Awesome! I will take a look at your Capstone submission and update the evaluation logs shortly.";
      } else if (userMessage.toLowerCase().contains('kpi') || userMessage.toLowerCase().contains('grade')) {
        replyText = "Your weekly KPI trends are updated on Friday afternoon. Please keep pushing your commits to stay consistent.";
      } else {
        replyText = "Got your message! I'm reviewing the logs now. Keep up the great work.";
      }
    } else {
      replyText = "Thank you for the update. Ticket #5819 has been refreshed. A support agent will review it shortly.";
    }

    return ChatMessage(
      id: "reply-${DateTime.now().millisecondsSinceEpoch}",
      sender: thread == 'mentor' ? 'mentor' : 'system',
      text: replyText,
      time: timeStr,
    );
  }
}
