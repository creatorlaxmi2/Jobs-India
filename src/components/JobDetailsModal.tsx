import React from 'react';
import {
  X,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  CheckCircle2,
  Navigation,
  Heart,
  Share2,
  Building2,
  Star,
  Users,
  ShieldCheck,
  Check,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  UserCheck,
  BadgeCheck,
} from 'lucide-react';
import { Job } from '../types';
import { getJobRecruiter } from '../data/mockJobs';

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
  onShare: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onApply,
  onShare,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div
      id="job-details-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top App Bar with Back/Close, Share & Save */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
          <button
            id="close-job-details-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-gray-400">Job Details</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onShare(job)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                isSaved ? 'text-[#E83B45]' : 'text-gray-600'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-[#E83B45] text-[#E83B45]' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Header Card */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-sm flex-shrink-0"
                style={{ backgroundColor: job.companyLogoBg }}
              >
                {job.companyLogoText}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  {job.isUrgent && (
                    <span className="bg-[#FEF2F2] text-[#E83B45] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#FEE2E2]">
                      Urgent Hiring
                    </span>
                  )}
                  {job.isNew && (
                    <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#DBEAFE]">
                      NEW
                    </span>
                  )}
                  {job.isWorkFromHome && (
                    <span className="bg-[#F5F3FF] text-[#6B3FC7] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#EDE9FE]">
                      Work From Home
                    </span>
                  )}
                </div>

                <h1 className="text-lg sm:text-xl font-black text-[#1E2544] leading-snug">
                  {job.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-semibold text-gray-700">
                    {job.company}
                  </span>
                  {job.aboutCompany.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35A853]" />
                  )}
                </div>
              </div>
            </div>

            {/* Salary Banner */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#EEF2FF] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">
                  Monthly In-Hand Salary
                </span>
                <span className="text-base font-black text-[#1E2544]">
                  {job.salary}
                </span>
              </div>
              <span className="text-xs font-bold text-[#4055B8] bg-[#EEF2FF] px-2.5 py-1 rounded-lg">
                {job.jobType}
              </span>
            </div>

            {/* Key Meta Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Experience
                  </span>
                  <span className="font-bold text-[#1E2544]">{job.experience}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Location & Distance
                  </span>
                  <span className="font-bold text-[#1E2544] truncate block max-w-[120px]">
                    {job.locality} ({job.distance})
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Posted Timing
                  </span>
                  <span className="font-bold text-[#1E2544]">{job.postedTime}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-xl flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Open Vacancies
                  </span>
                  <span className="font-bold text-[#1E2544]">
                    {job.vacancies} openings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#1E2544]">Job Description</h3>
            <p className="text-xs text-gray-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
              {job.description}
            </p>
          </section>

          {/* Responsibilities */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#1E2544]">
              Responsibilities & Duties
            </h3>
            <ul className="space-y-1.5">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-3.5 h-3.5 text-[#35A853] flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Required Skills */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#1E2544]">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#EEF2FF] text-[#4055B8] font-bold text-xs px-3 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-[#1E2544]">Perks & Benefits</h3>
            <div className="grid grid-cols-2 gap-2">
              {job.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="bg-[#F0FDF4] text-[#166534] p-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#DCFCE7]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#35A853]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* About Company */}
          <section className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#1E2544]">About Employer</h3>
            <div className="bg-gray-50 p-3.5 rounded-2xl space-y-2 border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#1E2544]">
                  {job.company}
                </h4>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{job.aboutCompany.rating}</span>
                  <span className="text-gray-400 text-[10px]">
                    ({job.aboutCompany.reviewsCount})
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600">
                Industry: <span className="font-semibold">{job.aboutCompany.industry}</span> •{' '}
                {job.aboutCompany.employees}
              </p>
              <p className="text-xs text-gray-500">{job.aboutCompany.address}</p>
            </div>
          </section>

          {/* Verified Recruiter & HR Contact Details */}
          {(() => {
            const recruiter = getJobRecruiter(job);
            return (
              <section className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1E2544] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#4055B8]" />
                    <span>Verified Recruiter Contact</span>
                  </h3>
                  <span className="bg-[#ECFDF5] text-[#059669] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A7F3D0] flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    <span>KYC Verified</span>
                  </span>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#EEF2FF] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#1E2544]">{recruiter.name}</h4>
                      <p className="text-xs text-gray-500">{recruiter.designation}</p>
                      <p className="text-[11px] text-[#4055B8] font-semibold">{job.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-200/60">
                    {/* Recruiter Mobile No with Call & WhatsApp buttons */}
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-1 shadow-2xs">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block font-medium">Recruiter Mobile</span>
                        <span className="font-bold text-gray-900 tracking-wide block truncate">
                          {recruiter.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={`tel:${recruiter.phone.replace(/[^0-9+]/g, '')}`}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="Call Recruiter"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${recruiter.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp Recruiter"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Recruiter Email ID with Email button */}
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-1 shadow-2xs">
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-400 block font-medium">Official Work Email</span>
                        <span className="font-semibold text-gray-900 text-xs block truncate">
                          {recruiter.email}
                        </span>
                      </div>
                      <a
                        href={`mailto:${recruiter.email}?subject=Inquiry%20regarding%20${encodeURIComponent(job.title)}%20role`}
                        className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0"
                        title="Email Recruiter"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 text-center">
                    Verified through Jobs India Employer Trust & Safety Network
                  </p>
                </div>
              </section>
            );
          })()}
        </div>

        {/* BOTTOM STICKY BUTTONS ("Save Job" and "Apply Now") */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-3 px-4 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button
            id="modal-save-job-btn"
            onClick={() => onToggleSave(job.id)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              isSaved
                ? 'border-[#E83B45] text-[#E83B45] bg-[#FEF2F2]'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isSaved ? 'fill-[#E83B45] text-[#E83B45]' : ''}`}
            />
            <span>{isSaved ? 'Saved' : 'Save Job'}</span>
          </button>

          <button
            id="modal-apply-now-btn"
            onClick={() => onApply(job)}
            className="flex-1 py-3 px-5 rounded-2xl text-white text-sm font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 100%)',
            }}
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
