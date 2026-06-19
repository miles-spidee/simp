import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/documents_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/widgets/certificate_viewer.dart';

class DocumentsScreen extends ConsumerStatefulWidget {
  DocumentsScreen({super.key});

  @override
  ConsumerState<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends ConsumerState<DocumentsScreen> {
  final _uploadNameController = TextEditingController();
  String _uploadCategory = 'Academics';

  @override
  void dispose() {
    _uploadNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(documentsProvider);
    final notifier = ref.read(documentsProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text("Credentials & Vault"),
      ),
      body: DefaultTabController(
        length: 2,
        child: Column(
          children: [
            TabBar(
              indicatorColor: PortalTheme.accentBlue(context),
              labelColor: PortalTheme.textColor(context),
              unselectedLabelColor: PortalTheme.textMuted(context),
              tabs: [
                Tab(text: "Documents Vault"),
                Tab(text: "Issued Certificates"),
              ],
            ),
            Divider(color: PortalTheme.divider(context), height: 1),
            Expanded(
              child: TabBarView(
                children: [
                  // Documents Vault View
                  _buildVaultView(context, state, notifier),

                  // Certificates View
                  _buildCertificatesView(context, state),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVaultView(BuildContext context, DocumentsState state, DocumentsNotifier notifier) {
    return ListView(
      padding: EdgeInsets.all(16),
      children: [
        // Upload Action Card
        Container(
          decoration: BoxDecoration(
            color: PortalTheme.cardSurface(context),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: PortalTheme.borderLight(context)),
          ),
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Upload New Credential",
                style: TextStyle(color: PortalTheme.textColor(context), fontSize: 14, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 12),
              Text(
                "DOCUMENT FILE NAME",
                style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 8, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 6),
              TextField(
                controller: _uploadNameController,
                decoration: InputDecoration(
                  hintText: "Enter document title (e.g. NOC_Anna_Univ)...",
                  prefixIcon: Icon(Icons.description, size: 16),
                ),
                style: TextStyle(fontSize: 12),
              ),
              SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("CATEGORY", style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 9, fontWeight: FontWeight.bold)),
                  DropdownButton<String>(
                    value: _uploadCategory,
                    dropdownColor: PortalTheme.cardSurface(context),
                    underline: Container(),
                    style: TextStyle(color: PortalTheme.textColor(context), fontSize: 12, fontWeight: FontWeight.bold),
                    items: <String>['Academics', 'Personal', 'Official Documents']
                        .map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          _uploadCategory = newValue;
                        });
                      }
                    },
                  ),
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        if (_uploadNameController.text.trim().isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Please enter a valid document file name.")),
                          );
                          return;
                        }
                        notifier.uploadDocument(_uploadNameController.text, _uploadCategory);
                        _uploadNameController.clear();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Document uploaded. Verification pending!")),
                        );
                      },
                      icon: Icon(Icons.cloud_upload, size: 16),
                      label: Text("SIMULATE UPLOAD PDF"),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        SizedBox(height: 24),

        Text(
          "Verified Records Vault",
          style: TextStyle(color: PortalTheme.textColor(context), fontSize: 15, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),

        // Files List
        ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: state.vaultFiles.length,
          itemBuilder: (context, idx) {
            final file = state.vaultFiles[idx];

            return Padding(
              padding: EdgeInsets.only(bottom: 10),
              child: Container(
                decoration: BoxDecoration(
                  color: PortalTheme.cardSurface(context),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: PortalTheme.borderLight(context)),
                ),
                padding: EdgeInsets.all(14),
                child: Row(
                  children: [
                    Icon(Icons.picture_as_pdf, color: PortalTheme.errorRed(context), size: 28),
                    SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            file.name,
                            style: TextStyle(color: PortalTheme.textColor(context), fontWeight: FontWeight.bold, fontSize: 13),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 4),
                          Text(
                            "${file.category} | ${file.size}",
                            style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: file.verified
                                ? PortalTheme.successGreen(context).withOpacity(0.1)
                                : PortalTheme.warningAmber(context).withOpacity(0.1),
                            border: Border.all(
                              color: file.verified ? PortalTheme.successGreen(context) : PortalTheme.warningAmber(context),
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          child: Text(
                            file.verified ? "VERIFIED" : "PENDING",
                            style: TextStyle(
                              color: file.verified ? PortalTheme.successGreen(context) : PortalTheme.warningAmber(context),
                              fontSize: 8,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        SizedBox(height: 6),
                        if (file.downloadable)
                          GestureDetector(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text("Downloading ${file.name}...")),
                              );
                            },
                            child: Text(
                              "DOWNLOAD",
                              style: TextStyle(
                                color: PortalTheme.accentBlue(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 9,
                                letterSpacing: 0.5,
                              ),
                            ),
                          )
                        else
                          Text(
                            file.date,
                            style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 9),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildCertificatesView(BuildContext context, DocumentsState state) {
    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: state.certificates.length,
      itemBuilder: (context, idx) {
        final cert = state.certificates[idx];

        return Card(
          margin: EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        color: PortalTheme.accentBlue(context).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: PortalTheme.accentBlue(context).withOpacity(0.2)),
                      ),
                      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      child: Text(
                        cert.type.toUpperCase(),
                        style: TextStyle(color: PortalTheme.accentBlue(context), fontSize: 8, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Icon(Icons.workspace_premium, color: PortalTheme.warningAmber(context), size: 20),
                  ],
                ),
                SizedBox(height: 12),
                Text(
                  cert.title,
                  style: TextStyle(color: PortalTheme.textColor(context), fontWeight: FontWeight.bold, fontSize: 15),
                ),
                SizedBox(height: 6),
                Text(
                   cert.description,
                  style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 12, height: 1.4),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 16),
                 Divider(color: PortalTheme.divider(context)),
                SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Issue Date: ${cert.issueDate}",
                      style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                    ),
                    TextButton(
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => CertificateViewer(certificate: cert),
                        );
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        "PREVIEW CLAIM",
                        style: TextStyle(
                          color: PortalTheme.accentBlue(context),
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
