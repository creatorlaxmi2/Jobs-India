import React, { useState, useEffect } from 'react';
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
  Smartphone,
  KeyRound,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { AppMode } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  initialAccountType?: 'job-seeker' | 'employer' | 'admin';
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
      isNewSignUp?: boolean;
    }
  ) => void;
}

const INDIAN_CITIES = [
  'Patna, Bihar',
  'Delhi NCR',
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
  initialAccountType = 'job-seeker',
  adminPassword,
  onOpenAdminResetPassword,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'otp'>(initialTab);
  const [accountType, setAccountType] = useState<'job-seeker' | 'employer' | 'admin'>(initialAccountType);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Job Seeker Signup Fields
  const [seekerFullName, setSeekerFullName] = useState('');
  const [seekerContact, setSeekerContact] = useState('');
  const [seekerPassword, setSeekerPassword] = useState('');
  const [seekerConfirmPassword, setSeekerConfirmPassword] = useState('');
  const [seekerCity, setSeekerCity] = useState('Patna, Bihar');

  // Employer / HR Full Details Signup Fields
  const [empFullName, setEmpFullName] = useState('');
  const [empWorkEmail, setEmpWorkEmail] = useState('');
  const [empCompanyName, setEmpCompanyName] = useState('');
  const [empDesignation, setEmpDesignation] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empConfirmPassword, setEmpConfirmPassword] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empCity, setEmpCity] = useState('Patna, Bihar');
  const [empIndustry, setEmpIndustry] = useState('Healthcare & Hospital');
  const [empWebsiteOrGst, setEmpWebsiteOrGst] = useState('');
  const [empHiringNeed, setEmpHiringNeed] = useState<'1-5' | '5-20' | '20+'>('1-5');

  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Mobile OTP Tab Fields
  const [otpPhone, setOtpPhone] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error & Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ mode: AppMode; name: string } | null>(null);

  // Synchronize initial tab and account type when modal opens
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      if (initialAccountType) {
        setAccountType(initialAccountType);
      }
      setErrorMessage(null);
      setIsSuccess(false);
      setIsSubmitting(false);
      setOtpSent(false);
      setOtpCode('');
    }
  }, [isOpen, initialTab, initialAccountType]);

  if (!isOpen) return null;

  // Auto-Fill Sample Data Helpers for Easy Testing
  const handleAutoFillSignup = () => {
    setErrorMessage(null);
    if (accountType === 'employer') {
      setEmpFullName('Pooja Verma');
      setEmpWorkEmail('pooja.verma@apollohealth.in');
      setEmpCompanyName('Apollo Clinic Patna');
      setEmpDesignation('Senior HR Lead');
      setEmpMobile('9876501234');
      setEmpCity('Patna, Bihar');
      setEmpIndustry('Healthcare & Hospital');
      setEmpPassword('apollo@123');
      setEmpConfirmPassword('apollo@123');
    } else {
      setSeekerFullName('Rahul Kumar');
      setSeekerContact('rahul.patna@gmail.com');
      setSeekerCity('Patna, Bihar');
      setSeekerPassword('seeker@123');
      setSeekerConfirmPassword('seeker@123');
    }
  };

  const handleAutoFillLogin = () => {
    setErrorMessage(null);
    if (accountType === 'admin') {
      setLoginEmailOrPhone('admin@jobshelp.in');
      setLoginPassword(adminPassword || 'admin@123');
    } else if (accountType === 'employer') {
      setLoginEmailOrPhone('hr@apollohealth.in');
      setLoginPassword('apollo@123');
    } else {
      setLoginEmailOrPhone('rahul.patna@gmail.com');
      setLoginPassword('seeker@123');
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (accountType === 'job-seeker') {
      if (!seekerFullName.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (!seekerContact.trim()) {
        setErrorMessage('Please enter your email or 10-digit mobile number');
        return;
      }
      if (!seekerPassword || seekerPassword.length < 4) {
        setErrorMessage('Please choose a password (at least 4 characters)');
        return;
      }
      if (seekerConfirmPassword && seekerPassword !== seekerConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }

      setIsSubmitting(true);
      const isEmail = seekerContact.includes('@');
      const cleanPhone = !isEmail ? seekerContact.replace(/\D/g, '') : undefined;
      const cleanEmail = isEmail ? seekerContact.trim() : `${seekerFullName.toLowerCase().replace(/\s+/g, '')}@jobshelp.in`;

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setSuccessInfo({ mode: 'job-seeker', name: seekerFullName.trim() });

        setTimeout(() => {
          onLoginSuccess('job-seeker', seekerFullName.trim(), {
            email: cleanEmail,
            phone: cleanPhone ? `+91 ${cleanPhone}` : undefined,
            city: seekerCity,
            isNewSignUp: true,
          });
          onClose();
        }, 400);
      }, 300);
    } else {
      // Employer / HR validation
      if (!empFullName.trim()) {
        setErrorMessage('Please enter HR contact person full name');
        return;
      }
      if (!empWorkEmail.trim()) {
        setErrorMessage('Please enter your official work email or contact');
        return;
      }
      if (!empCompanyName.trim()) {
        setErrorMessage('Please enter your company or hospital name');
        return;
      }
      if (!empPassword || empPassword.length < 4) {
        setErrorMessage('Password must be at least 4 characters');
        return;
      }
      if (empConfirmPassword && empPassword !== empConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
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
            phone: empMobile ? `+91 ${empMobile}` : undefined,
            companyName: empCompanyName.trim(),
            designation: empDesignation.trim() || 'HR Recruiter',
            city: empCity,
            isNewSignUp: true,
          });
          onClose();
        }, 400);
      }, 300);
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
    if (accountType === 'admin') {
      const normalizedEmail = loginEmailOrPhone.trim().toLowerCase();
      const authorizedAdmins = [
        'rajashok926@gmail.com',
        'creatorlaxmi2@gmail.com',
        'support.jobsindia@gmail.com',
        'admin@jobsindia.com',
      ];
      const storedAdminEmail = localStorage.getItem('jobs_india_admin_email')?.trim().toLowerCase();
      const isAuthorized =
        authorizedAdmins.includes(normalizedEmail) ||
        (storedAdminEmail && storedAdminEmail === normalizedEmail);

      if (!isAuthorized) {
        setErrorMessage(
          `❌ Access Denied: Wrong Email ID! "${loginEmailOrPhone}" is not an authorized Super Admin. Access blocked.`
        );
        return;
      }

      const targetPass = adminPassword || 'admin@123';
      if (loginPassword !== targetPass) {
        setErrorMessage(`Incorrect Admin Password! (Default: ${targetPass}). Click Auto-fill or Reset.`);
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      let resolvedName = 'HR Manager';
      let empCompany = 'Apollo Diagnostics';
      let empDesignation = 'Verified HR';

      if (accountType === 'employer') {
        resolvedName = loginEmailOrPhone.includes('@')
          ? loginEmailOrPhone.split('@')[0].replace(/[._-]/g, ' ')
          : 'HR Manager';
        if (loginEmailOrPhone.toLowerCase().includes('tata')) {
          empCompany = 'Tata Medical Care Center';
          empDesignation = 'Senior HR Lead';
        } else if (loginEmailOrPhone.toLowerCase().includes('flipkart')) {
          empCompany = 'Flipkart Logistics';
          empDesignation = 'Lead Talent Acquisition';
        } else if (loginEmailOrPhone.toLowerCase().includes('stark')) {
          empCompany = 'Stark Fabrications';
          empDesignation = 'General Manager - HR';
        } else if (loginEmailOrPhone.toLowerCase().includes('reliance')) {
          empCompany = 'Reliance Retail';
          empDesignation = 'Regional HR Lead';
        } else {
          empCompany = 'Apollo Diagnostics';
          empDesignation = 'Verified HR';
        }
      } else if (accountType === 'admin') {
        resolvedName = 'Super Admin Moderator';
      } else {
        resolvedName = loginEmailOrPhone.includes('@')
          ? loginEmailOrPhone.split('@')[0]
          : 'Rahul Sharma';
      }

      setSuccessInfo({ mode: accountType, name: resolvedName });

      setTimeout(() => {
        onLoginSuccess(accountType, resolvedName, {
          email: loginEmailOrPhone.includes('@') ? loginEmailOrPhone : undefined,
          phone: !loginEmailOrPhone.includes('@') ? loginEmailOrPhone : undefined,
          companyName: accountType === 'employer' ? empCompany : undefined,
          designation: accountType === 'employer' ? empDesignation : undefined,
          city: 'Patna, Bihar',
        });
        onClose();
      }, 400);
    }, 300);
  };

  // Handle OTP Flow
  const handleSendOtp = () => {
    if (!otpPhone || otpPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setOtpCode('4920'); // Instant demo OTP
    setErrorMessage(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP code');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const name = `Candidate (+91 ${otpPhone.slice(-4)})`;
      setSuccessInfo({ mode: 'job-seeker', name });
      setTimeout(() => {
        onLoginSuccess('job-seeker', name, { phone: `+91 ${otpPhone}` });
        onClose();
      }, 400);
    }, 300);
  };

  // 1-Click Instant Demo Login
  const handleDemoQuickLogin = (role: AppMode) => {
    setAccountType(role);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const demoName =
        role === 'employer'
          ? 'Pooja Verma'
          : role === 'admin'
          ? 'Super Admin Moderator'
          : 'Rahul Sharma (Job Seeker)';

      setSuccessInfo({
        mode: role,
        name: role === 'employer' ? `${demoName} (Apollo Diagnostics)` : demoName,
      });

      setTimeout(() => {
        if (role === 'employer') {
          onLoginSuccess('employer', demoName, {
            companyName: 'Apollo Diagnostics',
            designation: 'Senior HR Lead',
            email: 'pooja.verma@apollodiagnostics.in',
            phone: '+91 98765 01234',
            city: 'Patna, Bihar',
          });
        } else {
          onLoginSuccess(role, demoName);
        }
        onClose();
      }, 400);
    }, 200);
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
        className="w-full max-w-[480px] bg-[#0F172A] border border-slate-700/70 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 relative my-auto animate-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-[#064E3B] font-extrabold text-sm shadow-md flex-shrink-0">
              JI
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                {tab === 'signup'
                  ? 'Sign Up to Jobs India Portal'
                  : tab === 'otp'
                  ? 'Instant Mobile OTP Login'
                  : 'Log In to Jobs India Portal'}
              </h2>
              <p className="text-xs text-slate-400">
                {tab === 'signup'
                  ? 'Create your free account for jobs across India'
                  : tab === 'otp'
                  ? 'Direct passwordless login with OTP verification'
                  : 'Welcome back! Access your verified portal'}
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
          <div className="py-10 text-center space-y-3.5 animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {tab === 'signup' ? 'Account Created Successfully!' : 'Signed In Successfully!'}
            </h3>
            <p className="text-sm text-slate-300 font-medium">
              Active as <span className="text-[#10B981] font-bold">{successInfo.name}</span>
            </p>
            <p className="text-xs text-slate-400">
              Opening {successInfo.mode === 'employer' ? 'Employer Portal' : successInfo.mode === 'admin' ? 'Admin Panel' : 'Job Seeker Dashboard'}...
            </p>
          </div>
        ) : (
          <div className="mt-3.5 space-y-3.5">
            {/* 3-Way Segmented Tabs (Log In vs Sign Up vs Phone OTP) */}
            <div className="bg-[#1E293B] p-1 rounded-2xl flex items-center gap-1 border border-slate-700/60">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
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
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  tab === 'signup'
                    ? 'bg-[#10B981] text-[#042F2E] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#042F2E]" />
                <span>Sign Up</span>
              </button>
              <button
                type="button"
                id="auth-tab-otp"
                onClick={() => {
                  setTab('otp');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  tab === 'otp'
                    ? 'bg-[#10B981] text-[#042F2E] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone OTP</span>
              </button>
            </div>

            {/* Choose Account Type Section (Only for Login and Signup) */}
            {tab !== 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Choose Account Type
                  </label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountType(accountType === 'admin' ? 'job-seeker' : 'admin');
                        setErrorMessage(null);
                      }}
                      className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        accountType === 'admin' ? 'text-purple-400 underline' : 'text-slate-400 hover:text-purple-300'
                      }`}
                    >
                      <Shield className="w-3 h-3 text-purple-400" />
                      <span>{accountType === 'admin' ? 'Exit Admin Mode' : 'Admin Panel Login'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Job Seeker Card */}
                  <button
                    type="button"
                    id="choose-role-job-seeker"
                    onClick={() => {
                      setAccountType('job-seeker');
                      setErrorMessage(null);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      accountType === 'job-seeker'
                        ? 'border-[#10B981] bg-[#064E3B]/25 ring-1 ring-[#10B981] text-white shadow-xs'
                        : 'border-slate-800 bg-[#1E293B]/70 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        accountType === 'job-seeker'
                          ? 'bg-[#10B981]/25 text-[#10B981]'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <User className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">
                        Job Seeker
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
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
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      accountType === 'employer'
                        ? 'border-[#F59E0B] bg-[#78350F]/25 ring-1 ring-[#F59E0B] text-white shadow-xs'
                        : 'border-slate-800 bg-[#1E293B]/70 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        accountType === 'employer'
                          ? 'bg-[#F59E0B]/25 text-[#F59E0B]'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">
                        Employer / HR
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Post & hire
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div
                id="auth-error-banner"
                className="bg-red-500/15 border border-red-500/40 rounded-2xl p-2.5 flex items-start gap-2 text-red-300 text-xs animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ================= SIGN UP TAB ================= */}
            {tab === 'signup' && (
              <form noValidate onSubmit={handleSignupSubmit} className="space-y-3">
                {accountType === 'job-seeker' ? (
                  <>
                    {/* Seeker: Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="seeker-fullname-input"
                          value={seekerFullName}
                          onChange={(e) => setSeekerFullName(e.target.value)}
                          placeholder="e.g. Rahul Kumar"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                        />
                      </div>
                    </div>

                    {/* Seeker: Email or Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email ID or Mobile Number *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          id="seeker-email-input"
                          value={seekerContact}
                          onChange={(e) => setSeekerContact(e.target.value)}
                          placeholder="e.g. rahul@gmail.com or 9876543210"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                        />
                      </div>
                    </div>

                    {/* Seeker: Password and Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="seeker-password-input"
                            value={seekerPassword}
                            onChange={(e) => setSeekerPassword(e.target.value)}
                            placeholder="Min 4 chars"
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="seeker-confirm-password-input"
                            value={seekerConfirmPassword}
                            onChange={(e) => setSeekerConfirmPassword(e.target.value)}
                            placeholder="Re-enter"
                            className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preferred City */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Preferred Location / City
                      </label>
                      <div className="relative">
                        <select
                          id="seeker-city-select"
                          value={seekerCity}
                          onChange={(e) => setSeekerCity(e.target.value)}
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white appearance-none focus:outline-hidden focus:border-[#10B981]"
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
                  </>
                ) : (
                  /* ================= EMPLOYER SIGNUP ================= */
                  <>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-[11px] text-amber-200">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>Creates a <strong>Fresh Clean Database</strong> for your company</span>
                      </div>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">0 Old Jobs</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          HR Contact Name *
                        </label>
                        <input
                          type="text"
                          id="emp-fullname-input"
                          value={empFullName}
                          onChange={(e) => setEmpFullName(e.target.value)}
                          placeholder="e.g. Pooja Verma"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Work Email *
                        </label>
                        <input
                          type="text"
                          id="emp-email-input"
                          value={empWorkEmail}
                          onChange={(e) => setEmpWorkEmail(e.target.value)}
                          placeholder="e.g. hr@company.com"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          id="emp-company-input"
                          value={empCompanyName}
                          onChange={(e) => setEmpCompanyName(e.target.value)}
                          placeholder="e.g. Apollo Diagnostics"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          id="emp-designation-input"
                          value={empDesignation}
                          onChange={(e) => setEmpDesignation(e.target.value)}
                          placeholder="e.g. HR Manager"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="emp-mobile-input"
                          value={empMobile}
                          onChange={(e) => setEmpMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit mobile"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          id="emp-password-input"
                          value={empPassword}
                          onChange={(e) => setEmpPassword(e.target.value)}
                          placeholder="Min 4 chars"
                          className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#F59E0B]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Signup Button */}
                <button
                  type="submit"
                  id="auth-signup-submit-btn"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 mt-2 ${
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
              </form>
            )}

            {/* ================= LOGIN TAB ================= */}
            {tab === 'login' && (
              <form noValidate onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Admin Password Hint if in Admin mode */}
                {accountType === 'admin' && (
                  <div className="p-2 bg-purple-950/60 border border-purple-800/60 rounded-xl text-[11px] text-purple-200 flex items-center justify-between gap-1">
                    <span>Admin Password: <b>{adminPassword || 'admin@123'}</b></span>
                    <button
                      type="button"
                      onClick={() => setLoginPassword(adminPassword || 'admin@123')}
                      className="text-[10px] text-purple-300 hover:text-white bg-purple-700/50 px-2 py-0.5 rounded font-bold"
                    >
                      Fill
                    </button>
                  </div>
                )}

                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email ID or Mobile Number *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="login-email-input"
                      value={loginEmailOrPhone}
                      onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                      placeholder="e.g. rahul.patna@gmail.com or 9876543210"
                      className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
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
                          setTimeout(() => setResetFeedback(null), 3500);
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

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-sm border-slate-700 bg-slate-800 text-[#10B981] focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-slate-400">Remember on this device</span>
                  </label>
                  <span className="text-[10px] text-slate-500">256-bit Secure</span>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  id="auth-login-submit-btn"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#10B981] hover:bg-[#059669] text-[#022c22] shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging In...</span>
                  ) : (
                    <>
                      <span>
                        Log In to {accountType === 'employer' ? 'Employer Portal' : accountType === 'admin' ? 'Admin Panel' : 'Account'}
                      </span>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= PHONE OTP TAB ================= */}
            {tab === 'otp' && (
              <form noValidate onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-xs text-slate-300">
                  <p className="font-semibold text-white mb-0.5">Instant Mobile Verification</p>
                  <p className="text-[11px] text-slate-400">
                    Enter your 10-digit mobile number to receive a verification code.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex rounded-2xl bg-[#1E293B]/90 border border-slate-700/80 overflow-hidden focus-within:border-[#10B981]">
                    <div className="px-3 py-2 bg-slate-800/80 text-slate-300 text-xs font-bold border-r border-slate-700/80 flex items-center gap-1">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      id="otp-phone-input"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] text-xs font-bold transition-colors"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        Enter 4-Digit OTP
                      </label>
                      <span className="text-[11px] text-[#10B981] font-mono font-bold bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                        Demo OTP: 4920
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="otp-code-input"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.slice(0, 4))}
                        placeholder="e.g. 4920"
                        className="w-full bg-[#1E293B]/90 border border-slate-700/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-center font-mono text-sm tracking-widest text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  id="otp-submit-btn"
                  disabled={isSubmitting || !otpSent}
                  className="w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm bg-[#10B981] hover:bg-[#059669] text-[#022c22] shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify & Access Account</span>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
