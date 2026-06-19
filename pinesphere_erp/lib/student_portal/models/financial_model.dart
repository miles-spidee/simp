class PaymentReceipt {
  final String id;
  final String date;
  final double amount;
  final String method;
  final String status;

  PaymentReceipt({
    required this.id,
    required this.date,
    required this.amount,
    required this.method,
    required this.status,
  });
}

class FinancialFees {
  final double total;
  final double paid;
  final double balance;

  FinancialFees({
    required this.total,
    required this.paid,
    required this.balance,
  });

  FinancialFees copyWith({
    double? total,
    double? paid,
    double? balance,
  }) {
    return FinancialFees(
      total: total ?? this.total,
      paid: paid ?? this.paid,
      balance: balance ?? this.balance,
    );
  }
}
