"use client";

import React from 'react';
import { X, CreditCard } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function FinancialsPage() {
  const {
    fees,
    paymentHistory,
    isPayModalOpen,
    setIsPayModalOpen,
    payAmountInput,
    setPayAmountInput,
    payMethod,
    setPayMethod,
    cardNumber,
    cardExpiry,
    cardCVV,
    cardName,
    handleCardNumberChange,
    handleCardExpiryChange,
    handleCardCVVChange,
    setCardName,
    isUPIScannerOpen,
    setIsUPIScannerOpen,
    upiTimer,
    handleProcessPayment,
    triggerUPISuccess
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Desk Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Billing Desk</span>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              {fees.total === 0 ? 'Free Internship Account' : 'Fee Summary Invoice'}
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              {fees.total === 0 
                ? 'You are enrolled under the Free Internship (Non-Paying) plan. No fees payments are required.' 
                : 'View outstanding due totals and manage online payments.'}
            </p>
          </div>

          <div className="space-y-3 py-4 border-y border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Total Fee:</span>
              <span className="text-slate-800 font-bold">₹{fees.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Cleared Paid:</span>
              <span className="text-emerald-600 font-bold">₹{fees.paid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Outstanding Balance:</span>
              <span className="text-slate-800 font-bold">₹{fees.balance.toLocaleString()}</span>
            </div>
          </div>

          {fees.total === 0 ? (
            <span className="w-full text-center py-3 border border-blue-100 text-blue-600 bg-blue-50 font-bold text-xs uppercase tracking-wider block">
              Free Internship (No Fees Required)
            </span>
          ) : fees.balance > 0 ? (
            <button
              onClick={() => {
                setPayAmountInput(fees.balance.toString());
                setIsPayModalOpen(true);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider transition-colors"
            >
              Clear Dues (₹{fees.balance.toLocaleString()})
            </button>
          ) : (
            <span className="w-full text-center py-3 border border-emerald-100 text-emerald-600 bg-emerald-50 font-bold text-xs uppercase tracking-wider block">
              Dues Cleared ✓
            </span>
          )}
        </div>

        {/* Online Checkout Form Card */}
        {isPayModalOpen && (
          <div className="bg-white border border-blue-500 rounded-2xl p-6 animate-slide-in relative lg:col-span-2 shadow-lg">
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span>Pinesphere ERP Online Checkout</span>
            </h3>
            <form onSubmit={handleProcessPayment} className="space-y-4 max-w-lg text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    max={fees.balance}
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Option</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-850 focus:outline-none"
                  >
                    <option value="upi">UPI (GPay / PhonePe)</option>
                    <option value="card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {payMethod === 'card' && (
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Harini"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3 space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 px-4 py-2 text-slate-805 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Expiry</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => handleCardExpiryChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 font-mono"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="XXX"
                      value={cardCVV}
                      onChange={(e) => handleCardCVVChange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-slate-805 font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white uppercase tracking-wider transition-colors"
              >
                {payMethod === 'upi' ? 'Scan QR Code & Pay' : 'Process Payment'}
              </button>
            </form>
          </div>
        )}

        {/* UPI QR Overlay Modal */}
        {isUPIScannerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-205 rounded-xl shadow-2xl p-6 w-full max-w-sm animate-slide-in relative text-center text-slate-850">
              <button
                onClick={() => setIsUPIScannerOpen(false)}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                Scan UPI QR Code
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Scan the QR code using GPay, PhonePe, Paytm, or BHIM to pay <strong>₹{parseFloat(payAmountInput).toLocaleString()}</strong>.
              </p>
              
              {/* QR Code Graphic (SVG) */}
              <div className="bg-slate-50 border border-slate-150 p-4 inline-block mx-auto mb-4">
                <svg className="h-44 w-44 mx-auto text-slate-900" viewBox="0 0 100 100">
                  {/* Outer square border blocks */}
                  <path d="M5,5 h20 v20 h-20 z M5,9 h12 v12 h-12 z" fill="currentColor" />
                  <path d="M75,5 h20 v20 h-20 z M75,9 h12 v12 h-12 z" fill="currentColor" />
                  <path d="M5,75 h20 v20 h-20 z M5,79 h12 v12 h-12 z" fill="currentColor" />
                  {/* Some random data pixels simulating QR */}
                  <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="20" width="6" height="6" fill="currentColor" />
                  <rect x="15" y="45" width="10" height="4" fill="currentColor" />
                  <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                  <rect x="70" y="40" width="12" height="6" fill="currentColor" />
                  <rect x="45" y="70" width="8" height="15" fill="currentColor" />
                  <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                  <rect x="10" y="35" width="6" height="6" fill="currentColor" />
                  <rect x="85" y="35" width="8" height="8" fill="currentColor" />
                </svg>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-655 flex items-center justify-center gap-2">
                  <span className="h-2 w-2 bg-blue-600 rounded-full animate-ping" />
                  <span>Awaiting scanner detection... <strong>{upiTimer}s</strong></span>
                </div>
                
                <button
                  type="button"
                  onClick={triggerUPISuccess}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors mt-2 text-center"
                >
                  Simulate Scan Success (Instant Test)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History Log Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 lg:col-span-2 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            Historical Payments Transaction Logs
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 uppercase tracking-widest font-bold">
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Receipt Date</th>
                  <th className="py-2.5 px-4">Paid Amount</th>
                  <th className="py-2.5 px-4">Payment Channel</th>
                  <th className="py-2.5 px-4 text-right">Invoice Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {paymentHistory.map((invoice, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-blue-600">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.date}</td>
                    <td className="py-3 px-4">₹{invoice.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">{invoice.method}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-sm">
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
