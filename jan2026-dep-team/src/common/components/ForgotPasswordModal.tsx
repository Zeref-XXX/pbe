import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Api from "../helpers/Api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "email" | "otp" | "reset" | "success";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

// ─── Shared Input Style ───────────────────────────────────────────────────────

const inputCls =
  "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

const btnPrimary =
  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

const btnSecondary =
  "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

// ─── Component ────────────────────────────────────────────────────────────────

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, initialEmail = "" }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const resetState = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    setError("");
    setInfo("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail.trim());
    }
  }, [initialEmail, isOpen]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      await Api.post("/auth/forgot-password", { email: email.trim() });
      setInfo("An OTP has been sent to your email (if it is registered).");
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await Api.post("/auth/verify-otp", { email: email.trim(), otp: otp.trim() });
      setResetToken(res.data.resetToken);
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await Api.post("/auth/reset-password", { resetToken, newPassword });
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password. Please start over.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────

  const handleResendOtp = async () => {
    setError("");
    setOtp("");
    setLoading(true);
    try {
      await Api.post("/auth/forgot-password", { email: email.trim() });
      setInfo("A new OTP has been sent to your email.");
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step Labels ───────────────────────────────────────────────────────────

  const stepTitles: Record<Step, string> = {
    email: "Forgot your password?",
    otp: "Enter verification code",
    reset: "Set a new password",
    success: "Password reset successful",
  };

  const stepSubtitles: Record<Step, string> = {
    email: "Enter your registered email address and we'll send you a one-time code.",
    otp: `We sent a 6-digit code to ${email}. It expires in 10 minutes.`,
    reset: "Choose a strong new password for your account.",
    success: "Your password has been updated. You can now log in with your new password.",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-xl p-6 sm:p-8">
                {/* Header */}
                <Dialog.Title className="text-xl font-bold text-gray-900 mb-1">
                  {stepTitles[step]}
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-5">{stepSubtitles[step]}</p>

                {/* Error / Info banners */}
                {error && (
                  <div className="mb-4 rounded border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {info && !error && (
                  <div className="mb-4 rounded border border-green-400 bg-green-50 px-3 py-2 text-sm text-green-700">
                    {info}
                  </div>
                )}

                {/* ── Step: Email ── */}
                {step === "email" && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        id="fp-email"
                        type="email"
                        autoComplete="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputCls}
                      />
                    </div>
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? "Sending…" : "Send OTP"}
                    </button>
                    <button type="button" onClick={handleClose} className={btnSecondary}>
                      Cancel
                    </button>
                  </form>
                )}

                {/* ── Step: OTP ── */}
                {step === "otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label htmlFor="fp-otp" className="block text-sm font-medium text-gray-700 mb-1">
                        One-time code
                      </label>
                      <input
                        id="fp-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        className={`${inputCls} tracking-widest text-center text-lg`}
                      />
                    </div>
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? "Verifying…" : "Verify code"}
                    </button>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => { setStep("email"); setError(""); setOtp(""); }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Change email
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Step: Reset password ── */}
                {step === "reset" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="fp-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New password
                      </label>
                      <input
                        id="fp-new-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="fp-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm new password
                      </label>
                      <input
                        id="fp-confirm-password"
                        type="password"
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={inputCls}
                      />
                    </div>
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? "Resetting…" : "Reset password"}
                    </button>
                  </form>
                )}

                {/* ── Step: Success ── */}
                {step === "success" && (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <button onClick={handleClose} className={btnPrimary}>
                      Back to Login
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ForgotPasswordModal;
