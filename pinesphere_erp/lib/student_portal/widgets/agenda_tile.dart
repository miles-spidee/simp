import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class AgendaTile extends StatelessWidget {
  final String task;
  final String time;
  final bool completed;
  final ValueChanged<bool?> onChanged;

  AgendaTile({
    super.key,
    required this.task,
    required this.time,
    required this.completed,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: PortalTheme.cardSurface(context),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: PortalTheme.borderLight(context)),
      ),
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Transform.scale(
            scale: 0.9,
            child: Checkbox(
              value: completed,
              onChanged: onChanged,
              activeColor: PortalTheme.successGreen(context),
              checkColor: Colors.white,
              side: BorderSide(
                color: PortalTheme.textMuted(context).withOpacity(0.5),
                width: 1.5,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              task,
              style: TextStyle(
                color: completed ? PortalTheme.textTertiary(context) : PortalTheme.textColor(context),
                fontSize: 13,
                fontWeight: completed ? FontWeight.normal : FontWeight.w500,
                decoration: completed ? TextDecoration.lineThrough : null,
              ),
            ),
          ),
          SizedBox(width: 8),
          Text(
            time,
            style: TextStyle(
              color: PortalTheme.textMuted(context),
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
