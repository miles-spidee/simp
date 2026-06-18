import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/lms_model.dart';

class LmsState {
  final List<Course> courses;
  final Course? selectedCourse;
  final int selectedLectureIndex;
  final bool isVideoPlaying;
  final String searchQuery;
  final String categoryFilter; // 'all' | 'Frontend Development' etc.

  LmsState({
    required this.courses,
    this.selectedCourse,
    required this.selectedLectureIndex,
    required this.isVideoPlaying,
    required this.searchQuery,
    required this.categoryFilter,
  });

  LmsState copyWith({
    List<Course>? courses,
    Course? selectedCourse,
    int? selectedLectureIndex,
    bool? isVideoPlaying,
    String? searchQuery,
    String? categoryFilter,
  }) {
    return LmsState(
      courses: courses ?? this.courses,
      selectedCourse: selectedCourse ?? this.selectedCourse,
      selectedLectureIndex: selectedLectureIndex ?? this.selectedLectureIndex,
      isVideoPlaying: isVideoPlaying ?? this.isVideoPlaying,
      searchQuery: searchQuery ?? this.searchQuery,
      categoryFilter: categoryFilter ?? this.categoryFilter,
    );
  }
}

class LmsNotifier extends StateNotifier<LmsState> {
  LmsNotifier()
      : super(
          LmsState(
            searchQuery: '',
            categoryFilter: 'all',
            selectedLectureIndex: 0,
            isVideoPlaying: false,
            courses: [
              Course(
                id: 'react-next',
                title: 'Enterprise React & Next.js Architecture',
                category: 'Frontend Development',
                progress: 66,
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
                lectures: [
                  Lecture(
                    title: 'Module 1: Advanced Hooks and State Machines',
                    duration: '45 mins',
                    completed: true,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4',
                    notes: 'Learn patterns for rendering optimization and handling global states without complex third-party tools.',
                  ),
                  Lecture(
                    title: 'Module 2: Server Components & Hydration Protocol',
                    duration: '52 mins',
                    completed: true,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner2.mp4',
                    notes: 'Server Components are rendered on the server and sent as serializable JSON payload to the client.',
                  ),
                  Lecture(
                    title: 'Module 3: Data Fetching Paradigms & Cache Revalidation',
                    duration: '38 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4',
                    notes: 'Leverage static site generation (SSG), incremental static regeneration (ISR), and data cache controls.',
                  ),
                  Lecture(
                    title: 'Module 4: Enterprise Folder Layout & CI/CD Builds',
                    duration: '60 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner4.mp4',
                    notes: 'Structure complex micro-frontends and deploy via modern serverless platforms like Vercel.',
                  ),
                ],
              ),
              Course(
                id: 'node-sys',
                title: 'Advanced Node.js & Distributed Systems',
                category: 'Backend Architecture',
                progress: 33,
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
                lectures: [
                  Lecture(
                    title: 'Module 1: Event Loop Mechanics & Libuv Threads',
                    duration: '55 mins',
                    completed: true,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner2.mp4',
                    notes: 'Master callbacks, event queues, macroscopic phases of event loop, and multithreaded worker pools.',
                  ),
                  Lecture(
                    title: 'Module 2: RESTful Microservices & Gateway Routing',
                    duration: '48 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4',
                    notes: 'Set up API Gateway services, rate-limiting rules, load balancing, security certificates, and JWT authentications.',
                  ),
                  Lecture(
                    title: 'Module 3: Message Brokers (RabbitMQ & Kafka)',
                    duration: '64 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4',
                    notes: 'Handle asynchronous communication channels, distributed commit logs, partitions, and replication parameters.',
                  ),
                ],
              ),
              Course(
                id: 'cloud-devops',
                title: 'Cloud DevOps & Infrastructure as Code',
                category: 'System Operations',
                progress: 0,
                image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80',
                lectures: [
                  Lecture(
                    title: 'Module 1: Docker Containerization for Node Apps',
                    duration: '40 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner4.mp4',
                    notes: 'Write multi-stage Dockerfiles, minimize container footprint, set up dev volumes, and manage docker-compose dependencies.',
                  ),
                  Lecture(
                    title: 'Module 2: Kubernetes Orchestration & Ingress Services',
                    duration: '72 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner1.mp4',
                    notes: 'Define pods, replicas, load balancers, configuration secrets, network policies, and horizontal autoscaling.',
                  ),
                  Lecture(
                    title: 'Module 3: Terraform provisioning on AWS/GCP',
                    duration: '58 mins',
                    completed: false,
                    videoUrl: 'https://pinesphere.com/static/assets/videos/pines_banner3.mp4',
                    notes: 'Manage state files, write modules, output dynamic configs, and deploy fully isolated Virtual Private Clouds.',
                  ),
                ],
              ),
            ],
          ),
        );

  void selectCourse(Course course) {
    final incompleteIdx = course.lectures.indexWhere((l) => !l.completed);
    state = state.copyWith(
      selectedCourse: course,
      selectedLectureIndex: incompleteIdx >= 0 ? incompleteIdx : 0,
      isVideoPlaying: false,
    );
  }

  void closeWorkspace() {
    state = state.copyWith(
      selectedCourse: null,
      selectedLectureIndex: 0,
      isVideoPlaying: false,
    );
  }

  void selectLecture(int index) {
    state = state.copyWith(
      selectedLectureIndex: index,
      isVideoPlaying: false,
    );
  }

  void setVideoPlaying(bool playing) {
    state = state.copyWith(isVideoPlaying: playing);
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void setCategoryFilter(String category) {
    state = state.copyWith(categoryFilter: category);
  }

  void toggleLectureComplete(String courseId, int lectureIdx) {
    final updatedCourses = state.courses.map((c) {
      if (c.id == courseId) {
        final updatedLectures = c.lectures.asMap().entries.map((entry) {
          final idx = entry.key;
          final lecture = entry.value;
          if (idx == lectureIdx) {
            return lecture.copyWith(completed: !lecture.completed);
          }
          return lecture;
        }).toList();

        final completedCount = updatedLectures.where((l) => l.completed).length;
        final progress = ((completedCount / updatedLectures.length) * 100).round();

        return c.copyWith(
          lectures: updatedLectures,
          progress: progress,
        );
      }
      return c;
    }).toList();

    state = state.copyWith(
      courses: updatedCourses,
      selectedCourse: state.selectedCourse != null
          ? updatedCourses.firstWhere((c) => c.id == state.selectedCourse!.id)
          : null,
    );
  }
}

final lmsProvider = StateNotifierProvider<LmsNotifier, LmsState>((ref) {
  return LmsNotifier();
});
