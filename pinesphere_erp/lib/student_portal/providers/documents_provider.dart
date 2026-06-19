import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/document_model.dart';

class DocumentsState {
  final List<VaultFile> vaultFiles;
  final List<CertificateInfo> certificates;

  DocumentsState({
    required this.vaultFiles,
    required this.certificates,
  });

  DocumentsState copyWith({
    List<VaultFile>? vaultFiles,
    List<CertificateInfo>? certificates,
  }) {
    return DocumentsState(
      vaultFiles: vaultFiles ?? this.vaultFiles,
      certificates: certificates ?? this.certificates,
    );
  }
}

class DocumentsNotifier extends StateNotifier<DocumentsState> {
  DocumentsNotifier()
      : super(
          DocumentsState(
            vaultFiles: [
              VaultFile(id: 'doc1', name: 'Official_Offer_Letter.pdf', size: '1.2 MB', category: 'Official Documents', date: '2026-05-01', verified: true, downloadable: true),
              VaultFile(id: 'doc2', name: 'Pinesphere_ERP_NDA_Signed.pdf', size: '2.4 MB', category: 'Official Documents', date: '2026-05-02', verified: true, downloadable: true),
              VaultFile(id: 'doc3', name: 'College_NOC_Verification.pdf', size: '1.8 MB', category: 'Academics', date: '2026-05-05', verified: true, downloadable: false),
              VaultFile(id: 'doc4', name: 'Identity_Proof_Aadhaar.pdf', size: '840 KB', category: 'Personal', date: '2026-05-05', verified: true, downloadable: false),
            ],
            certificates: [
              CertificateInfo(
                id: 'cert1',
                title: 'Pinesphere React Specialist Certificate',
                description: 'Awarded for mastery of Enterprise React & Next.js Architecture, Server Components, and client-side performance optimizations.',
                issueDate: 'June 16, 2026',
                validationId: 'PS-RSC-2026-9812',
                type: 'Technical Achievement',
              ),
              CertificateInfo(
                id: 'cert2',
                title: 'Agile Scrum Practitioner Certificate',
                description: 'Awarded for demonstrating excellence in scrum workflows, Kanban tasks, and sprint delivery protocols.',
                issueDate: 'May 30, 2026',
                validationId: 'PS-ASP-2026-4401',
                type: 'Project Management',
              ),
            ],
          ),
        );

  void uploadDocument(String name, String category) {
    final cleanName = name.trim().endsWith('.pdf') ? name.trim() : "${name.trim()}.pdf";
    final now = DateTime.now();
    final dateStr = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";

    final newDoc = VaultFile(
      id: "doc-${DateTime.now().millisecondsSinceEpoch}",
      name: cleanName,
      size: '1.5 MB',
      category: category,
      date: dateStr,
      verified: false,
      downloadable: false,
    );

    state = state.copyWith(
      vaultFiles: [newDoc, ...state.vaultFiles],
    );
  }
}

final documentsProvider = StateNotifierProvider<DocumentsNotifier, DocumentsState>((ref) {
  return DocumentsNotifier();
});
