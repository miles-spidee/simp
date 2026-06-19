class Lecture {
  final String title;
  final String duration;
  final bool completed;
  final String videoUrl;
  final String notes;

  Lecture({
    required this.title,
    required this.duration,
    required this.completed,
    required this.videoUrl,
    required this.notes,
  });

  Lecture copyWith({
    String? title,
    String? duration,
    bool? completed,
    String? videoUrl,
    String? notes,
  }) {
    return Lecture(
      title: title ?? this.title,
      duration: duration ?? this.duration,
      completed: completed ?? this.completed,
      videoUrl: videoUrl ?? this.videoUrl,
      notes: notes ?? this.notes,
    );
  }
}

class Course {
  final String id;
  final String title;
  final String category;
  final int progress;
  final String image;
  final List<Lecture> lectures;

  Course({
    required this.id,
    required this.title,
    required this.category,
    required this.progress,
    required this.image,
    required this.lectures,
  });

  Course copyWith({
    String? id,
    String? title,
    String? category,
    int? progress,
    String? image,
    List<Lecture>? lectures,
  }) {
    return Course(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      progress: progress ?? this.progress,
      image: image ?? this.image,
      lectures: lectures ?? this.lectures,
    );
  }
}
