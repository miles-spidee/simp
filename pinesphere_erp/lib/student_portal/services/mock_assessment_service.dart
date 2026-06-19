import 'package:pinesphere_erp/student_portal/models/assessment_model.dart';

class MockAssessmentService {
  static List<ExamQuestion> getQuestions() {
    return [
      ExamQuestion(
        id: 1,
        question: "Which of the following is a primary characteristic of React Server Components (RSC)?",
        options: [
          "They execute only on the client-side to improve web performance.",
          "They reduce client-side bundle size by staying on the server.",
          "They use useState and useEffect hooks extensively during server render.",
          "They completely eliminate the need for any client-side JavaScript."
        ],
        correctAnswer: "They reduce client-side bundle size by staying on the server.",
      ),
      ExamQuestion(
        id: 2,
        question: "How does the Next.js App Router perform dynamic rendering revalidations?",
        options: [
          "By querying the database directly on every user action.",
          "Through Time-based or Demand-based revalidation (revalidatePath / revalidateTag).",
          "By refreshing the entire browser frame automatically every 60 seconds.",
          "It is not possible to revalidate cached pages dynamically."
        ],
        correctAnswer: "Through Time-based or Demand-based revalidation (revalidatePath / revalidateTag).",
      ),
      ExamQuestion(
        id: 3,
        question: "What is the purpose of the 'Libuv' library in the Node.js architecture?",
        options: [
          "To compile modern ES6 Javascript files into readable machine code.",
          "To manage multi-threaded input/output event loop execution pools.",
          "To serve as an embedded lightweight database system.",
          "To provide a standard HTTP router layout interface."
        ],
        correctAnswer: "To manage multi-threaded input/output event loop execution pools.",
      ),
      ExamQuestion(
        id: 4,
        question: "In standard database design, what does a CASCADE DELETE constraint do?",
        options: [
          "Blocks the deletion of any rows referenced by key definitions.",
          "Automatically deletes child rows when a referenced parent row is deleted.",
          "Encrypts delete statements automatically in the transaction log.",
          "Speeds up delete queries by disabling indexes."
        ],
        correctAnswer: "Automatically deletes child rows when a referenced parent row is deleted.",
      ),
    ];
  }
}
