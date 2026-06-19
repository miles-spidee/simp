import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/models/capstone_model.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class TimelineWidget extends StatelessWidget {
  final List<CapstoneSubtask> subtasks;
  final ValueChanged<int> onToggle;

  TimelineWidget({
    super.key,
    required this.subtasks,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    // Group subtasks by Phase
    final phases = <int, List<CapstoneSubtask>>{};
    for (var task in subtasks) {
      phases.putIfAbsent(task.phase, () => []).add(task);
    }

    final sortedPhases = phases.keys.toList()..sort();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: sortedPhases.map((phase) {
        final phaseTasks = phases[phase]!;
        final phaseProgress = phaseTasks.where((t) => t.completed).length / phaseTasks.length;
        final phaseDone = phaseProgress == 1.0;

        return Padding(
          padding: EdgeInsets.only(bottom: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: phaseDone
                          ? PortalTheme.successGreen(context).withOpacity(0.1)
                          : PortalTheme.primaryBlue(context).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: phaseDone ? PortalTheme.successGreen(context) : PortalTheme.accentBlue(context),
                      ),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Text(
                      "PHASE $phase",
                      style: TextStyle(
                        color: phaseDone ? PortalTheme.successGreen(context) : PortalTheme.accentBlue(context),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(2),
                      child: LinearProgressIndicator(
                        value: phaseProgress,
                        minHeight: 4,
                        backgroundColor: PortalTheme.borderLight(context),
                        valueColor: AlwaysStoppedAnimation<Color>(
                          phaseDone ? PortalTheme.successGreen(context) : PortalTheme.accentBlue(context),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Text(
                    "${(phaseProgress * 100).round()}%",
                    style: TextStyle(
                      color: PortalTheme.textSecondary(context),
                      fontWeight: FontWeight.bold,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: phaseTasks.length,
                itemBuilder: (context, idx) {
                  final task = phaseTasks[idx];
                  return Padding(
                    padding: EdgeInsets.symmetric(vertical: 4),
                    child: InkWell(
                      onTap: () => onToggle(task.id),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: Theme.of(context).brightness == Brightness.dark
                              ? Colors.white.withOpacity(0.02)
                              : Colors.black.withOpacity(0.02),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: PortalTheme.borderLight(context)),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              task.completed ? Icons.check_circle : Icons.radio_button_unchecked,
                              color: task.completed
                                  ? PortalTheme.successGreen(context)
                                  : PortalTheme.textMuted(context),
                              size: 18,
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                task.task,
                                style: TextStyle(
                                  color: task.completed ? PortalTheme.textTertiary(context) : PortalTheme.textSecondary(context),
                                  fontSize: 12,
                                  decoration: task.completed ? TextDecoration.lineThrough : null,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
