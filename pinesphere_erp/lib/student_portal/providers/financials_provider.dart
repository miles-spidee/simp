import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/financial_model.dart';
import 'package:pinesphere_erp/student_portal/services/mock_payment_service.dart';

class FinancialsState {
  final FinancialFees fees;
  final List<PaymentReceipt> paymentHistory;
  final bool isProcessing;

  FinancialsState({
    required this.fees,
    required this.paymentHistory,
    this.isProcessing = false,
  });

  FinancialsState copyWith({
    FinancialFees? fees,
    List<PaymentReceipt>? paymentHistory,
    bool? isProcessing,
  }) {
    return FinancialsState(
      fees: fees ?? this.fees,
      paymentHistory: paymentHistory ?? this.paymentHistory,
      isProcessing: isProcessing ?? this.isProcessing,
    );
  }
}

class FinancialsNotifier extends StateNotifier<FinancialsState> {
  FinancialsNotifier()
      : super(
          FinancialsState(
            fees: FinancialFees(total: 30000, paid: 15000, balance: 15000),
            paymentHistory: [
              PaymentReceipt(
                id: 'INV-2026-001',
                date: '2026-05-10',
                amount: 15000,
                method: 'Credit Card',
                status: 'Cleared',
              ),
            ],
          ),
        );

  void setFreeTier() {
    state = state.copyWith(
      fees: FinancialFees(total: 0, paid: 0, balance: 0),
      paymentHistory: [
        PaymentReceipt(
          id: 'ALC-2026-FREE',
          date: '2026-05-01',
          amount: 0,
          method: 'System Grant',
          status: 'Free Internship',
        ),
      ],
    );
  }

  void setPaidTier() {
    state = state.copyWith(
      fees: FinancialFees(total: 30000, paid: 15000, balance: 15000),
      paymentHistory: [
        PaymentReceipt(
          id: 'INV-2026-001',
          date: '2026-05-10',
          amount: 15000,
          method: 'Credit Card',
          status: 'Cleared',
        ),
      ],
    );
  }

  Future<bool> payCard({
    required double amount,
    required String cardNumber,
    required String cardExpiry,
    required String cardCVV,
    required String cardName,
  }) async {
    if (amount <= 0 || amount > state.fees.balance) return false;
    state = state.copyWith(isProcessing: true);

    try {
      final receipt = await MockPaymentService.processCardPayment(
        amount: amount,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        cardCVV: cardCVV,
        cardName: cardName,
      );

      state = state.copyWith(
        fees: state.fees.copyWith(
          paid: state.fees.paid + amount,
          balance: state.fees.balance - amount,
        ),
        paymentHistory: [receipt, ...state.paymentHistory],
        isProcessing: false,
      );
      return true;
    } catch (_) {
      state = state.copyWith(isProcessing: false);
      return false;
    }
  }

  Future<bool> payUpi(double amount) async {
    if (amount <= 0 || amount > state.fees.balance) return false;
    state = state.copyWith(isProcessing: true);

    try {
      final receipt = await MockPaymentService.processUpiPayment(amount);
      state = state.copyWith(
        fees: state.fees.copyWith(
          paid: state.fees.paid + amount,
          balance: state.fees.balance - amount,
        ),
        paymentHistory: [receipt, ...state.paymentHistory],
        isProcessing: false,
      );
      return true;
    } catch (_) {
      state = state.copyWith(isProcessing: false);
      return false;
    }
  }
}

final financialsProvider = StateNotifierProvider<FinancialsNotifier, FinancialsState>((ref) {
  return FinancialsNotifier();
});
