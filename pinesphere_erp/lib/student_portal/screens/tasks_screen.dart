import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/task_model.dart';
import 'package:pinesphere_erp/student_portal/providers/tasks_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class TasksScreen extends ConsumerWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(tasksProvider);
    final notifier = ref.read(tasksProvider.notifier);

    // Filter tasks based on selected tab
    final filteredTasks = state.tasks.where((task) {
      if (state.activeFilter == 'all') return true;
      if (state.activeFilter == 'pending') return task.status == 'pending';
      if (state.activeFilter == 'review') return task.status == 'review';
      if (state.activeFilter == 'completed') return task.status == 'completed';
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text("Assignments Kanban"),
      ),
      body: Column(
        children: [
          // Filter Tabs Bar
          Container(
            color: PortalTheme.backgroundSlate(context),
            padding: EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildFilterButton(context, "All", "all", state.activeFilter, notifier),
                _buildFilterButton(context, "Pending", "pending", state.activeFilter, notifier),
                _buildFilterButton(context, "In Review", "review", state.activeFilter, notifier),
                _buildFilterButton(context, "Completed", "completed", state.activeFilter, notifier),
              ],
            ),
          ),
          Divider(color: PortalTheme.divider(context), height: 1),

          Expanded(
            child: filteredTasks.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle_outline, color: PortalTheme.textMuted(context).withValues(alpha: 0.5), size: 48),
                        SizedBox(height: 12),
                        Text(
                          "No assignments in this column",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 13),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: EdgeInsets.only(left: 16.0, right: 16.0, top: 16.0, bottom: 100.0),
                    itemCount: filteredTasks.length,
                    itemBuilder: (context, index) {
                      final task = filteredTasks[index];
                      return _buildTaskCard(context, task, notifier);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButton(
    BuildContext context,
    String label,
    String filterValue,
    String activeFilter,
    TasksNotifier notifier,
  ) {
    final isActive = activeFilter == filterValue;
    return InkWell(
      onTap: () => notifier.setFilter(filterValue),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: isActive ? PortalTheme.primaryBlue(context) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? Theme.of(context).colorScheme.onPrimary : PortalTheme.textMuted(context),
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  Widget _buildTaskCard(BuildContext context, TaskItem task, TasksNotifier notifier) {
    Color statusBorderColor = PortalTheme.textMuted(context);
    if (task.status == 'pending') {
      statusBorderColor = task.isOverdue ? PortalTheme.errorRed(context) : PortalTheme.warningAmber(context);
    } else if (task.status == 'review') {
      statusBorderColor = PortalTheme.accentBlue(context);
    } else if (task.status == 'completed') {
      statusBorderColor = PortalTheme.successGreen(context);
    }

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(color: statusBorderColor, width: 4),
          ),
        ),
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: PortalTheme.borderLight(context),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  child: Text(
                    task.category,
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 8, fontWeight: FontWeight.bold),
                  ),
                ),
                Text(
                  task.status.toUpperCase(),
                  style: TextStyle(
                    color: statusBorderColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: 10),
            Text(
                task.title,
                style: TextStyle(
                  color: PortalTheme.textColor(context),
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            SizedBox(height: 6),
            Text(
              "Assigned by: ${task.assignedBy}",
              style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 11),
            ),
            SizedBox(height: 4),
            Text(
              "Due: ${task.dueDate}",
              style: TextStyle(
                color: task.isOverdue ? PortalTheme.errorRed(context) : PortalTheme.textMuted(context),
                fontSize: 11,
                fontWeight: task.isOverdue ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            if (task.alert != null) ...[
              SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: PortalTheme.errorRed(context).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: PortalTheme.errorRed(context).withValues(alpha: 0.2)),
                ),
                padding: EdgeInsets.all(10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.error_outline, color: PortalTheme.errorRed(context), size: 14),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        task.alert!,
                        style: TextStyle(
                          color: PortalTheme.errorRed(context),
                          fontSize: 10,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            SizedBox(height: 16),
            Divider(color: PortalTheme.divider(context), height: 1),
            SizedBox(height: 12),

            // Submit action buttons
            if (task.status == 'pending') ...[
              if (task.submissionFile == null)
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {
                        // Simulate file pick
                        final fileName = task.id == 'PS-2026-W3'
                            ? 'frame_selection_script.zip'
                            : 'deliverables.zip';
                        notifier.selectFile(task.id, fileName);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Selected file: $fileName")),
                        );
                      },
                      icon: Icon(Icons.attach_file, size: 14),
                      label: Text("Simulate Browse"),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                    ),
                  ],
                )
              else
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.03),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: PortalTheme.divider(context)),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        child: Row(
                          children: [
                            Icon(Icons.insert_drive_file, color: PortalTheme.accentBlue(context), size: 14),
                            SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                task.submissionFile!,
                                style: TextStyle(color: PortalTheme.textColor(context), fontSize: 11, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            IconButton(
                              onPressed: () => notifier.removeFile(task.id),
                              icon: Icon(Icons.cancel, size: 14, color: PortalTheme.textSecondary(context)),
                              padding: EdgeInsets.zero,
                              constraints: BoxConstraints(),
                            ),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () {
                        notifier.submitTask(task.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text("Deliverables submitted for guide evaluation.")),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: PortalTheme.successGreen(context),
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      child: Text("Upload"),
                    ),
                  ],
                ),
            ] else if (task.status == 'review') ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Icon(Icons.hourglass_empty, color: PortalTheme.accentBlue(context), size: 14),
                  SizedBox(width: 6),
                  Text(
                    "Submitted - Under Evaluation",
                    style: TextStyle(
                      color: PortalTheme.accentBlue(context),
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ] else if (task.status == 'completed') ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Icon(Icons.check_circle_outline, color: PortalTheme.successGreen(context), size: 14),
                  SizedBox(width: 6),
                  Text(
                    "Completed & Verified",
                    style: TextStyle(
                      color: PortalTheme.successGreen(context),
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
