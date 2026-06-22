import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/models/document_model.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class CertificateViewer extends StatelessWidget {
  final CertificateInfo certificate;

  const CertificateViewer({
    super.key,
    required this.certificate,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        decoration: BoxDecoration(
          color: PortalTheme.cardSurface(context),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: PortalTheme.borderLight(context)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.3),
              blurRadius: 24,
              offset: Offset(0, 8),
            ),
          ],
        ),
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Align(
              alignment: Alignment.topRight,
              child: IconButton(
                onPressed: () => Navigator.pop(context),
                icon: Icon(Icons.close, color: PortalTheme.textSecondary(context)),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: PortalTheme.accentBlue(context).withValues(alpha: 0.3), width: 2),
                borderRadius: BorderRadius.circular(16),
                color: PortalTheme.backgroundSlate(context),
              ),
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              width: double.infinity,
              child: Column(
                children: [
                  Icon(
                    Icons.workspace_premium,
                    color: PortalTheme.accentBlue(context),
                    size: 48,
                  ),
                  SizedBox(height: 16),
                  Text(
                    "PINESPHERE ENTERPRISE",
                    style: TextStyle(
                      color: PortalTheme.textMuted(context),
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                    ),
                  ),
                  SizedBox(height: 8),
                  Divider(color: PortalTheme.divider(context), indent: 40, endIndent: 40),
                  SizedBox(height: 16),
                  Text(
                    "CERTIFICATE OF COMPLETION",
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 12),
                  Text(
                    "PROUDLY PRESENTED TO",
                    style: TextStyle(
                      color: PortalTheme.textMuted(context),
                      fontSize: 8,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "Harini S",
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    certificate.description,
                    style: TextStyle(
                      color: PortalTheme.textSecondary(context),
                      fontSize: 11,
                      height: 1.6,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 24),
                  Divider(color: PortalTheme.divider(context)),
                  SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "DATE OF ISSUE",
                            style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 8, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 4),
                          Text(
                            certificate.issueDate,
                            style: TextStyle(color: PortalTheme.textColor(context), fontSize: 10, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            "VALIDATION ID",
                            style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 8, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 4),
                          Text(
                            certificate.validationId,
                            style: TextStyle(color: PortalTheme.accentBlue(context), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("Certificate PDF downloaded to device.")),
                      );
                    },
                    icon: Icon(Icons.download, size: 16),
                    label: Text("Download PDF"),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
