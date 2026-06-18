import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/chat_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/widgets/chat_bubble.dart';

class ChatScreen extends ConsumerStatefulWidget {
  ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(chatProvider);
    final notifier = ref.read(chatProvider.notifier);

    // Filter messages based on selected tab
    final activeMessages =
        state.activeThread == 'mentor' ? state.mentorMessages : state.supportMessages;

    // Trigger auto-scroll on new messages
    _scrollToBottom();

    return Scaffold(
      appBar: AppBar(
        title: Text("ERP Helpdesk Sync"),
      ),
      body: Column(
        children: [
          // Channel Selector Tabs
          Container(
            color: PortalTheme.backgroundSlate(context),
            padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: _buildChannelButton(
                    context,
                    "Assigned Guide Chat",
                    'mentor',
                    state.activeThread,
                    notifier,
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _buildChannelButton(
                    context,
                    "ERP Support Desk",
                    'support',
                    state.activeThread,
                    notifier,
                  ),
                ),
              ],
            ),
          ),
          Divider(color: PortalTheme.divider(context), height: 1),

          // Message Logs Scroll area
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.all(16),
              itemCount: activeMessages.length + (state.isSending ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == activeMessages.length) {
                  return _buildTypingIndicator();
                }
                final msg = activeMessages[index];
                return ChatBubble(message: msg);
              },
            ),
          ),

          // Message composer box
          Container(
            color: PortalTheme.cardSurface(context),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: InputDecoration(
                        hintText: state.activeThread == 'mentor'
                            ? "Message Anand Jayavel..."
                            : "Describe your support ticket...",
                        fillColor: PortalTheme.backgroundSlate(context),
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      style: TextStyle(fontSize: 13),
                    ),
                  ),
                  SizedBox(width: 12),
                  CircleAvatar(
                    backgroundColor: PortalTheme.primaryBlue(context),
                    radius: 20,
                    child: IconButton(
                      onPressed: () {
                        if (_textController.text.trim().isEmpty) return;
                        final txt = _textController.text;
                        _textController.clear();
                        notifier.sendMessage(txt);
                      },
                      icon: Icon(Icons.send, color: Colors.white, size: 16),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChannelButton(
    BuildContext context,
    String label,
    String threadValue,
    String activeThread,
    ChatNotifier notifier,
  ) {
    final isActive = activeThread == threadValue;
    return InkWell(
      onTap: () => notifier.setActiveThread(threadValue),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        decoration: BoxDecoration(
          color: isActive ? PortalTheme.primaryBlue(context).withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isActive ? PortalTheme.accentBlue(context) : PortalTheme.borderLight(context),
          ),
        ),
        padding: EdgeInsets.symmetric(vertical: 10),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? PortalTheme.primaryBlue(context) : PortalTheme.textMuted(context),
            fontWeight: FontWeight.bold,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: PortalTheme.accentBlue(context).withOpacity(0.1),
            child: Icon(Icons.support_agent, size: 14, color: PortalTheme.accentBlue(context)),
          ),
          SizedBox(width: 8),
          Container(
            decoration: BoxDecoration(
              color: PortalTheme.cardSurface(context),
              borderRadius: BorderRadius.circular(12),
            ),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Text(
              "Agent is typing responses...",
              style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 11, fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }
}
