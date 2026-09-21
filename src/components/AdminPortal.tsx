import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Users,
  Briefcase,
  Building,
  Check,
  X,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Job } from '../types';

interface AdminPortalProps {
  jobs: Job[];
  onVerifyJob: (jobId: string) => void;
  onRemoveJob: (jobId: string) => void;
  onOpenSwitchMode: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  jobs,
  onVerifyJob,
  onRemoveJob,
  onOpenSwitchMode,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div id="admin-portal-view" className="min-h-screen bg-[#0F172A] text-slate-100 pb-24">
      {/* Top Admin Bar */}
      <div className="bg-[#1E1B4B] border-b border-purple-900/60 text-white px-4 py-3 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A855F7]/25 border border-[#A855F7]/40 flex items-center justify-center text-[#C084FC]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-white">
                  Admin Moderation Panel
                </h1>
                <span className="bg-[#A855F7]/30 text-[#C084FC] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A855F7]/40">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-purple-200/70">
                Jobs India • Trust, Verification & Safety
              </p>
            </div>
          </div>

          <button
            id="admin-switch-mode-btn"
            onClick={onOpenSwitchMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700/50 text-xs font-bold transition-colors"
          >
            <span>Switch Mode</span>
            <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="mx-4 mt-3 bg-[#A855F7]/20 border border-[#A855F7]/40 rounded-2xl p-3 flex items-center gap-2.5 text-[#E9D5FF] text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#A855F7] flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Admin Dashboard */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Statistics Tiles */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Total Listings</span>
            <span className="text-lg font-extrabold text-white">{jobs.length}</span>
          </div>
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Verified</span>
            <span className="text-lg font-extrabold text-[#10B981]">
              {jobs.filter((j) => j.aboutCompany.verified).length}
            </span>
          </div>
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Flagged</span>
            <span className="text-lg font-extrabold text-[#EF4444]">0</span>
          </div>
          <div className="bg-[#1E293B] p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">Trust Score</span>
            <span className="text-lg font-extrabold text-[#A855F7]">99.4%</span>
          </div>
        </div>

        {/* Verification Filters */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Job Postings & Recruiter Verification
          </h2>
          <div className="flex gap-1 bg-[#1E293B] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeFilter === 'all' ? 'bg-[#A855F7] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setActiveFilter('verified')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeFilter === 'verified' ? 'bg-[#A855F7] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified
            </button>
          </div>
        </div>

        {/* Moderation List */}
        <div className="space-y-2.5">
          {jobs
            .filter((j) => (activeFilter === 'verified' ? j.aboutCompany.verified : true))
            .map((job) => (
              <div
                key={job.id}
                className="bg-[#1E293B] p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white">{job.title}</h3>
                      {job.aboutCompany.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {job.company} • {job.locality}, {job.location}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.aboutCompany.verified
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    }`}
                  >
                    {job.aboutCompany.verified ? 'Verified Employer' : 'Pending Review'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-2">
                  <span className="text-[#38BDF8] font-semibold">{job.salary}</span>
                  <div className="flex items-center gap-2">
                    {!job.aboutCompany.verified && (
                      <button
                        onClick={() => {
                          onVerifyJob(job.id);
                          notify(`Approved and marked "${job.company}" as verified!`);
                        }}
                        className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verify & Approve</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onRemoveJob(job.id);
                        notify(`Removed listing "${job.title}".`);
                      }}
                      className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Take Down</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
