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

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
  onUpdateAdminPassword: (newPassword: string) => void;
  onLoginSuccess: () => void;
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

  // Login State
  const [email, setEmail] = useState('admin@jobsindia.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password Multi-Step State
  // Step 1: Enter email/phone
  // Step 2: Enter OTP
  // Step 3: Enter new password
  // Step 4: Success
  const [resetStep, setResetStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetEmail, setResetEmail] = useState('admin@jobsindia.com');
  const [generatedOtp, setGeneratedOtp] = useState('7894');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setLoginError(null);
      setResetError(null);
      setPassword('');
      setResetStep(1);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email.trim()) {
      setLoginError('Please enter admin email address');
      return;
    }
    if (!password) {
      setLoginError('Please enter the admin password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (password === adminPassword) {
        onLoginSuccess();
        onClose();
      } else {
        setLoginError('Incorrect password! Default password is: ' + adminPassword);
      }
    }, 450);
  };

  // Quick autofill demo password
  const handleUseDemoPassword = () => {
    setPassword(adminPassword);
    setLoginError(null);
  };

  // Step 1: Request OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (!resetEmail.trim()) {
      setResetError('Please enter your admin email or mobile number');
      return;
    }

    setIsLoading(true);
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newCode);

    setTimeout(() => {
      setIsLoading(false);
      setResetStep(2);
    }, 600);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (enteredOtp.trim() !== generatedOtp) {
      setResetError(`Invalid OTP code! Please enter ${generatedOtp}`);
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
              <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 flex items-start gap-2 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            {/* Admin Email Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobsindia.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
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
                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo Password Helper Chip */}
            <div className="bg-[#1E293B]/70 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400">
                <span>Active Password: </span>
                <span className="text-purple-300 font-mono font-bold">{adminPassword}</span>
              </div>
              <button
                type="button"
                onClick={handleUseDemoPassword}
                className="text-[10px] font-bold text-purple-300 hover:text-white bg-purple-600/30 hover:bg-purple-600/50 px-2 py-1 rounded-lg border border-purple-500/40 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Fill</span>
              </button>
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

            {/* STEP 1: Enter Email / Mobile for OTP */}
            {resetStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-slate-300">
                  Enter your registered Super Admin email address to receive an authorization code.
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Sending Security Code...' : 'Send Security OTP'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Admin Login
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="bg-purple-950/60 border border-purple-800/60 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Security OTP sent to:</span>
                    <span className="font-bold text-purple-300 font-mono">{generatedOtp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(generatedOtp)}
                    className="w-full py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-[11px] font-bold text-purple-200 border border-purple-500/40 transition-colors"
                  >
                    Tap to auto-fill OTP ({generatedOtp})
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    Enter 4-Digit Security OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="e.g. 7894"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1E293B] border border-slate-700/80 rounded-xl text-sm font-mono text-center tracking-widest text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Verify OTP Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="hover:text-white"
                  >
                    Change Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newCode);
                    }}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
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
