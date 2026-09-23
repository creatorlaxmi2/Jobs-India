import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Calendar,
  XCircle,
  Phone,
  MessageCircle,
  MessageSquare,
  FileText,
  Sparkles,
  Users,
  ChevronDown,
  Filter,
  Check,
  UserCheck,
  Building2,
  MapPin,
  Clock,
  ArrowUpDown,
  Send,
} from 'lucide-react';
import { Application, ApplicationStatus, Job } from '../types';
import { QuickReplyModal, TargetCandidateInfo } from './QuickReplyModal';

interface BulkApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  jobs: { id: string; title: string; location?: string }[];
  selectedJobId?: string | null;
  initialStatusFilter?: 'All' | ApplicationStatus;
  onBulkUpdateStatus: (
    appIds: string[],
    newStatus: ApplicationStatus,
    notificationData?: { title: string; message: string }
  ) => void;
  onSingleUpdateStatus: (
    appId: string,
    newStatus: ApplicationStatus,
    notificationData?: { title: string; message: string }
  ) => void;
  onToast: (msg: string) => void;
}

export const BulkApplicationsModal: React.FC<BulkApplicationsModalProps> = ({
  isOpen,
  onClose,
  applications,
  jobs,
  selectedJobId: initialSelectedJobId = null,
  initialStatusFilter = 'All',
  onBulkUpdateStatus,
  onSingleUpdateStatus,
  onToast,
}) => {
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>(
    initialSelectedJobId || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());

  // Applications scoped to current selected job
  const jobScopedApps = useMemo(() => {
    if (selectedJobFilter === 'all') return applications;
    return applications.filter((a) => a.jobId === selectedJobFilter);
  }, [applications, selectedJobFilter]);

  // Status breakdown counts for the active job scope
  const statusCounts = useMemo(() => {
    const total = jobScopedApps.length;
    const applied = jobScopedApps.filter((a) => a.status === 'Applied').length;
    const shortlisted = jobScopedApps.filter((a) => a.status === 'Shortlisted').length;
    const interviewing = jobScopedApps.filter(
      (a) => a.status === 'Interview' || a.status === 'Interviewing'
    ).length;
    const rejected = jobScopedApps.filter((a) => a.status === 'Rejected').length;
    return { total, applied, shortlisted, interviewing, rejected };
  }, [jobScopedApps]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Job filter
      if (selectedJobFilter !== 'all' && app.jobId !== selectedJobFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Interviewing' || statusFilter === 'Interview') {
          if (app.status !== 'Interview' && app.status !== 'Interviewing') return false;
        } else if (app.status !== statusFilter) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candName = (app.candidateName || '').toLowerCase();
        const role = (app.jobTitle || '').toLowerCase();
        const phone = (app.candidatePhone || '').toLowerCase();
        const skills = (app.candidateSkills || []).join(' ').toLowerCase();
        const qual = (app.candidateQualification || '').toLowerCase();

        return (
          candName.includes(q) ||
          role.includes(q) ||
          phone.includes(q) ||
          skills.includes(q) ||
          qual.includes(q)
        );
      }

      return true;
    });
  }, [applications, selectedJobFilter, statusFilter, searchQuery]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedAppIds.size === filteredApps.length && filteredApps.length > 0) {
      setSelectedAppIds(new Set());
    } else {
      setSelectedAppIds(new Set(filteredApps.map((a) => a.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Quick Reply modal state
  const [quickReplyState, setQuickReplyState] = useState<{
    isOpen: boolean;
    actionType: 'Shortlisted' | 'Rejected' | 'Interviewing';
    targetCandidates: TargetCandidateInfo[];
  }>({
    isOpen: false,
    actionType: 'Shortlisted',
    targetCandidates: [],
  });

  // Bulk actions trigger with Quick Reply
  const handleTriggerBulkAction = (actionType: 'Shortlisted' | 'Rejected' | 'Interviewing') => {
    if (selectedAppIds.size === 0) return;
    const candidates: TargetCandidateInfo[] = applications
      .filter((a) => selectedAppIds.has(a.id))
      .map((a) => ({
        id: a.id,
        name: a.candidateName || 'Candidate',
        jobTitle: a.jobTitle,
        company: a.company,
        location: a.location,
        phone: a.candidatePhone,
      }));

    setQuickReplyState({
      isOpen: true,
      actionType,
      targetCandidates: candidates,
    });
  };

  // Single candidate action trigger with Quick Reply
  const handleTriggerSingleAction = (
    app: Application,
    actionType: 'Shortlisted' | 'Rejected' | 'Interviewing'
  ) => {
    setQuickReplyState({
      isOpen: true,
      actionType,
      targetCandidates: [
        {
          id: app.id,
          name: app.candidateName || 'Candidate',
          jobTitle: app.jobTitle,
          company: app.company,
          location: app.location,
          phone: app.candidatePhone,
        },
      ],
    });
  };

  // Confirm Quick Reply handler
  const handleConfirmQuickReply = (payload: {
    status: ApplicationStatus;
    sendNotification: boolean;
    templateTitle: string;
    subject: string;
    message: string;
  }) => {
    const ids = quickReplyState.targetCandidates.map((c) => c.id);
    const notifData = payload.sendNotification
      ? { title: payload.subject, message: payload.message }
      : undefined;

    if (ids.length === 1) {
      onSingleUpdateStatus(ids[0], payload.status, notifData);
      onToast(
        payload.sendNotification
          ? `Candidate moved to ${payload.status} & notified via Quick Reply!`
          : `Candidate status updated to ${payload.status}.`
      );
    } else {
      onBulkUpdateStatus(ids, payload.status, notifData);
      onToast(
        payload.sendNotification
          ? `🎉 ${ids.length} candidates moved to ${payload.status} and notified via Quick Reply in 1 click!`
          : `${ids.length} candidates marked as ${payload.status}.`
      );
    }

    setSelectedAppIds(new Set());
    setQuickReplyState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!isOpen) return null;

  const isAllSelected =
    filteredApps.length > 0 && selectedAppIds.size === filteredApps.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[92vh] max-h-[850px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* ======================================================================= */}
        {/* 1. TOP HEADER */}
        {/* ======================================================================= */}
        <div className="bg-[#0047AB] text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Candidate Applications
              </h2>
              <span className="bg-emerald-400 text-emerald-950 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                Bulk Shortlist
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Select multiple candidates to shortlist or invite for interview in one click.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 active:scale-95 text-white transition-all -mr-1"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================================= */}
        {/* 2. CONTROLS: JOB SELECTOR, STATUS FILTER DROPDOWN & SEARCH */}
        {/* ======================================================================= */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5 flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1. Job selector */}
            <div>
              <label
                htmlFor="applications-job-filter-select"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Job Posting
              </label>
              <div className="relative">
                <select
                  id="applications-job-filter-select"
                  value={selectedJobFilter}
                  onChange={(e) => {
                    setSelectedJobFilter(e.target.value);
                    setSelectedAppIds(new Set());
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 appearance-none focus:outline-hidden focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB] shadow-2xs pr-8"
                >
                  <option value="all">All Job Postings ({applications.length})</option>
                  {jobs.map((j) => {
                    const count = applications.filter((a) => a.jobId === j.id).length;
                    return (
                      <option key={j.id} value={j.id}>
                        {j.title} ({count})
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 2. Status Filter Dropdown (Requested Feature) */}
            <div>
              <label
                htmlFor="applications-status-filter-select"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between"
              >
                <span className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#0047AB]" />
                  <span>Status Filter</span>
                </span>
                {statusFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('All');
                      setSelectedAppIds(new Set());
                    }}
                    className="text-[10px] text-[#0047AB] font-bold hover:underline lowercase"
                  >
                    reset
                  </button>
                )}
              </label>
              <div className="relative">
                <select
                  id="applications-status-filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setSelectedAppIds(new Set());
                  }}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-extrabold appearance-none focus:outline-hidden focus:ring-2 shadow-2xs pr-8 transition-all cursor-pointer ${
                    statusFilter === 'Applied'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 focus:ring-blue-200'
                      : statusFilter === 'Shortlisted'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 focus:ring-emerald-200'
                      : statusFilter === 'Interviewing' || statusFilter === 'Interview'
                      ? 'bg-purple-50 border-purple-400 text-purple-900 focus:ring-purple-200'
                      : statusFilter === 'Rejected'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 focus:ring-rose-200'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-[#0047AB] focus:ring-[#0047AB]/20'
                  }`}
                >
                  <option value="All">All Statuses ({statusCounts.total})</option>
                  <option value="Applied">📌 Applied ({statusCounts.applied})</option>
                  <option value="Shortlisted">⭐ Shortlisted ({statusCounts.shortlisted})</option>
                  <option value="Interviewing">🗓️ Interviewing ({statusCounts.interviewing})</option>
                  <option value="Rejected">✕ Rejected ({statusCounts.rejected})</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 3. Search Input */}
            <div>
              <label
                htmlFor="applications-search-input"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Search Candidates
              </label>
              <div className="relative">
                <input
                  id="applications-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, skills, phone..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-7 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB] shadow-2xs"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Pill Bar (Synchronized with dropdown) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
            {(
              [
                { key: 'All', label: 'All', count: statusCounts.total },
                { key: 'Applied', label: 'Applied', count: statusCounts.applied },
                { key: 'Shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
                { key: 'Interviewing', label: 'Interviewing', count: statusCounts.interviewing },
                { key: 'Rejected', label: 'Rejected', count: statusCounts.rejected },
              ] as const
            ).map((tab) => {
              const isSelected =
                statusFilter === tab.key ||
                (tab.key === 'Interviewing' && statusFilter === 'Interview');

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key as any);
                    setSelectedAppIds(new Set());
                  }}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0047AB] text-white shadow-2xs ring-2 ring-[#0047AB]/20'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active status filter banner if filtered */}
          {statusFilter !== 'All' && (
            <div className="flex items-center justify-between text-[11px] bg-blue-50/80 border border-blue-200/80 text-blue-900 px-3 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3 h-3 text-[#0047AB]" />
                <span>
                  Filtering by <strong>'{statusFilter}'</strong> candidates (
                  <strong>{filteredApps.length}</strong> matching)
                </span>
              </div>
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setSelectedAppIds(new Set());
                }}
                className="font-bold text-[#0047AB] hover:underline flex items-center gap-0.5"
              >
                <span>Clear</span>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 3. SELECTION BAR (Select all & bulk count) */}
        {/* ======================================================================= */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-[#0047AB] focus:ring-[#0047AB] cursor-pointer"
              />
              <span>
                {selectedAppIds.size > 0
                  ? `Selected (${selectedAppIds.size} of ${filteredApps.length})`
                  : `Select All (${filteredApps.length})`}
              </span>
            </label>
          </div>

          {selectedAppIds.size > 0 && (
            <button
              onClick={() => setSelectedAppIds(new Set())}
              className="text-[#0047AB] font-bold text-xs hover:underline"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 4. APPLICATIONS LIST */}
        {/* ======================================================================= */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
          {filteredApps.length === 0 ? (
            <div className="text-center py-14 space-y-3 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-700 text-sm">No applications found</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Try changing your status tab or search filter.
                </p>
              </div>
              {(searchQuery || statusFilter !== 'All' || selectedJobFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setSelectedJobFilter('all');
                  }}
                  className="px-4 py-1.5 bg-[#0047AB] text-white rounded-lg text-xs font-bold shadow-2xs"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredApps.map((app) => {
              const isChecked = selectedAppIds.has(app.id);
              const displayName =
                app.candidateName ||
                (app.id === 'app-1'
                  ? 'Aman Kumar Verma'
                  : app.id === 'app-2'
                  ? 'Rakesh Kumar Sharma'
                  : app.id === 'app-3'
                  ? 'Pooja Kumari'
                  : 'Candidate Applicant');

              const phone = app.candidatePhone || '+91 98712 34567';
              const experience = app.candidateExperience || '2 Years Exp';
              const qualification = app.candidateQualification || 'Graduate / Diploma';
              const skills = app.candidateSkills || ['Patient Care', 'Communication', 'Punctuality'];
              const matchScore = app.matchScore || '94%';

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-2xl border transition-all p-3.5 space-y-3 shadow-2xs ${
                    isChecked
                      ? 'border-[#0047AB] ring-2 ring-[#0047AB]/20 bg-blue-50/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top row: Checkbox, Name, Status Badge & Match */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelectOne(app.id)}
                      className="w-4 h-4 mt-1 rounded text-[#0047AB] focus:ring-[#0047AB] cursor-pointer flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                            {displayName}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Applied for <strong className="text-slate-700">{app.jobTitle}</strong> • {app.appliedDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Match score */}
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{matchScore}</span>
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              app.status === 'Shortlisted'
                                ? 'bg-emerald-600 text-white'
                                : app.status === 'Interview' || app.status === 'Interviewing'
                                ? 'bg-[#5063BD] text-white'
                                : app.status === 'Rejected'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>

                      {/* Candidate specs */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">{experience}</span>
                        <span>•</span>
                        <span>{qualification}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{app.resumeName || 'Resume_Verified.pdf'}</span>
                        </span>
                      </div>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* Direct Contact links */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${phone}`}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          displayName
                        )},%20we%20reviewed%20your%20application%20for%20${encodeURIComponent(
                          app.jobTitle
                        )}%20on%20Jobs%20India.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Quick 1-click status actions & Quick Reply for individual candidate */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleTriggerSingleAction(app, 'Shortlisted')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#0047AB] rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Send Quick Reply Template notification"
                      >
                        <MessageSquare className="w-3 h-3 text-[#0047AB]" />
                        <span>Quick Reply</span>
                      </button>

                      {app.status !== 'Shortlisted' && (
                        <button
                          type="button"
                          onClick={() => handleTriggerSingleAction(app, 'Shortlisted')}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Shortlist</span>
                        </button>
                      )}

                      {app.status !== 'Interview' && app.status !== 'Interviewing' && (
                        <button
                          type="button"
                          onClick={() => handleTriggerSingleAction(app, 'Interviewing')}
                          className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-[#0047AB] rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Interview</span>
                        </button>
                      )}

                      {app.status !== 'Rejected' && (
                        <button
                          type="button"
                          onClick={() => handleTriggerSingleAction(app, 'Rejected')}
                          className="px-2 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ======================================================================= */}
        {/* 5. FLOATING / STICKY BULK ACTION BAR (When 1+ candidates selected) */}
        {/* ======================================================================= */}
        {selectedAppIds.size > 0 ? (
          <div className="bg-[#141A28] text-white p-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 shadow-2xl animate-in slide-in-from-bottom duration-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#0047AB] flex items-center justify-center font-extrabold text-xs text-white">
                {selectedAppIds.size}
              </span>
              <div>
                <p className="font-extrabold text-xs sm:text-sm leading-tight text-white">
                  {selectedAppIds.size} Candidate{selectedAppIds.size > 1 ? 's' : ''} Selected
                </p>
                <p className="text-[10px] text-slate-300">Choose action & Quick Reply template</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Button 1: Bulk Shortlist with Quick Reply */}
              <button
                id="bulk-shortlist-btn"
                onClick={() => handleTriggerBulkAction('Shortlisted')}
                className="px-4 py-2 bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Shortlist ({selectedAppIds.size})</span>
              </button>

              {/* Button 2: Bulk Interview with Quick Reply */}
              <button
                id="bulk-interview-btn"
                onClick={() => handleTriggerBulkAction('Interviewing')}
                className="px-4 py-2 bg-[#0047AB] hover:bg-[#003882] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Interviewing ({selectedAppIds.size})</span>
              </button>

              {/* Button 3: Bulk Reject with Quick Reply */}
              <button
                id="bulk-reject-btn"
                onClick={() => handleTriggerBulkAction('Rejected')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reject selected candidates with automated template"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject ({selectedAppIds.size})</span>
              </button>

              {/* Cancel selection */}
              <button
                onClick={() => setSelectedAppIds(new Set())}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
                title="Deselect All"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Bottom footer bar when no selection is made */
          <div className="bg-white border-t border-slate-200 p-3 px-4 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
            <span>
              Showing <strong>{filteredApps.length}</strong> of {applications.length} applications
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. QUICK REPLY & IN-APP NOTIFICATION TEMPLATES MODAL */}
      {/* ========================================================================= */}
      <QuickReplyModal
        isOpen={quickReplyState.isOpen}
        onClose={() => setQuickReplyState((prev) => ({ ...prev, isOpen: false }))}
        actionType={quickReplyState.actionType}
        targetCandidates={quickReplyState.targetCandidates}
        onConfirm={handleConfirmQuickReply}
      />
    </div>
  );
};
