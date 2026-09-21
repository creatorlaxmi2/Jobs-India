import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Upload,
  ChevronRight,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  IndianRupee,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToPremium: () => void;
  onOpenSwitchMode?: () => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToPremium,
  onOpenSwitchMode,
  onOpenAuth,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [skillInput, setSkillInput] = useState('');
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);

  // Missing steps for profile completion
  const missingSteps = [
    { title: 'Upload Latest Resume (ATS Score)', weight: 15, done: Boolean(profile.resumeName) },
    { title: 'Add Secondary Skill Certifications', weight: 8, done: profile.skills.length >= 6 },
    { title: 'Verify Alternate WhatsApp Number', weight: 5, done: true },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setShowEditModal(false);
  };

  const handleSimulatedResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        resumeName: file.name,
        resumeUploadedAt: 'Uploaded just now (ATS Score: 92%)',
        completionPercentage: Math.min(100, prev.completionPercentage + 15),
      }));
      setResumeUploadSuccess(true);
      setTimeout(() => setResumeUploadSuccess(false), 3000);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // SVG Circular progress math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (profile.completionPercentage / 100) * circumference;

  return (
    <div className="space-y-4 pb-24 pt-1 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-xl font-black text-[#1E2544] tracking-tight">
          My Profile
        </h1>
        <button
          id="profile-edit-btn"
          onClick={() => {
            setFormData({ ...profile });
            setShowEditModal(true);
          }}
          className="text-xs font-bold text-[#4055B8] flex items-center gap-1 bg-[#EEF2FF] px-3 py-1.5 rounded-full hover:bg-[#E0E7FF] transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div
        id="profile-main-card"
        onClick={() => {
          setFormData({ ...profile });
          setShowEditModal(true);
        }}
        className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Circular Profile Avatar */}
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#4055B8]/20 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#35A853] text-white p-0.5 rounded-full border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-[#1E2544] leading-tight">
                {profile.name}
              </h2>
              {profile.email && (
                <p className="text-xs font-semibold text-[#4055B8] flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#4055B8]" />
                  <span>{profile.email}</span>
                </p>
              )}
              <p className="text-xs font-semibold text-[#687386] flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{profile.phone}</span>
              </p>
              <p className="text-xs text-[#687386] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#4055B8]" />
                <span>
                  {profile.locality}, {profile.city}
                </span>
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* LARGE PROFILE COMPLETION CARD ("Complete Your Profile Now!") */}
      <div
        id="profile-completion-card"
        className="bg-gradient-to-br from-[#4055B8] via-[#5244C5] to-[#6B3FC7] rounded-2xl p-4 text-white shadow-[0_4px_16px_rgba(64,85,184,0.2)] relative overflow-hidden"
      >
        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 max-w-[68%]">
            <div className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F5A623]" />
              <span>3x More HR Calls</span>
            </div>
            <h3 className="text-base font-extrabold leading-snug">
              Complete Your Profile Now!
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              Complete your profile to get more HR calls and better job opportunities.
            </p>
          </div>

          {/* Circular Progress Indicator (e.g. 77%) */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-white/20"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-[#F5A623] transition-all duration-700 ease-out"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black tracking-tight leading-none text-white">
                {profile.completionPercentage}%
              </span>
              <span className="text-[9px] font-semibold text-white/80">Done</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between">
          <span className="text-xs font-semibold text-white/90">
            Next: Add Resume (+15%)
          </span>
          <button
            onClick={() => {
              setFormData({ ...profile });
              setShowEditModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white text-[#4055B8] text-xs font-extrabold shadow-sm hover:bg-gray-100 transition-colors"
          >
            Complete Now
          </button>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#4055B8]" />
            <h3 className="text-sm font-bold text-[#1E2544]">My Resume (CV)</h3>
          </div>
          <span className="text-[10px] font-bold text-[#35A853] bg-[#E8F8EE] px-2 py-0.5 rounded-md">
            Verified ATS 88%
          </span>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#1E2544] truncate max-w-[200px]">
              {profile.resumeName}
            </p>
            <p className="text-[11px] text-[#687386]">
              {profile.resumeUploadedAt}
            </p>
          </div>

          <label className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-bold text-[#4055B8] hover:bg-gray-50 cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            <span>Update</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleSimulatedResumeUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs space-y-3 divide-y divide-gray-100">
        {/* Education */}
        <div className="pt-2 first:pt-0 flex items-start gap-3 text-xs">
          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-400 font-medium block text-[11px]">
              Highest Qualification
            </span>
            <span className="font-bold text-[#1E2544]">{profile.education}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="pt-2.5 flex items-start gap-3 text-xs">
          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-400 font-medium block text-[11px]">
              Work Experience
            </span>
            <span className="font-bold text-[#1E2544]">{profile.experience}</span>
          </div>
        </div>

        {/* Current & Expected Salary */}
        <div className="pt-2.5 flex items-start gap-3 text-xs">
          <IndianRupee className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <span className="text-gray-400 font-medium block text-[11px]">
              Current / Expected Salary
            </span>
            <span className="font-bold text-[#1E2544]">
              {profile.currentSalary} → {profile.expectedSalary}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="pt-2.5 flex items-start gap-3 text-xs">
          <Award className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <span className="text-gray-400 font-medium block text-[11px]">
              Key Skills & Certifications ({profile.skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#EEF2FF] text-[#4055B8] font-semibold text-[11px] px-2.5 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Banner Promotion */}
      <div className="bg-gradient-to-r from-[#FAF5FF] to-[#F3E8FF] border border-[#DDD6FE] rounded-2xl p-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold bg-[#6B3FC7] text-white px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
          <h4 className="text-xs font-bold text-[#4C1D95]">
            Boost Profile Visibility by 300%
          </h4>
          <p className="text-[11px] text-[#6B3FC7]">
            Get direct recruiter numbers & priority applications.
          </p>
        </div>
        <button
          onClick={onNavigateToPremium}
          className="px-3 py-1.5 rounded-xl bg-[#6B3FC7] text-white text-xs font-bold shadow-xs whitespace-nowrap"
        >
          View Plans
        </button>
      </div>

      {/* App Mode Switcher Action Card */}
      {onOpenSwitchMode && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#4055B8]">
              <Sparkles className="w-5 h-5 text-[#4055B8]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E2544]">
                Switch App Mode / Recruiter Portal
              </h4>
              <p className="text-[11px] text-gray-500">
                Post jobs as HR employer or access admin panel
              </p>
            </div>
          </div>
          <button
            id="profile-switch-mode-btn"
            onClick={onOpenSwitchMode}
            className="px-3 py-1.5 rounded-xl bg-[#4055B8] hover:bg-[#34459C] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Switch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Jobs Help Email Account Card */}
      {onOpenAuth && (
        <div className="bg-[#0F172A] rounded-2xl border border-slate-700/80 p-4 shadow-sm flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-[#064E3B] font-black text-sm flex-shrink-0 shadow-xs">
              JH
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Jobs Help Account</span>
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold px-1.5 py-0.2 rounded-full">
                  Verified
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Job Seeker & Employer / HR full details signup
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="profile-signup-btn"
              onClick={() => onOpenAuth('signup')}
              className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#022c22] text-xs font-extrabold shadow-sm transition-colors"
            >
              Sign Up
            </button>
            <button
              id="profile-login-btn"
              onClick={() => onOpenAuth('login')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* FULL PROFILE EDITING MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#4055B8]" />
                <h3 className="text-base font-bold text-[#1E2544]">
                  Edit Profile
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                    required
                  />
                </div>
              </div>

              {/* City & Locality */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    Locality (e.g. Muhammadpur)
                  </label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) =>
                      setFormData({ ...formData, locality: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                    required
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Highest Education
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Experience Description
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              {/* Expected Salary */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    Current Salary
                  </label>
                  <input
                    type="text"
                    value={formData.currentSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, currentSalary: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1E2544] block mb-1">
                    Expected Salary
                  </label>
                  <input
                    type="text"
                    value={formData.expectedSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedSalary: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                    required
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Skills & Certifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill (e.g. ICU Care, Tally, Excel)"
                    className="flex-1 p-2 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 bg-[#4055B8] text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((s) => (
                    <span
                      key={s}
                      className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume file upload */}
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Upload Resume (PDF, DOC)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-[#4055B8] transition-colors">
                  <input
                    type="file"
                    id="edit-resume-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleSimulatedResumeUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-resume-input"
                    className="cursor-pointer block text-xs text-[#4055B8] font-bold"
                  >
                    <Upload className="w-4 h-4 mx-auto mb-1 text-[#4055B8]" />
                    {formData.resumeName || 'Click to choose resume file'}
                  </label>
                  {resumeUploadSuccess && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">
                      ✓ Resume uploaded successfully!
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4055B8] to-[#6B3FC7] text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
