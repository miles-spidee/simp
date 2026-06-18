"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/src/config';
import Toast, { ToastType } from '../../components/ui/toast';

// Reusable SVG Icon Components
const LockIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const KeyIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 8a3 3 0 11-6 0 3 3 0 016 0zm6.5-6.5L20 6m-2.5 2.5L14 11m-1.5-1.5L11 11" />
  </svg>
);

const ShieldCheckIcon = ({ className = "h-12 w-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const WarningIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ArrowBackIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SuccessCheckIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

type FlowStep = 'ENTER_USERNAME' | 'ENTER_OTP' | 'RESET_PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<FlowStep>('ENTER_USERNAME');
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastConfig, setToastConfig] = useState<{ show: boolean, title: string, message: string, type: ToastType }>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showToast = (title: string, message: string, type: ToastType) => {
    setToastConfig({ show: true, title, message, type });
    setTimeout(() => {
      setToastConfig(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // OTP Countdown Timer (2:00 minutes = 120 seconds)
  const [timerCount, setTimerCount] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step !== 'ENTER_OTP' || timerCount <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timerCount]);

  const handleResendOtp = () => {
    setTimerCount(120);
    setCanResend(false);
    setOtp("");
    showToast("OTP Resent", "A new verification code has been sent to your email.", "info");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-redirect to login after successful reset
  useEffect(() => {
    if (step === 'SUCCESS') {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputVal = username.trim();
    if (inputVal.length >= 3) {
      try {
        const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD_REQUEST, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: inputVal })
        });
        
        if (!response.ok) {
          throw new Error('Failed to request OTP');
        }
        
        setTimerCount(120);
        setCanResend(false);
        setStep('ENTER_OTP');
      } catch (err) {
        console.error(err);
        showToast("Error", "Error requesting OTP. Please try again.", "error");
      }
    } else {
      showToast("Invalid Input", "Please enter a valid username (at least 3 characters).", "warning");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timerCount <= 0) {
      showToast("Expired OTP", "This OTP has expired. Please click 'Resend OTP' to get a new code.", "error");
      return;
    }

    if (/^\d{6}$/.test(otp.trim())) {
      try {
        const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD_VERIFY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), otp: otp.trim() })
        });

        if (!response.ok) {
          throw new Error('Invalid OTP verification code');
        }

        setStep('RESET_PASSWORD');
      } catch (err) {
        console.error(err);
        showToast("Verification Failed", "Invalid OTP verification code. Please try again.", "error");
      }
    } else {
      showToast("Invalid Input", "Invalid OTP verification code. Please enter a valid 6-digit OTP.", "warning");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      showToast("Invalid Password", "Password must be at least 6 characters.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Mismatch", "Passwords do not match. Please verify passwords.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD_RESET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), otp: otp.trim(), newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setStep('SUCCESS');
      showToast("Success", "Password reset successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Reset Failed", "Failed to reset password. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans justify-between text-slate-800">
      <div>
        {/* Navigation Header */}
        <header className="h-20 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-10 w-auto object-contain transition-transform hover:scale-[1.02]" />
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <ArrowBackIcon className="h-4 w-4" /> Return to Homepage
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center p-4 py-20 animate-slide-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200 text-center">
            
            {/* Header Visual Icon based on flow step */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
              {step === 'ENTER_USERNAME' && <UserIcon className="h-6 w-6 text-blue-600" />}
              {step === 'ENTER_OTP' && <KeyIcon className="h-6 w-6 text-blue-600" />}
              {step === 'RESET_PASSWORD' && <LockIcon className="h-6 w-6 text-blue-600" />}
              {step === 'SUCCESS' && <ShieldCheckIcon className="h-6 w-6 text-blue-600" />}
            </div>

            {/* STEP 1: ENTER USERNAME */}
            {step === 'ENTER_USERNAME' && (
              <>
                <h2 className="mb-2 text-2xl font-bold text-slate-900 tracking-tight">Reset your password</h2>
                <p className="mb-8 text-xs text-slate-550 leading-relaxed">
                  Enter your username associated with the candidate account to receive your OTP reset key.
                </p>

                <form onSubmit={handleUsernameSubmit} className="text-left space-y-5">
                  <div>
                    <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">Username</label>
                    <input 
                      type="text" 
                      id="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-xl border border-slate-350 px-4 py-3.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all" 
                      placeholder="E.g. admin" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    Receive OTP Code →
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: ENTER OTP */}
            {step === 'ENTER_OTP' && (
              <>
                <h2 className="mb-2 text-2xl font-bold text-slate-900 tracking-tight">OTP Verification</h2>
                <p className="mb-6 text-xs text-slate-555 leading-relaxed">
                  A verification code has been dispatched to your email for username <strong className="text-blue-600">{username}</strong>.
                </p>

                <form onSubmit={handleOtpSubmit} className="text-left space-y-5">
                  <div>
                    <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-wider text-slate-555 mb-2">Enter 6-Digit OTP *</label>
                    <input 
                      type="text" 
                      id="otp"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full rounded-xl border border-slate-350 px-4 py-3.5 text-sm tracking-[0.5em] text-center font-bold focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-300 text-slate-800 transition-all" 
                      placeholder="••••••" 
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5 pb-1">
                    <span>
                      {timerCount > 0 ? (
                        <span>OTP expires in <strong className="text-slate-700 font-bold">{formatTime(timerCount)}</strong></span>
                      ) : (
                        <span className="text-rose-500 font-bold">OTP expired</span>
                      )}
                    </span>
                    
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="font-bold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        Resend OTP in {formatTime(timerCount)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setStep('ENTER_USERNAME')}
                      className="w-1/3 rounded-xl border border-slate-300 hover:bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-600 transition-all active:scale-[0.98]"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="w-2/3 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                      Verify OTP ✓
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 'RESET_PASSWORD' && (
              <>
                <h2 className="mb-2 text-2xl font-bold text-slate-900 tracking-tight">Set New Password</h2>
                <p className="mb-8 text-xs text-slate-555 leading-relaxed">
                  Verify your account access and enter a new password below.
                </p>

                <form onSubmit={handlePasswordSubmit} className="text-left space-y-5">
                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-555 mb-2">New Password *</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-350 px-4 py-3.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all" 
                      placeholder="••••••••" 
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-555 mb-2">Confirm New Password *</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-350 px-4 py-3.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all" 
                      placeholder="••••••••" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Updating Password..." : "Reset Password ✓"}
                  </button>
                </form>
              </>
            )}

            {/* STEP 4: SUCCESS REDIRECT */}
            {step === 'SUCCESS' && (
              <div className="space-y-4 animate-slide-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600 mb-6 shadow-sm">
                  <SuccessCheckIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Password Updated!</h2>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  Your password has been successfully reset. We are redirecting you back to the log-in page.
                </p>
                <div className="pt-4 flex items-center justify-center gap-2 text-xs font-bold text-blue-600">
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Redirecting...</span>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6">
              <Link href="/login" className="text-xs font-bold text-blue-600 hover:text-blue-500 flex justify-center items-center gap-1.5 transition-colors">
                <ArrowBackIcon className="h-3.5 w-3.5" /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-150 bg-white py-6 px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-slate-450">
        <div>© 2026 PINESPHERE ENTERPRISE. BUILT FOR SCALE.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-blue-650 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-blue-650 transition-colors">TERMS</Link>
          <Link href="#" className="hover:text-blue-650 transition-colors">SUPPORT</Link>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastConfig.show && (
        <Toast 
          title={toastConfig.title}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(prev => ({ ...prev, show: false }))} 
        />
      )}
    </div>
  );
}

// User Profile SVG Icon helper
const UserIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);