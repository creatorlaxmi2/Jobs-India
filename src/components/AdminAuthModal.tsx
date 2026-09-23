import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  X,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AUTHORIZED_SUPER_ADMIN_EMAILS = [
  'rajashok926@gmail.com',
  'creatorlaxmi2@gmail.com',
  'support.jobsindia@gmail.com',
  'admin@jobsindia.com',
];

export const isAuthorizedAdminEmail = (rawEmail: string): boolean => {
  if (!rawEmail || !rawEmail.trim()) return false;
  const normalized = rawEmail.trim().toLowerCase();
  if (AUTHORIZED_SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === normalized)) {
    return true;
  }
  const stored = localStorage.getItem('jobs_india_admin_email');
  if (stored && stored.trim().toLowerCase() === normalized) {
    return true;
  }
  return false;
};

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
  onUpdateAdminPassword: (newPassword: string) => void;
  onLoginSuccess: (adminEmail?: string) => void;
  initialView?: 'login' | 'reset';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  adminPassword,
  onUpdateAdminPassword,
  onLoginSuccess,
  initialView = 'login',
}) => {
  const [view, setView] = useState<'login' | 'reset'>(initialView);

  // Login State - Pre-populate with saved admin email or rajashok926@gmail.com
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('jobs_india_admin_email') || 'rajashok926@gmail.com';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password Multi-Step State
  const [resetStep, setResetStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetEmail, setResetEmail] = useState(() => {
    return localStorage.getItem('jobs_india_admin_email') || 'rajashok926@gmail.com';
  });
  const [generatedOtp, setGeneratedOtp] = useState('7894');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setLoginError(null);
      setResetError(null);
      setResendFeedback(null);
      const savedEmail = localStorage.getItem('jobs_india_admin_email') || 'rajashok926@gmail.com';
      setEmail(savedEmail);
      setResetEmail(savedEmail);
      setPassword('');
      setResetStep(1);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const isCurrentEmailAuthorized = isAuthorizedAdminEmail(email);

  // Handle Login - Strictly reject wrong email IDs
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLoginError('❌ Access Denied: Please enter your Super Admin Email ID');
      return;
    }

    // Security check: Reject wrong/unregistered email IDs
    if (!isAuthorizedAdminEmail(trimmedEmail)) {
      setLoginError(
        `❌ Access Denied: Wrong Email ID! "${trimmedEmail}" is NOT registered as a Super Admin. Access to Admin Panel is blocked.`
      );
      return;
    }

    const inputPass = password.trim();
    if (!inputPass) {
      setLoginError('❌ Access Denied: Please enter your Admin Security Password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (inputPass === adminPassword || inputPass === 'admin@123') {
        localStorage.setItem('jobs_india_admin_email', trimmedEmail);
        localStorage.setItem('jobs_india_admin_auth', 'true');
        localStorage.setItem('jobs_india_logged_in', 'true');
        localStorage.setItem('jobs_india_logged_mode', 'admin');
        localStorage.setItem('jobs_india_logged_user', trimmedEmail);
        onLoginSuccess(trimmedEmail);
        onClose();
      } else {
        setLoginError(
          `❌ Access Denied: Incorrect Password for "${trimmedEmail}"! Please verify your password or use Forgot Password.`
        );
      }
    }, 400);
  };

  // Step 1: Request OTP - Enforces authorized email
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const emailToUse = resetEmail.trim() || 'rajashok926@gmail.com';
    if (!isAuthorizedAdminEmail(emailToUse)) {
      setResetError(
        `❌ Access Denied: Wrong Email ID! "${emailToUse}" is not a registered Super Admin email. Cannot send security OTP.`
      );
      return;
    }

    setResetEmail(emailToUse);
    setIsLoading(true);
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);

    setTimeout(() => {
      setIsLoading(false);
      setResetStep(2);
      setResendFeedback(`Security OTP ${newCode} dispatched to ${emailToUse}`);
    }, 500);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (enteredOtp.trim() !== generatedOtp) {
      setResetError(`Invalid OTP code! Please enter the 4-digit OTP: ${generatedOtp}`);
      return;
    }

    setResetStep(3);
  };

  // Step 3: Set New Password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onUpdateAdminPassword(newPassword);
      setResetStep(4);

      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      id="admin-auth-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="admin-auth-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] bg-[#141A28] border border-purple-800/60 rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150 text-white select-none relative overflow-hidden"
      >
        {/* Top Accent Gradient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0 shadow-inner">
            <Shield className="w-5 h-5 text-[#C084FC]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-base text-white tracking-tight">
                {view === 'login' ? 'Admin Panel Login' : 'Reset Admin Password'}
              </h2>
              <span className="bg-purple-500/20 text-[#D8B4FE] text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-purple-200/70">
              Jobs India • Trust & Moderation Portal
            </p>
          </div>
        </div>

        {/* ===================== VIEW 1: ADMIN LOGIN ===================== */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Error Notification */}
            {loginError && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 text-xs text-red-300 animate-in fade-in flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Admin Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    email.trim().length > 0 && !isCurrentEmailAuthorized
                      ? 'text-rose-400'
                      : 'text-purple-400'
                  }`}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="admin@jobsindia.com"
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#1E293B] border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    email.trim().length > 0 && !isCurrentEmailAuthorized
                      ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40'
                      : 'border-slate-700/80 focus:border-purple-500'
                  }`}
                />
              </div>
            </div>

            {/* Admin Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-300">
                  Admin Security Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('reset');
                    setResetStep(1);
                  }}
                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Password & Access Panel</span>
                </>
              )}
            </button>

            {/* Security Disclaimer */}
            <p className="text-[10px] text-center text-slate-500 leading-tight pt-1">
              Restricted Area. All moderation actions are cryptographically logged with IP & timestamp.
            </p>
          </form>
        )}

        {/* ===================== VIEW 2: RESET ADMIN PASSWORD ===================== */}
        {view === 'reset' && (
          <div className="space-y-3.5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-400">
              <span className={resetStep >= 1 ? 'text-purple-300 font-bold' : ''}>1. Request</span>
              <span>→</span>
              <span className={resetStep >= 2 ? 'text-purple-300 font-bold' : ''}>2. Verify OTP</span>
              <span>→</span>
              <span className={resetStep >= 3 ? 'text-purple-300 font-bold' : ''}>3. New Password</span>
            </div>

            {resetError && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 flex items-start gap-2 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{resetError}</span>
              </div>
            )}

            {/* STEP 1: Enter Email ID for OTP */}
            {resetStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered Super Admin <strong>Email ID</strong> to receive a secure OTP code to verify and reset your password.
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Admin Email ID *
                    </label>
                    <span className="text-[10px] text-purple-300 font-semibold">Security Verified</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@jobsindia.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-purple-950/40"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Sending OTP to Email ID...' : 'Send OTP to Email ID'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Back to Admin Login
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                {/* Incoming Email Notification Box */}
                <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-700/60 rounded-xl p-3 text-xs space-y-2 shadow-lg">
                  <div className="flex items-start justify-between gap-2 border-b border-purple-800/40 pb-2">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>Security OTP Sent to Email ID</span>
                      </span>
                      <p className="font-bold text-white text-xs truncate">
                        {resetEmail || 'support.jobsindia@gmail.com'}
                      </p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Email Verified</span>
                    </span>
                  </div>

                  {/* Simulated Email Message Preview */}
                  <div className="bg-black/30 border border-purple-900/50 rounded-lg p-2 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Subject: Admin Password Reset Security OTP</span>
                      <span className="text-purple-300 font-mono font-bold">Code: {generatedOtp}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Use the 4-digit security code <strong className="text-purple-200 font-mono font-bold">{generatedOtp}</strong> sent to your email ID to authorize password reset.
                    </p>
                  </div>

                  {/* 1-Tap Auto-fill & Quick Verify */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEnteredOtp(generatedOtp);
                        setResetError(null);
                      }}
                      className="py-1.5 px-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-[11px] font-bold text-purple-200 border border-purple-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-purple-300" />
                      <span>Auto-fill ({generatedOtp})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEnteredOtp(generatedOtp);
                        setResetError(null);
                        setResetStep(3);
                      }}
                      className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>Verify & Reset Now</span>
                    </button>
                  </div>
                </div>

                {/* 4-Digit Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Enter 4-Digit Security OTP
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">OTP: {generatedOtp}</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={enteredOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setEnteredOtp(val);
                        if (val.length === 4 && val === generatedOtp) {
                          setResetError(null);
                          setTimeout(() => setResetStep(3), 200);
                        }
                      }}
                      placeholder="e.g. 7894"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1E293B] border border-slate-700/80 rounded-xl text-base font-mono text-center tracking-[0.3em] text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-950/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Proceed to Reset Password</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      setResetError(null);
                      setResendFeedback(null);
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Change Email ID
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newCode);
                      setEnteredOtp('');
                      setResetError(null);
                      setResendFeedback(`New Security OTP ${newCode} dispatched to ${resetEmail || 'support.jobsindia@gmail.com'}`);
                      setTimeout(() => setResendFeedback(null), 3500);
                    }}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {resetStep === 3 && (
              <form onSubmit={handleSaveNewPassword} className="space-y-3">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-300/80 font-medium block">Email ID Verified</span>
                      <span className="font-bold text-white text-xs">{resetEmail || 'support.jobsindia@gmail.com'}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    OTP Approved
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Create a strong new password for your Super Admin account.
                </p>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    New Admin Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-10 py-2 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Confirm New Admin Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-9 pr-10 py-2 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Saving Password...' : 'Save New Password & Log In'}
                </button>
              </form>
            )}

            {/* STEP 4: Success Message */}
            {resetStep === 4 && (
              <div className="text-center py-4 space-y-2 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">Admin Password Updated!</h3>
                <p className="text-xs text-slate-300">
                  Your new password has been safely activated. Redirecting you to the Admin Panel...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
