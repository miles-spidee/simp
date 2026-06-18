import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class AnnouncementCard extends StatelessWidget {
  final String date;
  final String title;
  final String content;

  AnnouncementCard({
    super.key,
    required this.date,
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: PortalTheme.cardSurface(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: PortalTheme.borderLight(context)),
      ),
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                date,
                style: TextStyle(
                  color: PortalTheme.textMuted(context),
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: PortalTheme.primaryBlue(context).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: PortalTheme.primaryBlue(context).withOpacity(0.2)),
                ),
                padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                child: Text(
                  "OFFICIAL",
                  style: TextStyle(
                    color: PortalTheme.accentBlue(context),
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            title,
            style: TextStyle(
              color: PortalTheme.textColor(context),
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          SizedBox(height: 6),
          Text(
            content,
            style: TextStyle(
              color: PortalTheme.textSecondary(context),
              fontSize: 12,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
