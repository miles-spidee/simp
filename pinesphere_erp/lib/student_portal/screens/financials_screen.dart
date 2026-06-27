import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/financials_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class FinancialsScreen extends ConsumerStatefulWidget {
  const FinancialsScreen({super.key});

  @override
  ConsumerState<FinancialsScreen> createState() => _FinancialsScreenState();
}

class _FinancialsScreenState extends ConsumerState<FinancialsScreen> {
  final _amountController = TextEditingController(text: "15000");
  final _cardNumberController = TextEditingController();
  final _cardExpiryController = TextEditingController();
  final _cardCVVController = TextEditingController();
  final _cardNameController = TextEditingController();

  String _paymentMethod = 'upi'; // 'upi' | 'card'
  bool _isUpiScanOpen = false;
  int _upiCountdown = 5;
  Timer? _upiTimer;

  @override
  void dispose() {
    _amountController.dispose();
    _cardNumberController.dispose();
    _cardExpiryController.dispose();
    _cardCVVController.dispose();
    _cardNameController.dispose();
    _upiTimer?.cancel();
    super.dispose();
  }

  void _startUpiScanTimer(double amount) {
    setState(() {
      _isUpiScanOpen = true;
      _upiCountdown = 5;
    });
    _upiTimer?.cancel();
    _upiTimer = Timer.periodic(Duration(seconds: 1), (timer) async {
      if (_upiCountdown <= 1) {
        timer.cancel();
        final success = await ref.read(financialsProvider.notifier).payUpi(amount);
        if (!mounted) return;
        setState(() {
          _isUpiScanOpen = false;
        });
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("UPI Payment scanned and cleared successfully!")),
          );
        }
      } else {
        setState(() {
          _upiCountdown--;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(financialsProvider);
    final notifier = ref.read(financialsProvider.notifier);

    // If mock camera scan is active, render it
    if (_isUpiScanOpen) {
      return _buildUpiScannerOverlay();
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("Payments & Invoices"),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Dues Card
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    PortalTheme.primaryBlue(context),
                    PortalTheme.accentBlue(context),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
              ),
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Text(
                    "OUTSTANDING FEE BALANCE",
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    state.fees.total == 0 ? "Free Tier" : "₹${state.fees.balance.toStringAsFixed(0)}",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    state.fees.total == 0 ? "Non-paying Scholarship Grant" : "Next installment due: June 30, 2026",
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.6),
                      fontSize: 11,
                    ),
                  ),
                  SizedBox(height: 16),
                  Divider(color: Colors.white24),
                  SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                       Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("TOTAL INVOICED", style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 8, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text("₹${state.fees.total.toStringAsFixed(0)}", style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text("TOTAL PAID", style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 8, fontWeight: FontWeight.bold)),
                          SizedBox(height: 4),
                          Text("₹${state.fees.paid.toStringAsFixed(0)}", style: TextStyle(color: PortalTheme.successGreen(context), fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),

            // Pay Button / Modal Launcher
            if (state.fees.balance > 0) ...[
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _showPaymentSheet(context, state, notifier),
                      icon: Icon(Icons.payment),
                      label: Text("PAY OUTSTANDING DUES"),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 24),
            ],

            Text(
              "Invoice & Receipt Logs",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),

            // Logs
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: state.paymentHistory.length,
              itemBuilder: (context, idx) {
                final receipt = state.paymentHistory[idx];
                return Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: PortalTheme.borderLight(context)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              receipt.id,
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "Method: ${receipt.method} | ${receipt.date}",
                              style: TextStyle(
                                color: PortalTheme.textMuted(context),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              receipt.amount == 0 ? "Free" : "₹${receipt.amount.toStringAsFixed(0)}",
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              receipt.status,
                              style: TextStyle(
                                color: PortalTheme.successGreen(context),
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpiScannerOverlay() {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.qr_code_scanner, color: PortalTheme.accentBlue(context), size: 100),
            SizedBox(height: 24),
            Text(
              "Simulating UPI QR Scan...",
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Text(
              "Keep the scanner aligned. Auto-confirming in $_upiCountdown seconds.",
              style: TextStyle(color: Colors.white70, fontSize: 12),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 40),
            CircularProgressIndicator(color: PortalTheme.accentBlue(context)),
            SizedBox(height: 24),
            TextButton(
              onPressed: () {
                _upiTimer?.cancel();
                setState(() {
                  _isUpiScanOpen = false;
                });
              },
              child: Text("CANCEL PAYMENT", style: TextStyle(color: PortalTheme.errorRed(context))),
            ),
          ],
        ),
      ),
    );
  }

  void _showPaymentSheet(BuildContext context, FinancialsState state, FinancialsNotifier notifier) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: PortalTheme.cardSurface(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return SingleChildScrollView(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                left: 24,
                right: 24,
                top: 24,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "Initiate Transaction",
                    style: TextStyle(color: PortalTheme.textColor(context), fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),

                  // Amount input
                  Text(
                    "TRANSACTION AMOUNT (INR)",
                    style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 8, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 6),
                  TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: "Enter amount...",
                      prefixText: "₹ ",
                    ),
                  ),
                  SizedBox(height: 16),

                  // Method selector
                  Row(
                    children: [
                      Expanded(
                        child: RadioListTile<String>(
                          value: 'upi',
                          groupValue: _paymentMethod,
                          title: Text("UPI QR Code", style: TextStyle(fontSize: 13)),
                          activeColor: PortalTheme.accentBlue(context),
                          onChanged: (val) => setModalState(() => _paymentMethod = val!),
                        ),
                      ),
                      Expanded(
                        child: RadioListTile<String>(
                          value: 'card',
                          groupValue: _paymentMethod,
                          title: Text("Credit Card", style: TextStyle(fontSize: 13)),
                          activeColor: PortalTheme.accentBlue(context),
                          onChanged: (val) => setModalState(() => _paymentMethod = val!),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),

                  if (_paymentMethod == 'card') ...[
                    // Card Number
                    TextField(
                      controller: _cardNumberController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(hintText: "Card Number (16-digits)", prefixIcon: Icon(Icons.credit_card, size: 16)),
                      style: TextStyle(fontSize: 12),
                    ),
                    SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _cardExpiryController,
                            decoration: InputDecoration(hintText: "Expiry (MM/YY)", prefixIcon: Icon(Icons.date_range, size: 16)),
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _cardCVVController,
                            obscureText: true,
                            decoration: InputDecoration(hintText: "CVV (3-digits)", prefixIcon: Icon(Icons.lock, size: 16)),
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    TextField(
                      controller: _cardNameController,
                      decoration: InputDecoration(hintText: "Name on Card", prefixIcon: Icon(Icons.person, size: 16)),
                      style: TextStyle(fontSize: 12),
                    ),
                    SizedBox(height: 20),
                  ],

                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            final amount = double.tryParse(_amountController.text) ?? 0;
                            if (amount <= 0 || amount > state.fees.balance) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text("Invalid transaction amount.")),
                              );
                              return;
                            }
                            Navigator.pop(context);

                            if (_paymentMethod == 'upi') {
                              _startUpiScanTimer(amount);
                            } else {
                              if (_cardNumberController.text.length < 16 ||
                                  _cardExpiryController.text.length < 5 ||
                                  _cardCVVController.text.length < 3 ||
                                  _cardNameController.text.trim().isEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text("Please fill all card parameters.")),
                                );
                                return;
                              }
                              final scaffoldMessenger = ScaffoldMessenger.of(context);
                              notifier
                                  .payCard(
                                amount: amount,
                                cardNumber: _cardNumberController.text,
                                cardExpiry: _cardExpiryController.text,
                                cardCVV: _cardCVVController.text,
                                cardName: _cardNameController.text,
                              )
                                  .then((success) {
                                scaffoldMessenger.showSnackBar(
                                  SnackBar(content: Text("Credit Card payment processed successfully!")),
                                );
                              });
                            }
                          },
                          child: Text(_paymentMethod == 'upi' ? "LAUNCH UPI SCANNER" : "PROCESS CARD SECURELY"),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
