import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/lms_model.dart';
import 'package:pinesphere_erp/student_portal/providers/lms_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class LMSScreen extends ConsumerWidget {
  LMSScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(lmsProvider);
    final notifier = ref.read(lmsProvider.notifier);

    // If a course is selected, show its learning workspace view
    if (state.selectedCourse != null) {
      return _buildWorkspaceView(context, state, notifier);
    }

    // Filter courses by search query and category
    final filteredCourses = state.courses.where((course) {
      final matchesSearch = course.title.toLowerCase().contains(state.searchQuery.toLowerCase());
      final matchesCategory = state.categoryFilter == 'all' || course.category == state.categoryFilter;
      return matchesSearch && matchesCategory;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text("Learning Pathways (LMS)"),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              onChanged: (val) => notifier.setSearchQuery(val),
              decoration: InputDecoration(
                hintText: "Search course credentials...",
                prefixIcon: Icon(Icons.search, color: PortalTheme.textMuted(context)),
                fillColor: PortalTheme.cardSurface(context),
                filled: true,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Category Filters horizontal slider
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.symmetric(horizontal: 12),
              children: [
                _buildCategoryPill(context, "All Tracks", "all", state.categoryFilter, notifier),
                _buildCategoryPill(context, "Frontend", "Frontend Development", state.categoryFilter, notifier),
                _buildCategoryPill(context, "Backend", "Backend Architecture", state.categoryFilter, notifier),
                _buildCategoryPill(context, "System Ops", "System Operations", state.categoryFilter, notifier),
              ],
            ),
          ),
          SizedBox(height: 8),
          Divider(color: PortalTheme.divider(context), height: 1),

          // Course Catalog Cards
          Expanded(
            child: filteredCourses.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.video_library_outlined, color: PortalTheme.textMuted(context).withOpacity(0.5), size: 48),
                        SizedBox(height: 12),
                        Text(
                          "No learning pathways found",
                          style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 13),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: EdgeInsets.all(16),
                    itemCount: filteredCourses.length,
                    itemBuilder: (context, index) {
                      final course = filteredCourses[index];
                      return _buildCourseCard(context, course, notifier);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryPill(
    BuildContext context,
    String label,
    String filterValue,
    String activeFilter,
    LmsNotifier notifier,
  ) {
    final isActive = activeFilter == filterValue;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      child: InkWell(
        onTap: () => notifier.setCategoryFilter(filterValue),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? PortalTheme.accentBlue(context) : PortalTheme.cardSurface(context),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: PortalTheme.borderLight(context)),
          ),
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? Theme.of(context).colorScheme.onSecondary : PortalTheme.textMuted(context),
              fontWeight: FontWeight.bold,
              fontSize: 11,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCourseCard(BuildContext context, Course course, LmsNotifier notifier) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => notifier.selectCourse(course),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course Image Mock
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(course.image),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.6), Colors.transparent],
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                  ),
                ),
                padding: EdgeInsets.all(12),
                alignment: Alignment.bottomLeft,
                child: Container(
                  decoration: BoxDecoration(
                    color: PortalTheme.accentBlue(context),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  child: Text(
                    course.category.toUpperCase(),
                    style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),

            // Course Info
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    course.title,
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    "${course.lectures.length} lecture modules",
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 11),
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: course.progress / 100,
                            minHeight: 4,
                            backgroundColor: PortalTheme.borderLight(context),
                            valueColor: AlwaysStoppedAnimation<Color>(PortalTheme.accentBlue(context)),
                          ),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        "${course.progress}%",
                        style: TextStyle(
                          color: PortalTheme.accentBlue(context),
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkspaceView(BuildContext context, LmsState state, LmsNotifier notifier) {
    final course = state.selectedCourse!;
    final lecture = course.lectures[state.selectedLectureIndex];

    return Scaffold(
      appBar: AppBar(
        title: Text(course.title),
        leading: IconButton(
          onPressed: () => notifier.closeWorkspace(),
          icon: Icon(Icons.arrow_back),
        ),
      ),
      body: Column(
        children: [
          // Video Player simulation box
          Container(
            height: 200,
            color: Colors.black,
            alignment: Alignment.center,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Mock background grid
                Container(
                  color: PortalTheme.cardSurface(context),
                  child: Center(
                    child: Icon(Icons.play_circle_fill, color: PortalTheme.divider(context), size: 80),
                  ),
                ),
                // Overlay controls
                Positioned.fill(
                  child: Container(
                    color: Colors.black38,
                    padding: EdgeInsets.all(16),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          child: Text(
                            "Module ${state.selectedLectureIndex + 1}: ${lecture.title}",
                            style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            IconButton(
                              onPressed: () => notifier.setVideoPlaying(!state.isVideoPlaying),
                              iconSize: 48,
                              icon: Icon(
                                state.isVideoPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                                color: PortalTheme.accentBlue(context),
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              state.isVideoPlaying ? "Playing: ${lecture.duration}" : "Paused",
                              style: TextStyle(color: Colors.white70, fontSize: 10, fontFamily: 'monospace'),
                            ),
                            Icon(Icons.fullscreen, color: Colors.white, size: 16),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Course Syllabus and Notes tabs
          Expanded(
            child: DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  TabBar(
                    indicatorColor: PortalTheme.accentBlue(context),
                    labelColor: PortalTheme.textColor(context),
                    unselectedLabelColor: PortalTheme.textMuted(context),
                    tabs: [
                      Tab(text: "Syllabus Browser"),
                      Tab(text: "Lecture Study Notes"),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Syllabus List View
                        ListView.builder(
                          padding: EdgeInsets.all(16),
                          itemCount: course.lectures.length,
                          itemBuilder: (context, idx) {
                            final lec = course.lectures[idx];
                            final isCurrent = idx == state.selectedLectureIndex;

                            return Padding(
                              padding: EdgeInsets.only(bottom: 8),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: isCurrent
                                      ? PortalTheme.primaryBlue(context).withOpacity(0.1)
                                      : PortalTheme.cardSurface(context),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isCurrent ? PortalTheme.accentBlue(context) : PortalTheme.borderLight(context),
                                  ),
                                ),
                                child: ListTile(
                                  dense: true,
                                  onTap: () => notifier.selectLecture(idx),
                                  leading: Checkbox(
                                    value: lec.completed,
                                    activeColor: PortalTheme.successGreen(context),
                                    onChanged: (_) {
                                      notifier.toggleLectureComplete(course.id, idx);
                                    },
                                  ),
                                  title: Text(
                                    lec.title,
                                    style: TextStyle(
                                      color: PortalTheme.textColor(context),
                                      fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                                    ),
                                  ),
                                  subtitle: Text(
                                    "Duration: ${lec.duration}",
                                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),

                        // Lecture notes View
                        SingleChildScrollView(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                lecture.title,
                                style: TextStyle(color: PortalTheme.textColor(context), fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              SizedBox(height: 12),
                              Container(
                                decoration: BoxDecoration(
                                  color: PortalTheme.cardSurface(context),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: PortalTheme.borderLight(context)),
                                ),
                                padding: EdgeInsets.all(16),
                                width: double.infinity,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "RESOURCES & CORE SUMMARY",
                                      style: TextStyle(
                                        color: PortalTheme.textMuted(context),
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                    SizedBox(height: 12),
                                    Text(
                                      lecture.notes,
                                      style: TextStyle(
                                        color: PortalTheme.textSecondary(context),
                                        fontSize: 13,
                                        height: 1.6,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 24),
                              Row(
                                children: [
                                  Expanded(
                                    child: OutlinedButton.icon(
                                      onPressed: () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text("Lecture notes downloaded as PDF.")),
                                        );
                                      },
                                      icon: Icon(Icons.download, size: 14),
                                      label: Text("Download Notes PDF"),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
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
}
