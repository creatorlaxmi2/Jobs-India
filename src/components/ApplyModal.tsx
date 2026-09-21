import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Phone,
  User,
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, UserProfile } from '../types';

interface ApplyModalProps {
  job: Job | null;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (
    job: Job,
    screeningData: { noticePeriod: string; customResumeName?: string }
  ) => void;
  onViewApplications: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  profile,
  isOpen,
  onClose,
  onSubmitApplication,
  onViewApplications,
}) => {
  const [step, setStep] = useState<'review' | 'success'>('review');
  const [noticePeriod, setNoticePeriod] = useState('Immediate / Under 15 Days');
  const [customResume, setCustomResume] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomResume(file.name);
    }
  };

  const handleConfirmApplication = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onSubmitApplication(job, {
        noticePeriod,
        customResumeName: customResume || profile.resumeName,
      });
    }, 600);
  };

  const handleCloseAll = () => {
    setStep('review');
    onClose();
  };

  return (
    <div
      id="apply-modal-wrapper"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
        {step === 'review' ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4055B8]">
                  Step 1 of 1 • Fast Apply
                </span>
                <h3 className="text-base font-bold text-[#1E2544]">
                  Confirm Application
                </h3>
              </div>
              <button
                onClick={handleCloseAll}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Job Quick Summary */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                style={{ backgroundColor: job.companyLogoBg }}
              >
                {job.companyLogoText}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#1E2544] truncate">
                  {job.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate">
                  {job.company} • {job.salary}
                </p>
              </div>
            </div>

            {/* 1. Profile Completeness Verification */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E2544]">
                  1. Profile Verification
                </label>
                <span className="text-[11px] font-bold text-[#35A853] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified ({profile.completionPercentage}%)</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Candidate:</span>
                  <span className="font-bold text-gray-800">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Contact Phone:</span>
                  <span className="font-bold text-gray-800">{profile.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Location:</span>
                  <span className="font-bold text-gray-800">
                    {profile.locality}, {profile.city}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Resume Selection / Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E2544] block">
                2. Resume for Employer
              </label>

              <div className="bg-[#FAF5FF] p-3 rounded-xl border border-[#EDE9FE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6B3FC7]" />
                  <div className="text-xs">
                    <p className="font-bold text-[#4C1D95] truncate max-w-[170px]">
                      {customResume || profile.resumeName}
                    </p>
                    <p className="text-[10px] text-gray-400">ATS Match: 92%</p>
                  </div>
                </div>

                <label className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD6FE] text-[11px] font-bold text-[#6B3FC7] hover:bg-purple-50 cursor-pointer shadow-2xs">
                  <span>Change File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 3. Quick Screening: Notice Period */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E2544] block">
                3. When can you join?
              </label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium outline-hidden focus:border-[#4055B8]"
              >
                <option value="Immediate / Under 15 Days">Immediate / Under 15 Days</option>
                <option value="15 to 30 Days">15 to 30 Days</option>
                <option value="1 Month Notice">1 Month Notice</option>
              </select>
            </div>

            {/* Zero Charge Guarantee Callout */}
            <div className="bg-[#E8F8EE] p-2.5 rounded-xl border border-[#C6F6D5] flex items-center gap-2 text-[11px] text-[#166534]">
              <ShieldCheck className="w-4 h-4 text-[#35A853] flex-shrink-0" />
              <span>
                100% Free Application. Jobs India never charges candidates for interviews.
              </span>
            </div>

            {/* Confirm Submit Button */}
            <div className="pt-2">
              <button
                id="submit-application-btn"
                disabled={isSubmitting}
                onClick={handleConfirmApplication}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                style={{
                  background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 100%)',
                }}
              >
                {isSubmitting ? (
                  <span>Submitting to HR...</span>
                ) : (
                  <>
                    <span>Confirm & Send to HR</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div
            id="application-success-view"
            className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-200"
          >
            <div className="w-20 h-20 rounded-full bg-[#E8F8EE] text-[#35A853] flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-10 h-10 stroke-[3px]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#1E2544]">
                Application Submitted!
              </h3>
              <p className="text-xs text-[#687386] max-w-xs mx-auto leading-relaxed">
                The employer will review your application. Verified HR representatives typically call within 24 to 48 hours.
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Applied Position:</span>
                <span className="font-bold text-[#1E2544]">{job.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Company:</span>
                <span className="font-bold text-[#4055B8]">{job.company}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Under Review by HR
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                id="view-applications-success-btn"
                onClick={() => {
                  handleCloseAll();
                  onViewApplications();
                }}
                className="w-full py-3 rounded-2xl bg-[#4055B8] text-white text-xs font-bold shadow-md hover:bg-[#34459B] transition-colors"
              >
                Track My Applications
              </button>

              <button
                onClick={handleCloseAll}
                className="w-full py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Explore More Jobs in Patna
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
