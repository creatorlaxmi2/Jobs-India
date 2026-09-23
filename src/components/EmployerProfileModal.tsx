import React, { useState } from 'react';
import {
  X,
  Building2,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Sparkles,
  Save,
  Globe,
  FileText,
  Briefcase,
  LogIn,
  RotateCcw,
  Check,
} from 'lucide-react';
import { EmployerProfile } from '../types';
import {
  calculateProfileCompletion,
  getCompanyInitials,
  EMPLOYER_PRESET_PROFILES,
} from '../data/employerProfiles';

interface EmployerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EmployerProfile;
  onUpdateProfile: (updated: EmployerProfile) => void;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  onToast: (msg: string) => void;
}

export const EmployerProfileModal: React.FC<EmployerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenAuth,
  onToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployerProfile>(profile);
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc'>('profile');

  // Keep form in sync when modal opens or profile changes
  React.useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const currentInitials = getCompanyInitials(formData.companyName);
  const currentCompletion = calculateProfileCompletion(formData);

  const handleInputChange = (field: keyof EmployerProfile, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'companyName') {
        updated.companyInitials = getCompanyInitials(value);
      }
      return updated;
    });
  };

  const handleApplyPreset = (presetProfile: EmployerProfile) => {
    setFormData(presetProfile);
    onToast(`Automated data loaded: ${presetProfile.companyName}`);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.companyName.trim()) {
      onToast('⚠️ Please enter Company Name');
      return;
    }
    if (!formData.hrName.trim()) {
      onToast('⚠️ Please enter HR In-Charge Name');
      return;
    }

    const updated: EmployerProfile = {
      ...formData,
      companyName: formData.companyName.trim(),
      companyInitials: getCompanyInitials(formData.companyName),
      hubName: formData.hubName.trim() || 'Main Hub',
      hrName: formData.hrName.trim(),
      designation: formData.designation.trim() || 'Verified HR',
      workEmail: formData.workEmail.trim(),
      phone: formData.phone.trim(),
      officeAddress: formData.officeAddress.trim(),
      city: formData.city.trim() || 'Patna',
      state: formData.state.trim() || 'Bihar',
      pincode: formData.pincode.trim() || '800001',
      cinNumber: formData.cinNumber?.trim(),
      gstin: formData.gstin?.trim(),
      completionPercent: currentCompletion,
    };

    onUpdateProfile(updated);
    setIsEditing(false);
    onToast('🎉 Company Profile & HR data updated successfully!');
  };

  return (
    <div
      id="employer-profile-edit-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-2xs animate-in fade-in select-none"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* ======================================================================= */}
        {/* MODAL HEADER */}
        {/* ======================================================================= */}
        <div className="bg-[#0047AB] text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Dynamic Company Initials Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-lg text-white shadow-inner">
              {currentInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white">
                  {formData.companyName || 'Company Profile'}
                </h3>
                {formData.isVerified && (
                  <span className="bg-emerald-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-900" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {formData.hubName} • {formData.designation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!isEditing ? (
              <button
                type="button"
                id="edit-employer-profile-btn"
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Edit / Update Company Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-white transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PROFILE COMPLETION STRIP */}
        {/* ======================================================================= */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Profile Completion:</span>
            <div className="w-24 sm:w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#22C55E] h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentCompletion}%` }}
              />
            </div>
            <span className="font-black text-[#0047AB]">{currentCompletion}%</span>
          </div>

          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-800">100% Free Verified Listing</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* QUICK AUTOMATE PRESETS BAR */}
        {/* ======================================================================= */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 flex-shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-[#0047AB]" />
            Automate Data:
          </span>
          {EMPLOYER_PRESET_PROFILES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.profile)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                formData.companyName === preset.profile.companyName
                  ? 'bg-[#0047AB] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
              }`}
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* ======================================================================= */}
        {/* SCROLLABLE BODY */}
        {/* ======================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs text-slate-700 space-y-4">
          {isEditing ? (
            /* ================================================================= */
            /* 1. EDIT PROFILE FORM */
            /* ================================================================= */
            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-900">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="font-bold text-[11px]">
                    Editing Company Profile & Contact details
                  </span>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold">Changes sync instantly</span>
              </div>

              {/* Company Details */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Company / Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="employer-edit-company-name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g. Apollo Diagnostics"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB]"
                  />
                </div>
              </div>

              {/* Hub / Branch & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Hub / Branch / Cluster *
                  </label>
                  <input
                    type="text"
                    value={formData.hubName}
                    onChange={(e) => handleInputChange('hubName', e.target.value)}
                    placeholder="e.g. Patna Hub or Bailey Road"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g. Healthcare & Diagnostics"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              {/* HR Recruiter Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    HR Recruiter In-Charge *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="employer-edit-hr-name"
                      value={formData.hrName}
                      onChange={(e) => handleInputChange('hrName', e.target.value)}
                      placeholder="e.g. Dr. Alok Verma"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    HR Designation *
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="e.g. Verified HR / Talent Lead"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              {/* Work Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Official Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.workEmail}
                      onChange={(e) => handleInputChange('workEmail', e.target.value)}
                      placeholder="hr@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Official Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98350 12845"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                    />
                  </div>
                </div>
              </div>

              {/* Office Address & City */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Office Locality & Street Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <textarea
                    rows={2}
                    value={formData.officeAddress}
                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                    placeholder="Plot / Building, Locality, Area"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB] resize-none"
                  />
                </div>
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Patna"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Bihar"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="800006"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              {/* CIN & GSTIN Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    CIN / Company Reg No.
                  </label>
                  <input
                    type="text"
                    value={formData.cinNumber || ''}
                    onChange={(e) => handleInputChange('cinNumber', e.target.value)}
                    placeholder="CIN-U85110DL2004PLC128314"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.gstin || ''}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="10AAACA1234F1Z5"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  id="save-employer-profile-btn"
                  className="flex-1 py-2.5 bg-[#0047AB] hover:bg-[#003882] active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Update Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* ================================================================= */
            /* 2. SUMMARY / VIEW PROFILE */
            /* ================================================================= */
            <div className="space-y-3.5">
              {/* Main Badge Card */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-br from-blue-50/90 to-indigo-50/50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {formData.companyName}
                    </h4>
                    <p className="text-slate-600 text-xs font-medium">
                      {formData.hubName} • {formData.industry || 'Registered Business'}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Employer
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-600">
                  {formData.cinNumber && (
                    <span>
                      <strong className="text-slate-700">CIN:</strong> {formData.cinNumber}
                    </span>
                  )}
                  {formData.gstin && (
                    <span>
                      <strong className="text-slate-700">GSTIN:</strong> {formData.gstin}
                    </span>
                  )}
                </div>
              </div>

              {/* Recruiter Details Card */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800">Recruiter In-Charge</span>
                  <span className="text-[11px] font-extrabold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-md">
                    {formData.designation}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-slate-900">{formData.hrName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{formData.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0047AB] flex-shrink-0" />
                    <span>{formData.workEmail}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>
                      {formData.officeAddress}, {formData.city}, {formData.state} - {formData.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account / Login Options */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">HR Authentication & Security</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                    Active Session
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Need to change credentials or login with another company recruiter account?
                </p>

                {onOpenAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth('login');
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#0047AB]" />
                    <span>Switch or Log In with another HR Account</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* FOOTER */}
        {/* ======================================================================= */}
        {!isEditing && (
          <div className="p-3.5 sm:px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#0047AB] hover:bg-[#003882] text-white font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Company Profile</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
