import React from 'react';
import {
  MapPin,
  Briefcase,
  Clock,
  Heart,
  CheckCircle2,
  Navigation,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { Job } from '../types';
import { getJobRecruiter } from '../data/mockJobs';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
  onSelectJob: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onApply,
  onSelectJob,
}) => {
  return (
    <div
      id={`job-card-${job.id}`}
      className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(64,85,184,0.08)] transition-all relative overflow-hidden"
    >
      {/* Top row: Badges and Save heart */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {job.isUrgent && (
            <span className="bg-[#FEF2F2] text-[#E83B45] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#FEE2E2] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E83B45] animate-ping" />
              Urgent Hiring
            </span>
          )}
          {job.isNew && (
            <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#DBEAFE]">
              NEW
            </span>
          )}
          {job.isWorkFromHome && (
            <span className="bg-[#F5F3FF] text-[#6B3FC7] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#EDE9FE]">
              Work From Home
            </span>
          )}
        </div>

        <button
          id={`save-job-btn-${job.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          title={isSaved ? 'Remove from saved' : 'Save job'}
          className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
            isSaved ? 'text-[#E83B45]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E83B45] text-[#E83B45]' : ''}`} />
        </button>
      </div>

      {/* Main Job Details (Clickable to open details) */}
      <div
        className="cursor-pointer group"
        onClick={() => onSelectJob(job)}
      >
        <div className="flex items-start gap-3">
          {/* Company Logo / Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs flex-shrink-0"
            style={{ backgroundColor: job.companyLogoBg }}
          >
            {job.companyLogoText}
          </div>

          {/* Title & Company */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1E2544] text-base group-hover:text-[#4055B8] transition-colors leading-tight line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs font-semibold text-[#525B6C] truncate max-w-[170px]">
                {job.company}
              </p>
              {job.aboutCompany.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35A853] flex-shrink-0" />
              )}
            </div>
            {/* HR Recruiter Info */}
            {(() => {
              const recruiter = getJobRecruiter(job);
              return (
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
                  <UserCheck className="w-3 h-3 text-[#4055B8] flex-shrink-0" />
                  <span className="font-medium text-gray-700 truncate max-w-[130px]">
                    HR: {recruiter.name}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold truncate">
                    {recruiter.phone}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Salary Highlight */}
        <div className="mt-3 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-[#1E2544] tracking-tight">
              {job.salary}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#4055B8] bg-[#EEF2FF] px-2 py-0.5 rounded-md">
            {job.jobType}
          </span>
        </div>

        {/* Info Grid: Experience, Location & Distance */}
        <div className="mt-2.5 flex items-center gap-3 text-xs text-[#687386] flex-wrap">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate max-w-[110px]">{job.locality || job.location}</span>
          </div>
          {job.distance && job.distance !== 'Remote' && (
            <div className="flex items-center gap-1 text-[#35A853] font-medium">
              <Navigation className="w-3 h-3" />
              <span>{job.distance}</span>
            </div>
          )}
        </div>

        {/* Key skills pills */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden flex-wrap">
          {job.requiredSkills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 3 && (
            <span className="text-[10px] text-gray-400 font-medium">
              +{job.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: Posted time & Action Buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{job.postedTime}</span>
          <span className="mx-1">•</span>
          <span>{job.applicantsCount} applied</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-details-btn-${job.id}`}
            onClick={() => onSelectJob(job)}
            className="text-xs font-bold text-[#4055B8] hover:text-[#6B3FC7] px-2 py-1.5 transition-colors"
          >
            Details
          </button>
          <button
            id={`quick-apply-btn-${job.id}`}
            onClick={() => onApply(job)}
            className="text-xs font-bold text-white px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 100%)',
            }}
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
