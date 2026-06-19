import 'dart:async';
import 'package:pinesphere_erp/student_portal/models/financial_model.dart';

class MockPaymentService {
  static Future<PaymentReceipt> processCardPayment({
    required double amount,
    required String cardNumber,
    required String cardExpiry,
    required String cardCVV,
    required String cardName,
  }) async {
    await Future.delayed(Duration(milliseconds: 1500));
    final now = DateTime.now();
    final dateStr = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";

    return PaymentReceipt(
      id: "INV-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
      date: dateStr,
      amount: amount,
      method: "Credit Card",
      status: "Cleared",
    );
  }

  static Future<PaymentReceipt> processUpiPayment(double amount) async {
    await Future.delayed(Duration(seconds: 2));
    final now = DateTime.now();
    final dateStr = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";

    return PaymentReceipt(
      id: "INV-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
      date: dateStr,
      amount: amount,
      method: "UPI Pay",
      status: "Cleared",
    );
  }
}
