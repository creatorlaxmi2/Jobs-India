import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  Globe,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Shield,
  AlertCircle,
  Check,
  Phone,
} from 'lucide-react';
import { AppMode } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  adminPassword?: string;
  onOpenAdminResetPassword?: () => void;
  onLoginSuccess: (
    mode: AppMode,
    userName: string,
    details?: {
      email?: string;
      phone?: string;
      companyName?: string;
      designation?: string;
      city?: string;
    }
  ) => void;
}

const INDIAN_CITIES = [
  'Delhi NCR',
  'Patna, Bihar',
  'Bengaluru, Karnataka',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Hyderabad, Telangana',
  'Kolkata, West Bengal',
  'Chennai, Tamil Nadu',
  'Lucknow, Uttar Pradesh',
  'Jaipur, Rajasthan',
  'Ahmedabad, Gujarat',
  'Chandigarh',
  'Indore, Madhya Pradesh',
  'Ranchi, Jharkhand',
];

const INDUSTRIES = [
  'Healthcare & Hospital',
  'IT, Software & Tech',
  'Retail, Store & Sales',
  'Logistics, Delivery & Warehouse',
  'Banking, Finance & Insurance',
  'Education & Coaching',
  'Manufacturing & Production',
  'Hospitality, Hotel & Restaurant',
  'Security & Facility Management',
  'Customer Support & BPO',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signup',
  adminPassword,
  onOpenAdminResetPassword,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [accountType, setAccountType] = useState<'job-seeker' | 'employer' | 'admin'>('job-seeker');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Job Seeker Signup Fields
  const [seekerFullName, setSeekerFullName] = useState('');
  const [seekerEmail, setSeekerEmail] = useState('');
  const [seekerPassword, setSeekerPassword] = useState('');
  const [seekerConfirmPassword, setSeekerConfirmPassword] = useState('');
  const [seekerMobile, setSeekerMobile] = useState('');
  const [seekerCity, setSeekerCity] = useState('Delhi NCR');

  // Employer / HR Full Details Signup Fields
  const [empFullName, setEmpFullName] = useState('');
  const [empWorkEmail, setEmpWorkEmail] = useState('');
  const [empCompanyName, setEmpCompanyName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empConfirmPassword, setEmpConfirmPassword] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empCity, setEmpCity] = useState('Delhi NCR');
  const [empIndustry, setEmpIndustry] = useState('Healthcare & Hospital');
  const [empWebsiteOrGst, setEmpWebsiteOrGst] = useState('');
  const [empHiringNeed, setEmpHiringNeed] = useState<'1-5' | '5-20' | '20+'>('1-5');

  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error & Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ mode: AppMode; name: string } | null>(null);

  // Synchronize initial tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Handle Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (accountType === 'job-seeker') {
      if (!seekerFullName.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (!seekerEmail.trim() || !seekerEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
      if (seekerPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long');
        return;
      }
      if (seekerPassword !== seekerConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSuccessInfo({ mode: 'job-seeker', name: seekerFullName.trim() });

        setTimeout(() => {
          onLoginSuccess('job-seeker', seekerFullName.trim(), {
            email: seekerEmail.trim(),
            phone: seekerMobile ? `+91 ${seekerMobile}` : undefined,
            city: seekerCity,
          });
          onClose();
        }, 1200);
      }, 700);
    } else {
      // Employer / HR validation
      if (!empFullName.trim()) {
        setErrorMessage('Please enter HR contact person full name');
        return;
      }
      if (!empWorkEmail.trim() || !empWorkEmail.includes('@')) {
        setErrorMessage('Please enter a valid official work email');
        return;
      }
      if (!empCompanyName.trim()) {
        setErrorMessage('Please enter your company or organization name');
        return;
      }
      if (!empDesignation.trim()) {
        setErrorMessage('Please enter your designation (e.g. HR Manager)');
        return;
      }
      if (empPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long');
        return;
      }
      if (empPassword !== empConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      if (!empMobile.trim()) {
        setErrorMessage('Please enter a 10-digit mobile number for candidate verification');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSuccessInfo({
          mode: 'employer',
          name: `${empFullName.trim()} (${empCompanyName.trim()})`,
        });

        setTimeout(() => {
          onLoginSuccess('employer', empFullName.trim(), {
            email: empWorkEmail.trim(),
            phone: `+91 ${empMobile}`,
            companyName: empCompanyName.trim(),
            designation: empDesignation.trim(),
            city: empCity,
          });
          onClose();
        }, 1200);
      }, 700);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmailOrPhone.trim()) {
      setErrorMessage('Please enter your registered email or mobile number');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    // Admin security validation
    if (accountType === 'admin' && adminPassword && loginPassword !== adminPassword) {
      setErrorMessage(`Incorrect Admin Password! (Default: ${adminPassword}). Click "Forgot password?" to reset.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const resolvedName =
        accountType === 'employer'
          ? 'HR Manager (Apollo Diagnostics)'
          : accountType === 'admin'
          ? 'Super Admin Moderator'
          : loginEmailOrPhone.includes('@')
          ? loginEmailOrPhone.split('@')[0]
          : 'Rahul Sharma';

      setSuccessInfo({ mode: accountType, name: resolvedName });

      setTimeout(() => {
        onLoginSuccess(accountType, resolvedName, {
          email: loginEmailOrPhone.includes('@') ? loginEmailOrPhone : undefined,
          phone: !loginEmailOrPhone.includes('@') ? loginEmailOrPhone : undefined,
        });
        onClose();
      }, 1100);
    }, 600);
  };

  // 1-Click Demo Login
  const handleDemoQuickLogin = (role: AppMode) => {
    setAccountType(role);
    setIsSuccess(true);
    const demoName =
      role === 'employer'
        ? 'Pooja Verma (Apollo HR)'
        : role === 'admin'
        ? 'Admin Moderator'
        : 'Rahul Sharma (Job Seeker)';

    setSuccessInfo({ mode: role, name: demoName });

    setTimeout(() => {
      onLoginSuccess(role, demoName);
      onClose();
    }, 900);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] bg-[#0F172A] border border-slate-700/70 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 relative my-auto animate-in zoom-in-95 duration-150 select-none"
      >
        {/* Top Header matching exact screenshot */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Green Circular Badge with "JH" */}
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-[#064E3B] font-extrabold text-sm shadow-md flex-shrink-0">
              JH
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                {tab === 'signup'
                  ? 'Sign Up with Email & Password'
                  : 'Log In to Jobs Help Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {tab === 'signup'
                  ? 'Free account creation for Jobs Help'
                  : 'Welcome back! Access your verified job portal'}
              </p>
            </div>
          </div>

          <button
            id="auth-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Screen */}
        {isSuccess && successInfo ? (
          <div className="py-10 text-center space-y-3.5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {tab === 'signup' ? 'Account Created Successfully!' : 'Welcome Back!'}
            </h3>
            <p className="text-sm text-slate-300 font-medium">
              Signed in as <span className="text-[#10B981] font-bold">{successInfo.name}</span>
            </p>
            <p className="text-xs text-slate-400">
              Redirecting to {successInfo.mode === 'employer' ? 'Employer / HR Recruiter Portal' : successInfo.mode === 'admin' ? 'Admin Moderation Panel' : 'Job Seeker Dashboard'}...
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Segmented Control Pills (Log In vs ✨ Sign Up (Email)) */}
            <div className="bg-[#1E293B] p-1 rounded-2xl flex items-center gap-1 border border-slate-700/60">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                  tab === 'login'
                    ? 'bg-[#10B981] text-[#042F2E] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => {
                  setTab('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'signup'
                    ? 'bg-[#10B981] text-[#042F2E] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#042F2E]" />
                <span>Sign Up (Email)</span>
              </button>
            </div>

            {/* Choose Account Type Section */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Choose Account Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Job Seeker Card */}
                <button
                  type="button"
                  id="choose-role-job-seeker"
                  onClick={() => {
                    setAccountType('job-seeker');
                    setErrorMessage(null);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    accountType === 'job-seeker'
                      ? 'border-[#10B981] bg-[#064E3B]/25 ring-1 ring-[#10B981] text-white shadow-xs'
                      : 'border-slate-800 bg-[#1E293B]/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      accountType === 'job-seeker'
                        ? 'bg-[#10B981]/25 text-[#10B981]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <User className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs sm:text-sm text-white truncate">
                      Job Seeker
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Search & apply
                    </div>
                  </div>
                </button>

                {/* Employer Card */}
                <button
                  type="button"
                  id="choose-role-employer"
                  onClick={() => {
                    setAccountType('employer');
                    setErrorMessage(null);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    accountType === 'employer'
                      ? 'border-[#F59E0B] bg-[#78350F]/25 ring-1 ring-[#F59E0B] text-white shadow-xs'
                      : 'border-slate-800 bg-[#1E293B]/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      accountType === 'employer'
                        ? 'bg-[#F59E0B]/25 text-[#F59E0B]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-xs sm:text-sm text-white truncate">
                      Employer
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Post & hire
                    </div>
                  </div>
                </button>
              </div>

              {/* Admin quick toggle for moderators */}
              {tab === 'login' && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAccountType('admin')}
                    className={`text-[11px] font-bold transition-colors flex items-center gap-1 ${
                      accountType === 'admin'
                        ? 'text-[#C084FC] underline'
                        : 'text-slate-500 hover:text-purple-300'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-[#A855F7]" />
                    <span>Admin Login Portal</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                id="auth-error-banner"
                className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 flex items-start gap-2.5 text-red-300 text-xs animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIGN UP FORM */}
            {tab === 'signup' ? (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {accountType === 'job-seeker' ? (
                  /* ================= JOB SEEKER SIGNUP FIELDS ================= */
                  <>
                    {/* Full Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="seeker-fullname-input"
                          value={seekerFullName}
                          onChange={(e) => setSeekerFullName(e.target.value)}
                          placeholder="e.g., Rahul Sharma"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                      </div>
                    </div>

                    {/* Email ID * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email ID *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="seeker-email-input"
                          value={seekerEmail}
                          onChange={(e) => setSeekerEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                      </div>
                    </div>

                    {/* Create Password * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Create Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="seeker-password-input"
                          value={seekerPassword}
                          onChange={(e) => setSeekerPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="seeker-confirm-password-input"
                          value={seekerConfirmPassword}
                          onChange={(e) => setSeekerConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Mobile Number (Optional for WhatsApp updates) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Mobile Number (Optional for WhatsApp updates)
                      </label>
                      <div className="flex rounded-2xl bg-[#1E293B]/90 border border-slate-700/80 overflow-hidden focus-within:border-[#10B981] focus-within:ring-1 focus-within:ring-[#10B981]">
                        <div className="px-3.5 py-2.5 bg-slate-800/80 text-slate-300 text-xs font-bold border-r border-slate-700/80 flex items-center gap-1.5">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          id="seeker-mobile-input"
                          value={seekerMobile}
                          onChange={(e) =>
                            setSeekerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          placeholder="10-digit mobile number"
                          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Preferred City */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Preferred City
                      </label>
                      <div className="relative">
                        <select
                          id="seeker-city-select"
                          value={seekerCity}
                          onChange={(e) => setSeekerCity(e.target.value)}
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-sm text-white appearance-none focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                        >
                          {INDIAN_CITIES.map((city) => (
                            <option key={city} value={city} className="bg-[#0F172A] text-white">
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* ================= EMPLOYER / HR FULL DETAILS SIGNUP ================= */
                  <>
                    <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-2.5 text-xs text-[#FDE68A] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                      <span>
                        Employer & Recruiter Verification. Post jobs and connect with candidates directly.
                      </span>
                    </div>

                    {/* HR Contact Person * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name / HR Contact Person *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="emp-fullname-input"
                          value={empFullName}
                          onChange={(e) => setEmpFullName(e.target.value)}
                          placeholder="e.g., Pooja Sharma / Dr. Verma"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                        />
                      </div>
                    </div>

                    {/* Company / Organization Name * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Organization Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="emp-company-name-input"
                          value={empCompanyName}
                          onChange={(e) => setEmpCompanyName(e.target.value)}
                          placeholder="e.g., Apollo Hospitals Patna / Tech Solutions Pvt Ltd"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                        />
                      </div>
                    </div>

                    {/* Designation / Role * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        HR Designation / Role *
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="emp-designation-input"
                          value={empDesignation}
                          onChange={(e) => setEmpDesignation(e.target.value)}
                          placeholder="e.g., Senior HR Manager / Talent Acquisition Head"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                        />
                      </div>
                    </div>

                    {/* Official Work Email ID * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Official Work Email ID *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="emp-email-input"
                          value={empWorkEmail}
                          onChange={(e) => setEmpWorkEmail(e.target.value)}
                          placeholder="hr@company.com or recruiter@enterprise.com"
                          required
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all"
                        />
                      </div>
                    </div>

                    {/* Mobile / Contact Number * */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Contact / Mobile Number (For verification & WhatsApp) *
                      </label>
                      <div className="flex rounded-2xl bg-[#1E293B]/90 border border-slate-700/80 overflow-hidden focus-within:border-[#F59E0B] focus-within:ring-1 focus-within:ring-[#F59E0B]">
                        <div className="px-3.5 py-2.5 bg-slate-800/80 text-slate-300 text-xs font-bold border-r border-slate-700/80 flex items-center gap-1.5">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          id="emp-mobile-input"
                          value={empMobile}
                          onChange={(e) =>
                            setEmpMobile(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          placeholder="10-digit mobile number"
                          required
                          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Create Password * */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Create Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="emp-password-input"
                            value={empPassword}
                            onChange={(e) => setEmpPassword(e.target.value)}
                            placeholder="At least 6 chars"
                            required
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="emp-confirm-password-input"
                            value={empConfirmPassword}
                            onChange={(e) => setEmpConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            required
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Company City & Industry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Headquarter / City *
                        </label>
                        <div className="relative">
                          <select
                            id="emp-city-select"
                            value={empCity}
                            onChange={(e) => setEmpCity(e.target.value)}
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2.5 text-xs text-white appearance-none focus:outline-hidden focus:border-[#F59E0B]"
                          >
                            {INDIAN_CITIES.map((city) => (
                              <option key={city} value={city} className="bg-[#0F172A] text-white">
                                {city}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Industry / Sector *
                        </label>
                        <div className="relative">
                          <select
                            id="emp-industry-select"
                            value={empIndustry}
                            onChange={(e) => setEmpIndustry(e.target.value)}
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2.5 text-xs text-white appearance-none focus:outline-hidden focus:border-[#F59E0B]"
                          >
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind} className="bg-[#0F172A] text-white">
                                {ind}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Website or GSTIN (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company Website or GSTIN (Optional)
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="emp-website-input"
                          value={empWebsiteOrGst}
                          onChange={(e) => setEmpWebsiteOrGst(e.target.value)}
                          placeholder="e.g. https://company.com or 22AAAAA0000A1Z5"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                    </div>

                    {/* Hiring Requirement Scale */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Current Hiring Volume
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: '1-5', label: '1 - 5 Hires' },
                          { id: '5-20', label: '5 - 20 Urgent' },
                          { id: '20+', label: '20+ Bulk Hires' },
                        ].map((tier) => (
                          <button
                            type="button"
                            key={tier.id}
                            onClick={() => setEmpHiringNeed(tier.id as any)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                              empHiringNeed === tier.id
                                ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#FDE68A]'
                                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tier.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  id="auth-signup-submit-btn"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2 ${
                    accountType === 'employer'
                      ? 'bg-[#F59E0B] hover:bg-[#D97706] text-[#451A03] shadow-amber-950/40'
                      : 'bg-[#10B981] hover:bg-[#059669] text-[#022c22] shadow-emerald-950/40'
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>
                        {accountType === 'employer'
                          ? 'Create Employer / HR Recruiter Account'
                          : 'Create Free Job Seeker Account'}
                      </span>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Terms of Service Disclaimer */}
                <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
                  By signing up, you agree to Jobs Help{' '}
                  <span className="text-slate-300 underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-slate-300 underline cursor-pointer">Privacy Policy</span>.
                </p>

                {/* Bottom Switch Link */}
                <div className="text-center pt-1 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setErrorMessage(null);
                      }}
                      className="text-[#10B981] font-bold hover:underline"
                    >
                      Log In here
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* ================= LOGIN FORM ================= */
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email ID or Mobile Number *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="login-email-input"
                      value={loginEmailOrPhone}
                      onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                      placeholder="e.g. rahul@example.com or 9876543210"
                      required
                      className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (accountType === 'admin') {
                          onClose();
                          onOpenAdminResetPassword?.();
                        } else {
                          setResetFeedback('A secure reset link has been dispatched to your email/phone.');
                          setTimeout(() => setResetFeedback(null), 4000);
                        }
                      }}
                      className="text-[11px] text-[#10B981] hover:underline"
                    >
                      {accountType === 'admin' ? 'Reset Admin Password?' : 'Forgot password?'}
                    </button>
                  </div>
                  {resetFeedback && (
                    <div className="mb-2 p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-[11px] text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{resetFeedback}</span>
                    </div>
                  )}
                  {accountType === 'admin' && adminPassword && (
                    <div className="mb-2 p-2 bg-purple-950/60 border border-purple-800/60 rounded-xl text-[11px] text-purple-200 flex items-center justify-between gap-1">
                      <span>Active Admin Password: <b>{adminPassword}</b></span>
                      <button
                        type="button"
                        onClick={() => setLoginPassword(adminPassword)}
                        className="text-[10px] text-purple-300 hover:text-white bg-purple-700/50 px-1.5 py-0.5 rounded font-bold"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm border-slate-700 bg-slate-800 text-[#10B981] focus:ring-0 w-4 h-4"
                    />
                    <span className="text-xs text-slate-400">Remember on this device</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Encrypted 256-bit</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="auth-login-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-[#10B981] hover:bg-[#059669] text-[#022c22] shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging In...</span>
                  ) : (
                    <>
                      <span>Log In to {accountType === 'employer' ? 'Employer Portal' : accountType === 'admin' ? 'Admin Panel' : 'Account'}</span>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Quick 1-Click Demo Logins for instant testing */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2 text-center uppercase tracking-wider">
                    Quick 1-Click Demo Login
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDemoQuickLogin('job-seeker')}
                      className="py-2 px-1 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-[11px] font-bold text-[#10B981] transition-colors"
                    >
                      Seeker Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoQuickLogin('employer')}
                      className="py-2 px-1 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-[11px] font-bold text-[#F59E0B] transition-colors"
                    >
                      Employer Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoQuickLogin('admin')}
                      className="py-2 px-1 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 text-[11px] font-bold text-[#A855F7] transition-colors"
                    >
                      Admin Demo
                    </button>
                  </div>
                </div>

                {/* Bottom Switch to Sign Up */}
                <div className="text-center pt-1 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setTab('signup');
                        setErrorMessage(null);
                      }}
                      className="text-[#10B981] font-bold hover:underline"
                    >
                      Sign Up (Email)
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
