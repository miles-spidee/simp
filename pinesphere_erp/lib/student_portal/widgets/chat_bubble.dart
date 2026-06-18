import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/models/chat_model.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  ChatBubble({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final isMe = message.sender == 'user';
    final isSystem = message.sender == 'system';

    if (isSystem) {
      return Center(
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.03),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: PortalTheme.borderLight(context)),
          ),
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          margin: EdgeInsets.symmetric(vertical: 8),
          child: Column(
            children: [
              Text(
                message.text,
                style: TextStyle(
                  color: PortalTheme.textSecondary(context),
                  fontSize: 11,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 4),
              Text(
                message.time,
                style: TextStyle(
                  color: PortalTheme.textMuted(context),
                  fontSize: 8,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isMe) ...[
            CircleAvatar(
              radius: 14,
              backgroundColor: PortalTheme.accentBlue(context).withOpacity(0.2),
              child: Icon(Icons.person, size: 14, color: PortalTheme.accentBlue(context)),
            ),
            SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              decoration: BoxDecoration(
                color: isMe
                    ? PortalTheme.primaryBlue(context)
                    : PortalTheme.cardSurface(context),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                  bottomLeft: Radius.circular(isMe ? 16 : 0),
                  bottomRight: Radius.circular(isMe ? 0 : 16),
                ),
                border: isMe
                    ? null
                    : Border.all(color: PortalTheme.borderLight(context)),
              ),
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.text,
                    style: TextStyle(
                      color: isMe ? Theme.of(context).colorScheme.onPrimary : PortalTheme.textColor(context),
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  SizedBox(height: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        message.time,
                        style: TextStyle(
                          color: isMe ? Theme.of(context).colorScheme.onPrimary.withOpacity(0.7) : PortalTheme.textMuted(context),
                          fontSize: 8,
                        ),
                      ),
                      if (isMe) ...[
                        SizedBox(width: 4),
                        Icon(Icons.done_all, size: 10, color: Theme.of(context).colorScheme.onPrimary.withOpacity(0.7)),
                      ]
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (isMe) SizedBox(width: 28),
        ],
      ),
    );
  }
}
