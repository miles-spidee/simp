class VaultFile {
  final String id;
  final String name;
  final String size;
  final String category;
  final String date;
  final bool verified;
  final bool downloadable;

  VaultFile({
    required this.id,
    required this.name,
    required this.size,
    required this.category,
    required this.date,
    required this.verified,
    required this.downloadable,
  });

  VaultFile copyWith({
    String? id,
    String? name,
    String? size,
    String? category,
    String? date,
    bool? verified,
    bool? downloadable,
  }) {
    return VaultFile(
      id: id ?? this.id,
      name: name ?? this.name,
      size: size ?? this.size,
      category: category ?? this.category,
      date: date ?? this.date,
      verified: verified ?? this.verified,
      downloadable: downloadable ?? this.downloadable,
    );
  }
}

class CertificateInfo {
  final String id;
  final String title;
  final String description;
  final String issueDate;
  final String validationId;
  final String type;

  CertificateInfo({
    required this.id,
    required this.title,
    required this.description,
    required this.issueDate,
    required this.validationId,
    required this.type,
  });
}
