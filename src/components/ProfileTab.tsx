import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Share2,
  SquarePen,
  User,
  Languages as LanguagesIcon,
  Info,
  Briefcase,
  Wrench,
  FileText,
  GraduationCap,
  Award,
  Upload,
  CheckCircle2,
  X,
  Plus,
  Check,
  Camera,
  Download,
  Eye,
  LogOut,
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { UserProfile, UserEducation, UserExperienceItem } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToPremium: () => void;
  onBackToHome?: () => void;
  onOpenSwitchMode?: () => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

type EditSectionType =
  | 'header'
  | 'personal'
  | 'languages'
  | 'about'
  | 'experience'
  | 'skills'
  | 'assets'
  | 'education'
  | 'certifications'
  | 'resume'
  | null;

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToPremium,
  onBackToHome,
  onOpenSwitchMode,
  onOpenAuth,
  isLoggedIn = false,
  onLogout,
}) => {
  // Active modal section for editing
  const [activeEditSection, setActiveEditSection] = useState<EditSectionType>(null);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Field temporary states for adding items
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [newAssetInput, setNewAssetInput] = useState('');
  const [newCertInput, setNewCertInput] = useState('');
  const [showResumeViewer, setShowResumeViewer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${profile.name} - Jobs Help Profile`,
          text: `View ${profile.name}'s verified healthcare & nursing profile on Jobs Help India`,
          url: window.location.href,
        })
        .catch(() => {
          showToast('Profile link copied to clipboard!');
        });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Profile link copied to clipboard!');
    }
  };

  // Open edit modal for specific section
  const handleOpenEdit = (section: EditSectionType) => {
    setFormData({ ...profile });
    setActiveEditSection(section);
  };

  // Save changes from modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setActiveEditSection(null);
    showToast('Profile updated successfully');
  };

  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updated = {
          ...formData,
          avatar: reader.result as string,
        };
        setFormData(updated);
        onUpdateProfile(updated);
        showToast('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Resume upload handler
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = {
        ...formData,
        resumeName: file.name,
        resumeUploadedAt: 'Uploaded just now (ATS Score: 92%)',
        completionPercentage: Math.min(100, (formData.completionPercentage || 77) + 5),
      };
      setFormData(updated);
      onUpdateProfile(updated);
      showToast(`Resume "${file.name}" uploaded successfully!`);
    }
  };

  // Helper getters for structured fields with safe fallbacks
  const educationDetails: UserEducation = formData.educationDetails || {
    collegeName: 'Mona',
    endYear: '2027',
    degree: 'Gnm',
    specialization: 'Nursing',
  };

  const primaryExperience: UserExperienceItem =
    formData.experiences && formData.experiences.length > 0
      ? formData.experiences[0]
      : {
          workType: 'Full Time',
          industry: 'Hospitality',
          currentSalary: '9500',
          companyName: 'Oxig',
          startDate: '2025',
          jobTitle: 'Nursing Supervisor',
        };

  const knownLanguages = formData.knownLanguages || ['English', 'Hindi'];
  const skillsList = formData.skills && formData.skills.length > 0 ? formData.skills : ['Patient Care', 'Staff Nurse'];
  const assetsList = formData.assets && formData.assets.length > 0 ? formData.assets : ['Smartphone (Android)', 'Two Wheeler (Scooty)'];
  const certificationsList = formData.certifications || [];

  // Circular progress math (77%)
  const percentage = profile.completionPercentage || 77;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div id="profile-container" className="min-h-screen bg-[#F8F9FA] pb-24 text-[#1E2544]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E2544] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BLUE HEADER BAR - Exact match from screenshot */}
      <header className="bg-[#2A48C8] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button
          id="profile-nav-back-btn"
          onClick={onBackToHome}
          className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 text-white stroke-[2.2]" />
        </button>

        <button
          id="profile-nav-share-btn"
          onClick={handleShare}
          className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          title="Share Profile"
        >
          <Share2 className="w-5 h-5 text-white stroke-[2.2]" />
        </button>
      </header>

      {/* MAIN PROFILE BODY */}
      <div className="space-y-3 px-4 pt-4 max-w-2xl mx-auto">
        {/* 1. TOP PROFILE CARD (Avatar, Name, Phone, Location & Edit) */}
        <section
          id="profile-top-card"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            {/* Avatar with Camera Icon */}
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-xs group-hover:opacity-90 transition-opacity"
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute bottom-0 right-0 bg-[#2A48C8] text-white p-1 rounded-full border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                title="Change Photo"
              >
                <Camera className="w-3 h-3 stroke-[2.5]" />
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-[#1E2544] tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {profile.phone}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {profile.city} | {profile.locality}
              </p>
            </div>
          </div>

          {/* Edit Top Info Button */}
          <button
            id="profile-edit-header-btn"
            onClick={() => handleOpenEdit('header')}
            className="flex flex-col items-center justify-center text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1.5 rounded-xl hover:bg-blue-50/60"
            title="Edit Details"
          >
            <SquarePen className="w-5 h-5 stroke-[2]" />
            <span className="text-[11px] font-bold mt-0.5">Edit</span>
          </button>
        </section>

        {/* 2. COMPLETE YOUR PROFILE NOW BANNER (Orange circular progress) */}
        <section
          id="profile-completion-card"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center gap-4"
        >
          {/* Circular 77% progress ring */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-gray-100"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-[#F59E0B] transition-all duration-700 ease-out"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-[#1E2544]">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Banner Text */}
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-[#1E2544]">
              Complete Your Profile Now!
            </h2>
            <p className="text-xs text-gray-500 leading-snug">
              This helps you get more HR calls and better job opportunities.
            </p>
          </div>
        </section>

        {/* 3. HORIZONTAL QUICK CARDS CAROUSEL (Skills, Assets, About me, Education, Experiences) */}
        <section id="profile-quick-actions" className="overflow-hidden">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
            {/* Card: Skills */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <Wrench className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                Skills
              </span>
              <button
                id="quick-edit-skills-btn"
                onClick={() => handleOpenEdit('skills')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Card: Assets */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                Assets
              </span>
              <button
                id="quick-edit-assets-btn"
                onClick={() => handleOpenEdit('assets')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Card: About me */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <Info className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                About me
              </span>
              <button
                id="quick-edit-about-btn"
                onClick={() => handleOpenEdit('about')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Card: Education */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <GraduationCap className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                Education
              </span>
              <button
                id="quick-edit-education-btn"
                onClick={() => handleOpenEdit('education')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Card: Experiences */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <Briefcase className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                Experiences
              </span>
              <button
                id="quick-edit-experiences-btn"
                onClick={() => handleOpenEdit('experience')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Card: Languages */}
            <div className="flex-shrink-0 w-[108px] bg-white rounded-2xl border border-gray-100 p-3 shadow-xs flex flex-col items-center justify-between text-center min-h-[124px]">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                <LanguagesIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-[#1E2544] mb-2 truncate max-w-full">
                Languages
              </span>
              <button
                id="quick-edit-languages-btn"
                onClick={() => handleOpenEdit('languages')}
                className="w-full py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#2A48C8] text-xs font-bold transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </section>

        {/* 4. PERSONAL INFORMATION SECTION */}
        <section
          id="profile-personal-info"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Personal Information
              </h3>
            </div>
            <button
              id="edit-personal-info-btn"
              onClick={() => handleOpenEdit('personal')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Personal Information"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Email
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.email || 'sitarampatna7@gmail.com'}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Gender
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.gender || 'Female'}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Birthday
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.birthday || '2002-04-02'}
              </span>
            </div>
          </div>
        </section>

        {/* 5. LANGUAGES SECTION */}
        <section
          id="profile-languages"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <LanguagesIcon className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Languages
              </h3>
            </div>
            <button
              id="edit-languages-btn"
              onClick={() => handleOpenEdit('languages')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Languages"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 font-medium block">
                English Level
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.englishLevel || 'Good English'}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-medium block mb-2">
                Known Languages
              </span>
              <div className="flex flex-wrap gap-2">
                {knownLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center px-4 py-1 rounded-full border border-gray-400/80 bg-white text-gray-800 text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. ABOUT ME SECTION */}
        <section
          id="profile-about-me"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Info className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                About me
              </h3>
            </div>
            <button
              id="edit-about-me-btn"
              onClick={() => handleOpenEdit('about')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit About Me"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div>
            {profile.aboutMe ? (
              <p className="text-sm text-[#1E2544] leading-relaxed">
                {profile.aboutMe}
              </p>
            ) : (
              <button
                id="add-profile-summary-link"
                onClick={() => handleOpenEdit('about')}
                className="text-sm font-medium text-[#2A48C8] hover:underline"
              >
                Add profile Summary
              </button>
            )}
          </div>
        </section>

        {/* 7. EXPERIENCES SECTION (2-Column Subcard) */}
        <section
          id="profile-experiences"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Experiences
              </h3>
            </div>
            <button
              id="edit-experiences-btn"
              onClick={() => handleOpenEdit('experience')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Experiences"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Total Work Experience
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.totalWorkExperience || '1 years'}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 font-medium block">
                Experience Level
              </span>
              <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                {profile.experienceLevel || 'experience'}
              </span>
            </div>

            {/* 2-Column Experience Details Subcard */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mt-3 grid grid-cols-2 gap-y-4 gap-x-3">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Work Type
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.workType || 'Full Time'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Current Salary
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.currentSalary || '9500'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Start Date
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.startDate || '2025'}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Industry
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.industry || 'Hospitality'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Company Name
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.companyName || 'Oxig'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium block">
                    Job Title
                  </span>
                  <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                    {primaryExperience.jobTitle || 'Nursing Supervisor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. SKILLS SECTION */}
        <section
          id="profile-skills"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <Wrench className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Skills
              </h3>
            </div>
            <button
              id="edit-skills-btn"
              onClick={() => handleOpenEdit('skills')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Skills"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div>
            <span className="text-xs text-gray-400 font-medium block mb-2">
              Skill
            </span>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-4 py-1 rounded-full border border-gray-400/80 bg-white text-gray-800 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 9. ASSETS SECTION */}
        <section
          id="profile-assets"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Assets
              </h3>
            </div>
            <button
              id="edit-assets-btn"
              onClick={() => handleOpenEdit('assets')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Assets"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div>
            {assetsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {assetsList.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex items-center px-3.5 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-700 text-xs font-medium"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            ) : (
              <button
                onClick={() => handleOpenEdit('assets')}
                className="text-sm font-medium text-[#2A48C8] hover:underline"
              >
                Add Assets
              </button>
            )}
          </div>
        </section>

        {/* 10. EDUCATION SECTION (2-Column Subcard) */}
        <section
          id="profile-education"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Education
              </h3>
            </div>
            <button
              id="edit-education-btn"
              onClick={() => handleOpenEdit('education')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Education"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* 2-Column Education Details Subcard */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-y-4 gap-x-3">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  College Name
                </span>
                <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                  {educationDetails.collegeName || 'Mona'}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  Degree
                </span>
                <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                  {educationDetails.degree || 'Gnm'}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  End Year
                </span>
                <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                  {educationDetails.endYear || '2027'}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  Specialization
                </span>
                <span className="text-sm font-medium text-[#1E2544] block mt-0.5">
                  {educationDetails.specialization || 'Nursing'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 11. CERTIFICATION SECTION */}
        <section
          id="profile-certification"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Certification
              </h3>
            </div>
            <button
              id="edit-certification-btn"
              onClick={() => handleOpenEdit('certifications')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Certification"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div>
            {certificationsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {certificationsList.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[#2A48C8] text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2A48C8]" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            ) : (
              <button
                id="add-certification-link"
                onClick={() => handleOpenEdit('certifications')}
                className="text-sm font-medium text-[#2A48C8] hover:underline"
              >
                Add Certification
              </button>
            )}
          </div>
        </section>

        {/* 12. RESUME SECTION */}
        <section
          id="profile-resume"
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-gray-500 stroke-[2]" />
              <h3 className="text-base font-bold text-[#1E2544]">
                Resume
              </h3>
            </div>
            <button
              id="edit-resume-btn"
              onClick={() => handleOpenEdit('resume')}
              className="text-[#2A48C8] hover:text-[#1E3A8A] transition-colors p-1"
              title="Edit Resume"
            >
              <SquarePen className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              id="view-resume-link"
              onClick={() => setShowResumeViewer(true)}
              className="text-sm font-medium text-[#2A48C8] hover:underline flex items-center gap-1.5"
            >
              <span>{profile.resumeName || 'Resume.pdf'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-[#2A48C8] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Update</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </div>
        </section>

        {/* 13. ADDITIONAL CONTROLS: Switch Portal & Account Status */}
        <div className="pt-2 space-y-2.5">
          {/* Switch Portal Button */}
          {onOpenSwitchMode && (
            <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#2A48C8]">
                  <Sparkles className="w-4 h-4 text-[#2A48C8]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E2544]">
                    Switch Mode / Portal
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Post jobs as HR employer or access admin panel
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenSwitchMode}
                className="px-3 py-1.5 rounded-xl bg-[#2A48C8] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Switch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Account Status Card */}
          {onOpenAuth && (
            <div className="bg-[#0F172A] rounded-2xl border border-slate-700/80 p-3.5 shadow-xs flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-[#064E3B] font-black text-xs flex-shrink-0">
                  JH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Jobs Help Account</span>
                    <span
                      className={`text-[9px] ${
                        isLoggedIn
                          ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                          : 'bg-slate-700 text-slate-300 border-slate-600'
                      } border font-bold px-1.5 py-0.2 rounded-full`}
                    >
                      {isLoggedIn ? 'Active' : 'Guest'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isLoggedIn ? `Active as ${profile.name}` : 'Log in to sync applications'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                    >
                      Switch
                    </button>
                    {onLogout && (
                      <button
                        onClick={onLogout}
                        className="px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
                      >
                        Log Out
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#022c22] text-xs font-extrabold shadow-sm transition-colors"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                    >
                      Log In
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= EDIT MODALS (Targeted by Section) ================= */}
      {activeEditSection && (
        <div
          id="profile-edit-modal-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveEditSection(null)}
        >
          <div
            id="profile-edit-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[88vh] overflow-y-auto space-y-4 animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1E2544]">
                {activeEditSection === 'header' && 'Edit Name & Location'}
                {activeEditSection === 'personal' && 'Edit Personal Information'}
                {activeEditSection === 'languages' && 'Edit Languages'}
                {activeEditSection === 'about' && 'Edit About Me Summary'}
                {activeEditSection === 'experience' && 'Edit Work Experience'}
                {activeEditSection === 'skills' && 'Edit Skills'}
                {activeEditSection === 'assets' && 'Edit Assets'}
                {activeEditSection === 'education' && 'Edit Education'}
                {activeEditSection === 'certifications' && 'Edit Certifications'}
                {activeEditSection === 'resume' && 'Manage Resume (CV)'}
              </h3>
              <button
                onClick={() => setActiveEditSection(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* SECTION: Header Info */}
              {activeEditSection === 'header' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Locality
                      </label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Personal Information */}
              {activeEditSection === 'personal' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender || 'Female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Birthday (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      value={formData.birthday || '2002-04-02'}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: Languages */}
              {activeEditSection === 'languages' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      English Level
                    </label>
                    <select
                      value={formData.englishLevel || 'Good English'}
                      onChange={(e) => setFormData({ ...formData, englishLevel: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8]"
                    >
                      <option value="Basic English">Basic English</option>
                      <option value="Good English">Good English</option>
                      <option value="Fluent English">Fluent English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Known Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(formData.knownLanguages || ['English', 'Hindi']).map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-xs font-medium"
                        >
                          <span>{lang}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                knownLanguages: (formData.knownLanguages || []).filter(
                                  (l) => l !== lang
                                ),
                              })
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add another language (e.g. Bhojpuri, Bengali)"
                        value={newLanguageInput}
                        onChange={(e) => setNewLanguageInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newLanguageInput.trim()) {
                            setFormData({
                              ...formData,
                              knownLanguages: [
                                ...(formData.knownLanguages || []),
                                newLanguageInput.trim(),
                              ],
                            });
                            setNewLanguageInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#2A48C8] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: About Me */}
              {activeEditSection === 'about' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Profile Summary (About Me)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.aboutMe || ''}
                      onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                      placeholder="Write a brief professional summary (e.g. Dedicated GNM Nurse with 1+ year clinical experience in patient care, ICU monitoring, and hospital healthcare management)..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#2A48C8] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: Experience */}
              {activeEditSection === 'experience' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Total Experience
                      </label>
                      <input
                        type="text"
                        value={formData.totalWorkExperience || '1 years'}
                        onChange={(e) =>
                          setFormData({ ...formData, totalWorkExperience: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <input
                        type="text"
                        value={formData.experienceLevel || 'experience'}
                        onChange={(e) =>
                          setFormData({ ...formData, experienceLevel: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2.5">
                    <p className="text-xs font-bold text-[#1E2544]">Current Job Details</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.jobTitle}
                          onChange={(e) => {
                            const updated = [{ ...primaryExperience, jobTitle: e.target.value }];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.companyName}
                          onChange={(e) => {
                            const updated = [
                              { ...primaryExperience, companyName: e.target.value },
                            ];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Work Type
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.workType}
                          onChange={(e) => {
                            const updated = [{ ...primaryExperience, workType: e.target.value }];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Industry
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.industry}
                          onChange={(e) => {
                            const updated = [{ ...primaryExperience, industry: e.target.value }];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Current Salary (₹)
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.currentSalary}
                          onChange={(e) => {
                            const updated = [
                              { ...primaryExperience, currentSalary: e.target.value },
                            ];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={primaryExperience.startDate}
                          onChange={(e) => {
                            const updated = [{ ...primaryExperience, startDate: e.target.value }];
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Skills */}
              {activeEditSection === 'skills' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Professional Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-xs font-medium"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                skills: formData.skills.filter((s) => s !== skill),
                              })
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill (e.g. IV Injection, Vital Signs, ICU Care)"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSkillInput.trim() && !formData.skills.includes(newSkillInput.trim())) {
                            setFormData({
                              ...formData,
                              skills: [...formData.skills, newSkillInput.trim()],
                            });
                            setNewSkillInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#2A48C8] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Assets */}
              {activeEditSection === 'assets' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Owned Assets (e.g. Smartphone, Bike, Laptop)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {assetsList.map((asset) => (
                        <span
                          key={asset}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-xs font-medium"
                        >
                          <span>{asset}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                assets: (formData.assets || []).filter((a) => a !== asset),
                              })
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add an asset (e.g. Laptop, 4-Wheeler)"
                        value={newAssetInput}
                        onChange={(e) => setNewAssetInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAssetInput.trim()) {
                            setFormData({
                              ...formData,
                              assets: [...(formData.assets || []), newAssetInput.trim()],
                            });
                            setNewAssetInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#2A48C8] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Education */}
              {activeEditSection === 'education' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        College Name
                      </label>
                      <input
                        type="text"
                        value={educationDetails.collegeName}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            educationDetails: {
                              ...educationDetails,
                              collegeName: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        End Year
                      </label>
                      <input
                        type="text"
                        value={educationDetails.endYear}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            educationDetails: {
                              ...educationDetails,
                              endYear: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={educationDetails.degree}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            educationDetails: {
                              ...educationDetails,
                              degree: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={educationDetails.specialization}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            educationDetails: {
                              ...educationDetails,
                              specialization: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Certifications */}
              {activeEditSection === 'certifications' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Certificates & Licenses
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {certificationsList.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[#2A48C8] text-xs font-semibold"
                        >
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                certifications: (formData.certifications || []).filter(
                                  (c) => c !== cert
                                ),
                              })
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add certificate (e.g. BLS / CPR, Infection Control)"
                        value={newCertInput}
                        onChange={(e) => setNewCertInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCertInput.trim()) {
                            setFormData({
                              ...formData,
                              certifications: [
                                ...(formData.certifications || []),
                                newCertInput.trim(),
                              ],
                            });
                            setNewCertInput('');
                          }
                        }}
                        className="px-3 py-2 bg-[#2A48C8] text-white text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: Resume */}
              {activeEditSection === 'resume' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1E2544]">{formData.resumeName}</p>
                      <p className="text-[11px] text-gray-500">{formData.resumeUploadedAt}</p>
                    </div>
                    <label className="px-3 py-1.5 bg-[#2A48C8] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#1E3A8A]">
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      <span>Upload New</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#2A48C8] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RESUME PREVIEW MODAL ================= */}
      {showResumeViewer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowResumeViewer(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2A48C8]" />
                <h3 className="text-sm font-bold text-[#1E2544]">
                  {profile.resumeName || 'Resume.pdf'}
                </h3>
              </div>
              <button
                onClick={() => setShowResumeViewer(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-3">
              <div className="border-b border-gray-200 pb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#1E2544] text-sm">{profile.name}</p>
                  <p className="text-gray-500 text-[11px]">{profile.phone} • {profile.email}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ATS Score: 92%
                </span>
              </div>

              <div>
                <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
                  Professional Profile
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {profile.aboutMe ||
                    `Certified Nursing professional (GNM, Mona 2027) with 1+ year experience in healthcare patient care, vital signs monitoring, and hospital department assistance at Oxig.`}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
                  Skills & Competencies
                </p>
                <div className="flex flex-wrap gap-1">
                  {skillsList.map((s) => (
                    <span key={s} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] text-gray-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
                  Work Experience
                </p>
                <p className="font-semibold text-gray-800 text-xs">
                  {primaryExperience.jobTitle} • {primaryExperience.companyName}
                </p>
                <p className="text-gray-500 text-[11px]">
                  {primaryExperience.startDate} - Present • {primaryExperience.workType}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('Resume downloaded to device');
                  setShowResumeViewer(false);
                }}
                className="flex-1 py-2.5 bg-[#2A48C8] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </button>
              <button
                onClick={() => {
                  setShowResumeViewer(false);
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
