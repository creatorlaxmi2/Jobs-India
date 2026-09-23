import React, { useState } from 'react';
import {
  PhoneCall,
  Heart,
  FileCheck,
  Calendar,
  Bell,
  ChevronRight,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Laptop,
  FileText,
  Users,
  TrendingUp,
  HelpCircle,
  Headphones,
  MessageCircleQuestion,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  Application,
  HRRequest,
  Job,
  JobPreference,
  UserProfile,
} from '../types';
import { JobCard } from './JobCard';
import { SUPPORT_CONTENT, SupportItem } from '../data/supportData';

interface MyActivityTabProps {
  applications: Application[];
  hrRequests: HRRequest[];
  savedJobs: Job[];
  savedJobIds: Set<string>;
  onToggleSave: (jobId: string) => void;
  onApplyJob: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  jobPreference: JobPreference;
  onUpdateJobPreference: (pref: JobPreference) => void;
  onAcceptHRRequest: (requestId: string) => void;
  onDeclineHRRequest: (requestId: string) => void;
  initialSubView?: 'hr' | 'saved' | 'applications' | 'interviews' | 'alerts' | null;
}

export const MyActivityTab: React.FC<MyActivityTabProps> = ({
  applications,
  hrRequests,
  savedJobs,
  savedJobIds,
  onToggleSave,
  onApplyJob,
  onSelectJob,
  jobPreference,
  onUpdateJobPreference,
  onAcceptHRRequest,
  onDeclineHRRequest,
  initialSubView,
}) => {
  const [activeSubView, setActiveSubView] = useState<
    'none' | 'hr' | 'saved' | 'applications' | 'interviews' | 'alerts'
  >(initialSubView || 'none');

  const [activeAppStatusFilter, setActiveAppStatusFilter] = useState<string>('All');
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [selectedSupportModal, setSelectedSupportModal] = useState<SupportItem | null>(null);

  // Preference state for editing
  const [prefRole, setPrefRole] = useState(jobPreference.preferredRoles.join(', '));
  const [prefLocation, setPrefLocation] = useState(jobPreference.preferredLocations.join(', '));
  const [prefSalary, setPrefSalary] = useState(jobPreference.expectedSalary);
  const [prefExperience, setPrefExperience] = useState(jobPreference.experience);
  const [prefWorkMode, setPrefWorkMode] = useState(jobPreference.workMode);

  const pendingHRCount = hrRequests.filter((r) => r.status === 'Pending').length;
  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;

  const handleSavePreference = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateJobPreference({
      preferredRoles: prefRole.split(',').map((s) => s.trim()).filter(Boolean),
      preferredLocations: prefLocation.split(',').map((s) => s.trim()).filter(Boolean),
      expectedSalary: prefSalary,
      experience: prefExperience,
      workMode: prefWorkMode,
      isConfigured: true,
    });
    setShowPreferenceModal(false);
  };

  return (
    <div className="space-y-5 pb-20 pt-1 px-4">
      {/* If subview is open (e.g. My Applications, Saved Jobs, HR Requests), show subview with back header */}
      {activeSubView !== 'none' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <button
              onClick={() => setActiveSubView('none')}
              className="text-xs font-bold text-[#4055B8] flex items-center gap-1 hover:underline"
            >
              ← Back to My Activity
            </button>
            <span className="text-gray-300">|</span>
            <h2 className="text-base font-bold text-[#1E2544]">
              {activeSubView === 'hr' && 'New HR Requests'}
              {activeSubView === 'saved' && `Saved Jobs (${savedJobs.length})`}
              {activeSubView === 'applications' && `My Applications (${applications.length})`}
              {activeSubView === 'interviews' && `Interview Invitations (${interviewsCount})`}
              {activeSubView === 'alerts' && 'Job Alerts'}
            </h2>
          </div>

          {/* Subview Content: 1. NEW HR REQUESTS */}
          {activeSubView === 'hr' && (
            <div className="space-y-3">
              {hrRequests.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <PhoneCall className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No HR requests yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete your profile to 85%+ to receive direct recruitment calls.
                  </p>
                </div>
              ) : (
                hrRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1E2544]">
                            {req.recruiterName}
                          </h4>
                          <span className="text-[10px] bg-[#EEF2FF] text-[#4055B8] font-bold px-2 py-0.5 rounded-md">
                            HR Recruiter
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#687386]">
                          {req.company} • {req.location}
                        </p>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {req.receivedAt}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 text-xs text-gray-700 space-y-1">
                      <p className="font-bold text-[#1E2544]">Opening: {req.role}</p>
                      <p className="text-emerald-700 font-semibold">{req.salary}</p>
                      <p className="text-gray-600 italic mt-1">"{req.message}"</p>
                    </div>

                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onDeclineHRRequest(req.id)}
                          className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onAcceptHRRequest(req.id)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#4055B8] to-[#6B3FC7] text-xs font-bold text-white shadow-xs"
                        >
                          Accept & Connect
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                        <span>Connected! HR will call your verified number.</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Subview Content: 2. SAVED JOBS */}
          {activeSubView === 'saved' && (
            <div className="space-y-3">
              {savedJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">No saved jobs</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tap the heart icon on any job card to save it for later.
                  </p>
                </div>
              ) : (
                savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.has(job.id)}
                    onToggleSave={onToggleSave}
                    onApply={onApplyJob}
                    onSelectJob={onSelectJob}
                  />
                ))
              )}
            </div>
          )}

          {/* Subview Content: 3. MY APPLICATIONS */}
          {activeSubView === 'applications' && (
            <div className="space-y-3">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {['All', 'Applied', 'Viewed', 'Shortlisted', 'Interview', 'Rejected'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setActiveAppStatusFilter(st)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap border ${
                        activeAppStatusFilter === st
                          ? 'bg-[#4055B8] text-white border-[#4055B8]'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              {/* Applications List */}
              {applications
                .filter(
                  (a) =>
                    activeAppStatusFilter === 'All' ||
                    a.status === activeAppStatusFilter
                )
                .map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#1E2544]">
                          {app.jobTitle}
                        </h4>
                        <p className="text-xs font-semibold text-gray-600">
                          {app.company}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {app.location} • {app.salary}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          app.status === 'Interview' || app.status === 'Interviewing'
                            ? 'bg-purple-100 text-purple-700'
                            : app.status === 'Shortlisted'
                            ? 'bg-emerald-100 text-emerald-700'
                            : app.status === 'Viewed'
                            ? 'bg-blue-100 text-blue-700'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>Application Timeline</span>
                        <span>Applied on {app.appliedDate}</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {app.statusTimeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                step.completed
                                  ? 'bg-[#35A853] text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <div className="flex-1 leading-tight">
                              <span
                                className={`font-bold ${
                                  step.current
                                    ? 'text-[#4055B8]'
                                    : step.completed
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.stage}
                              </span>
                              <p className="text-[11px] text-gray-500">{step.note}</p>
                            </div>
                            <span className="text-[10px] text-gray-400">
                              {step.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* HR Contact Button if available */}
                    {app.hrContact && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                        <div className="text-gray-600">
                          <span className="font-semibold">{app.hrContact.name}</span>
                          <span className="text-gray-400 text-[11px] block">
                            {app.hrContact.designation}
                          </span>
                        </div>
                        <a
                          href={`tel:${app.hrContact.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call HR</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Subview Content: 4. INTERVIEW INVITATIONS */}
          {activeSubView === 'interviews' && (
            <div className="space-y-3">
              {applications.filter((a) => a.status === 'Interview').map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-4 border border-[#6B3FC7]/30 shadow-xs space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#6B3FC7] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    Confirmed Interview
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1E2544]">
                      {app.jobTitle}
                    </h4>
                    <p className="text-xs font-semibold text-[#4055B8]">
                      {app.company}
                    </p>
                  </div>

                  <div className="bg-[#FAF5FF] p-3 rounded-xl border border-[#EDE9FE] text-xs space-y-1 text-[#4C1D95]">
                    <div className="flex items-center gap-2 font-bold">
                      <Calendar className="w-4 h-4 text-[#6B3FC7]" />
                      <span>Tomorrow, 22 Sep 2026 at 11:30 AM</span>
                    </div>
                    <p className="text-gray-600 pt-1">
                      Venue: Medanta Hospital HR Block, Kankarbagh Main Road, Patna
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      Carry original GNM/B.Sc registration certificate & updated CV.
                    </p>
                  </div>

                  {app.hrContact && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-gray-500">
                        Contact: {app.hrContact.name} ({app.hrContact.phone})
                      </span>
                      <a
                        href={`tel:${app.hrContact.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-[#4055B8] text-white text-xs font-bold"
                      >
                        Call HR
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Subview Content: 5. JOB ALERTS */}
          {activeSubView === 'alerts' && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4055B8] flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E2544]">
                    Active Job Alerts
                  </h4>
                  <p className="text-xs text-[#687386]">
                    Instant WhatsApp & App alerts for Patna & Remote
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Staff Nurse & Clinic Care</p>
                    <p className="text-gray-500">Patna, Bihar • Min ₹25k/mo</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded-md">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">Customer Support Executive</p>
                    <p className="text-gray-500">Work From Home • Min ₹20k/mo</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded-md">
                    Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPreferenceModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#4055B8] text-white text-xs font-bold"
              >
                Modify Alert Preferences
              </button>
            </div>
          )}
        </div>
      ) : (
        /* MAIN MY ACTIVITY VIEW */
        <>
          {/* SECTION: MY ACTIVITY */}
          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
              My Activity
            </h2>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-gray-100">
              {/* 1. New HR Requests */}
              <button
                id="activity-menu-hr-requests"
                onClick={() => setActiveSubView('hr')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E2544]">
                      New HR Requests
                    </span>
                    <p className="text-xs text-gray-400">
                      Direct recruiter call requests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pendingHRCount > 0 && (
                    <span className="bg-[#E83B45] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingHRCount} New
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {/* 2. Saved Jobs */}
              <button
                id="activity-menu-saved-jobs"
                onClick={() => setActiveSubView('saved')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#E83B45] flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E2544]">
                      Saved Jobs
                    </span>
                    <p className="text-xs text-gray-400">
                      Jobs you bookmarked for later
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#687386]">
                    {savedJobs.length}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {/* 3. My Applications */}
              <button
                id="activity-menu-my-applications"
                onClick={() => setActiveSubView('applications')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E2544]">
                      My Applications
                    </span>
                    <p className="text-xs text-gray-400">
                      Applied, Shortlisted & Interview tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#687386]">
                    {applications.length}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {/* 4. Interview Invitations */}
              <button
                id="activity-menu-interviews"
                onClick={() => setActiveSubView('interviews')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E2544]">
                      Interview Invitations
                    </span>
                    <p className="text-xs text-gray-400">
                      Confirmed interview dates & venue
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {interviewsCount > 0 && (
                    <span className="bg-[#6B3FC7] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {interviewsCount}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {/* 5. Job Alerts */}
              <button
                id="activity-menu-job-alerts"
                onClick={() => setActiveSubView('alerts')}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#1E2544]">
                      Job Alerts
                    </span>
                    <p className="text-xs text-gray-400">
                      Custom daily alerts in Patna & WFH
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </section>

          {/* SECTION: JOB BOX */}
          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
              Job Box
            </h2>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-gray-100">
              {/* My Job Preference (with Action Needed badge if incomplete) */}
              <button
                id="job-box-my-preference"
                onClick={() => setShowPreferenceModal(true)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left bg-gradient-to-r from-white to-[#F8FAFC]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4055B8] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1E2544]">
                        My Job Preference
                      </span>
                      {!jobPreference.isConfigured && (
                        <span className="bg-[#FEF2F2] text-[#E83B45] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#FEE2E2]">
                          Action Needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      Roles, location & salary range
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#4055B8] font-bold">Edit</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>

              {/* Preferred Job Role */}
              <div
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Preferred Job Role</span>
                </div>
                <span className="font-bold text-[#1E2544]">
                  {jobPreference.preferredRoles[0] || 'Staff Nurse, Sales'}
                </span>
              </div>

              {/* Preferred Location */}
              <div
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Preferred Location</span>
                </div>
                <span className="font-bold text-[#1E2544]">
                  {jobPreference.preferredLocations.join(', ') || 'Patna, Bihar'}
                </span>
              </div>

              {/* Expected Salary */}
              <div
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <IndianRupee className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Expected Salary</span>
                </div>
                <span className="font-bold text-[#1E2544]">
                  {jobPreference.expectedSalary || '₹32,000 - ₹38,000 / mo'}
                </span>
              </div>

              {/* Experience */}
              <div
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Experience</span>
                </div>
                <span className="font-bold text-[#1E2544]">
                  {jobPreference.experience || '2 Years'}
                </span>
              </div>

              {/* Work Mode */}
              <div
                onClick={() => setShowPreferenceModal(true)}
                className="px-4 py-3 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Laptop className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">Work Mode</span>
                </div>
                <span className="font-bold text-[#1E2544]">
                  {jobPreference.workMode || 'All (Office + Remote)'}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION: TIPS & SUPPORT */}
          <section className="space-y-2.5">
            <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
              Tips & Support
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Resume Tips */}
              <button
                id="tips-resume-tips"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['resume-tips'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4055B8] flex items-center justify-center mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">Resume Tips</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  1-page ATS template
                </p>
              </button>

              {/* Interview Preparation */}
              <button
                id="tips-interview-prep"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['interview-prep'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">
                  Interview Preparation
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Common HR questions
                </p>
              </button>

              {/* Career Tips */}
              <button
                id="tips-career-tips"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['career-tips'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">Career Tips</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Salary & growth guide
                </p>
              </button>

              {/* Help Center */}
              <button
                id="tips-help-center"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['help-center'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-2">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">Help Center</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Safety & verification
                </p>
              </button>

              {/* Contact Support */}
              <button
                id="tips-contact-support"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['contact-support'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-2">
                  <Headphones className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">
                  Contact Support
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Helpline 1800-JOBS
                </p>
              </button>

              {/* FAQs */}
              <button
                id="tips-faqs"
                onClick={() => setSelectedSupportModal(SUPPORT_CONTENT['faqs'])}
                className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] shadow-xs text-left transition-all active:scale-98"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-2">
                  <MessageCircleQuestion className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1E2544]">FAQs</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Frequently answered
                </p>
              </button>
            </div>
          </section>
        </>
      )}

      {/* MODAL: EDIT JOB PREFERENCE */}
      {showPreferenceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#1E2544]">
                  My Job Preference
                </h3>
                <p className="text-xs text-gray-500">
                  Customizes recommendations & direct HR matches
                </p>
              </div>
              <button
                onClick={() => setShowPreferenceModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePreference} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Preferred Job Roles (comma separated)
                </label>
                <input
                  type="text"
                  value={prefRole}
                  onChange={(e) => setPrefRole(e.target.value)}
                  placeholder="e.g. Staff Nurse, Customer Support, Sales Executive"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Preferred Locations (comma separated)
                </label>
                <input
                  type="text"
                  value={prefLocation}
                  onChange={(e) => setPrefLocation(e.target.value)}
                  placeholder="e.g. Patna, Muhammadpur, Bailey Road, Remote"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Expected Monthly Salary
                </label>
                <input
                  type="text"
                  value={prefSalary}
                  onChange={(e) => setPrefSalary(e.target.value)}
                  placeholder="e.g. ₹30,000 - ₹40,000 / mo"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Total Experience
                </label>
                <select
                  value={prefExperience}
                  onChange={(e) => setPrefExperience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                >
                  <option value="Fresher (0 Years)">Fresher (0 Years)</option>
                  <option value="1 - 2 Years">1 - 2 Years</option>
                  <option value="2 - 5 Years">2 - 5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1E2544] block mb-1">
                  Work Mode Preference
                </label>
                <select
                  value={prefWorkMode}
                  onChange={(e) => setPrefWorkMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 outline-hidden focus:border-[#4055B8]"
                >
                  <option value="All (Office + Remote)">All (Office + Remote)</option>
                  <option value="In-Office Only">In-Office Only</option>
                  <option value="Work From Home Only">Work From Home Only</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4055B8] to-[#6B3FC7] text-white text-xs font-bold shadow-md"
                >
                  Save Job Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TIPS & SUPPORT DETAIL DIALOG */}
      {selectedSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-1">
              <div>
                <span className="text-[11px] font-bold text-[#2A48C8] uppercase tracking-wider block">
                  {selectedSupportModal.category}
                </span>
                <h3 className="text-lg font-bold text-[#1E2544] mt-0.5">
                  {selectedSupportModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSupportModal(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#687386] leading-relaxed">
              {selectedSupportModal.description}
            </p>

            <div className="space-y-3 pt-1">
              {selectedSupportModal.points.map((pt, idx) => {
                const isWhatsApp = pt.title.toLowerCase().includes('whatsapp');
                const isEmail = pt.title.toLowerCase().includes('email');
                const isPhone = pt.title.toLowerCase().includes('helpline') || pt.title.toLowerCase().includes('phone');

                return (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-colors space-y-1"
                  >
                    <h4 className="text-sm font-bold text-[#1E2544]">{pt.title}</h4>
                    <p className="text-xs text-[#525D73] leading-relaxed">
                      {pt.content}
                    </p>
                    {isWhatsApp && (
                      <div className="pt-1.5">
                        <a
                          href="https://wa.me/918863090950?text=Hello%20Jobs%20India%20Support%2C%20I%20need%20help%20with%20my%20job%20application"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] hover:underline"
                        >
                          <span>Chat on WhatsApp (+91 8863090950)</span>
                          <span>→</span>
                        </a>
                      </div>
                    )}
                    {isEmail && (
                      <div className="pt-1.5">
                        <a
                          href="mailto:support.jobsindia@gmail.com"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2A48C8] hover:underline"
                        >
                          <span>Send Email (support.jobsindia@gmail.com)</span>
                          <span>→</span>
                        </a>
                      </div>
                    )}
                    {isPhone && (
                      <div className="pt-1.5">
                        <a
                          href="tel:18005627463"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2A48C8] hover:underline"
                        >
                          <span>Call Toll-Free (1800-562-7463)</span>
                          <span>→</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSupportModal(null)}
                className="w-full py-3 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white text-sm font-bold shadow-md transition-colors"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
