import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/capstone_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';
import 'package:pinesphere_erp/student_portal/widgets/timeline_widget.dart';

class CapstoneScreen extends ConsumerStatefulWidget {
  const CapstoneScreen({super.key});

  @override
  ConsumerState<CapstoneScreen> createState() => _CapstoneScreenState();
}

class _CapstoneScreenState extends ConsumerState<CapstoneScreen> {
  late TextEditingController _repoController;
  late TextEditingController _liveController;
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    final capstone = ref.read(capstoneProvider);
    _repoController = TextEditingController(text: capstone.repoLink);
    _liveController = TextEditingController(text: capstone.liveLink);
  }

  @override
  void dispose() {
    _repoController.dispose();
    _liveController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(capstoneProvider);
    final notifier = ref.read(capstoneProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text("Capstone Project"),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Project title and Mentor
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
                    "CAPSTONE WORKSPACE",
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "AI-Powered ERP Portal Integration System",
                    style: TextStyle(color: PortalTheme.textColor(context), fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 12),
                  Divider(color: PortalTheme.divider(context)),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 18,
                        backgroundColor: PortalTheme.primaryBlue(context).withValues(alpha: 0.2),
                        child: Text("AJ", style: TextStyle(color: PortalTheme.accentBlue(context), fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Mr. Anand Jayavel",
                              style: TextStyle(color: PortalTheme.textColor(context), fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              "Assigned Project Guide",
                              style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          color: state.status == 'Approved'
                              ? PortalTheme.successGreen(context).withValues(alpha: 0.1)
                              : PortalTheme.warningAmber(context).withValues(alpha: 0.1),
                          border: Border.all(
                            color: state.status == 'Approved'
                                ? PortalTheme.successGreen(context)
                                : PortalTheme.warningAmber(context),
                          ),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        child: Text(
                          state.status.toUpperCase(),
                          style: TextStyle(
                            color: state.status == 'Approved'
                                ? PortalTheme.successGreen(context)
                                : PortalTheme.warningAmber(context),
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),

            // Links Form Card
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Workspace Coordinates",
                        style: TextStyle(color: PortalTheme.textColor(context), fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        onPressed: () {
                          if (_isEditing) {
                            notifier.updateLinks(_repoController.text, _liveController.text);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Capstone details updated!")),
                            );
                          }
                          setState(() {
                            _isEditing = !_isEditing;
                          });
                        },
                        icon: Icon(
                          _isEditing ? Icons.save : Icons.edit,
                          color: PortalTheme.accentBlue(context),
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Text(
                    "REPOSITORY URL",
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 9, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 6),
                  TextField(
                    controller: _repoController,
                    enabled: _isEditing,
                    decoration: InputDecoration(
                      hintText: "Enter repo link (e.g. github)...",
                      prefixIcon: Icon(Icons.code, size: 16),
                    ),
                    style: TextStyle(fontSize: 12),
                  ),
                  SizedBox(height: 16),
                  Text(
                    "LIVE DEPLOYMENT PREVIEW",
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 9, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 6),
                  TextField(
                    controller: _liveController,
                    enabled: _isEditing,
                    decoration: InputDecoration(
                      hintText: "Enter staging link (vercel/netlify)...",
                      prefixIcon: Icon(Icons.language, size: 16),
                    ),
                    style: TextStyle(fontSize: 12),
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),

            // Interactive diagnostics Box
            Container(
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white12),
              ),
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                          ),
                          SizedBox(width: 4),
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(color: Colors.amber, shape: BoxShape.circle),
                          ),
                          SizedBox(width: 4),
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(color: Colors.green, shape: BoxShape.circle),
                          ),
                          SizedBox(width: 8),
                          Text(
                            "ERP-Diagnostics-Terminal",
                            style: TextStyle(color: Colors.white60, fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      if (state.isDiagnosticsActive)
                        SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(strokeWidth: 2, color: PortalTheme.accentBlue(context)),
                        )
                      else
                        InkWell(
                          onTap: () => notifier.runDiagnostics(),
                          child: Text(
                            "RUN DIAGNOSTICS",
                            style: TextStyle(color: PortalTheme.accentBlue(context), fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Divider(color: Colors.white12),
                  SizedBox(height: 8),
                  Container(
                    constraints: BoxConstraints(minHeight: 100),
                    width: double.infinity,
                    child: state.diagnosticsLogs.isEmpty
                        ? Text(
                            "\$ erp-build --dry-run\nClick Run Diagnostics to dry-run TSC compile tests.",
                            style: TextStyle(color: Colors.white30, fontFamily: 'monospace', fontSize: 10, height: 1.4),
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: state.diagnosticsLogs.map((log) {
                              return Text(
                                "\$ $log",
                                style: TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 10, height: 1.4),
                              );
                            }).toList(),
                          ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 28),

            Text(
              "Project Milestones",
              style: TextStyle(color: PortalTheme.textColor(context), fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),

            // Milestone roadmap list
            TimelineWidget(
              subtasks: state.subtasks,
              onToggle: (id) => notifier.toggleSubtask(id),
            ),
            SizedBox(height: 12),

            Text(
              "Commit History Evaluation",
              style: TextStyle(color: PortalTheme.textColor(context), fontSize: 16, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),

            // Commits List
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: state.commits.length,
              itemBuilder: (context, idx) {
                final commit = state.commits[idx];
                final hasComment = commit.guideComment.isNotEmpty;

                return Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(12),
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
                              "commit ${commit.commit}",
                              style: TextStyle(
                                color: PortalTheme.accentBlue(context),
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                            Text(
                              commit.date,
                              style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        Text(
                          commit.message,
                          style: TextStyle(color: PortalTheme.textColor(context), fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Author: ${commit.author}",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                        ),
                        if (hasComment) ...[
                          SizedBox(height: 12),
                           Divider(color: PortalTheme.divider(context)),
                          SizedBox(height: 8),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(Icons.comment, color: PortalTheme.warningAmber(context), size: 14),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  commit.guideComment,
                                  style: TextStyle(
                                    color: PortalTheme.warningAmber(context),
                                    fontSize: 10,
                                    height: 1.4,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
