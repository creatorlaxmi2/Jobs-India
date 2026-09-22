import React, { useState } from 'react';
import {
  Menu,
  Bell,
  SlidersHorizontal,
  ArrowRight,
  Headphones,
  PhoneCall,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  Building2,
  User,
  Wallet,
  X,
  ShieldCheck,
  Check,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Users,
  Eye,
  Trash2,
  Edit3,
  RefreshCw,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Job, Application } from '../types';

interface EmployerPortalProps {
  jobs: Job[];
  onAddJob: (job: Job) => void;
  applications: Application[];
  onUpdateApplicationStatus: (appId: string, newStatus: any) => void;
  onOpenSwitchMode: () => void;
}

interface EmployerJobItem {
  id: string;
  title: string;
  location: string;
  status: 'Rejected' | 'Active' | 'Under Review' | 'Expired';
  rejectionReason?: string;
  responsesCount: number;
  hotLeadsCount: number;
  databaseLeadsCount: number;
  postedDate: string;
  isActive: boolean;
  salary?: string;
  company?: string;
  jobType?: string;
}

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  jobs,
  onAddJob,
  applications,
  onUpdateApplicationStatus,
  onOpenSwitchMode,
}) => {
  // Wallet state
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<'All' | 'Rejected' | 'Active' | 'Under Review'>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Modals
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Selected job for detail modals
  const [selectedJobForReason, setSelectedJobForReason] = useState<EmployerJobItem | null>(null);
  const [selectedJobForHotLeads, setSelectedJobForHotLeads] = useState<EmployerJobItem | null>(null);
  const [selectedJobForResponses, setSelectedJobForResponses] = useState<EmployerJobItem | null>(null);
  const [isDatabaseLeadsOpen, setIsDatabaseLeadsOpen] = useState(false);
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Employer Job Listings (Primary: Iron Man from screenshot, plus active postings)
  const [employerJobs, setEmployerJobs] = useState<EmployerJobItem[]>([
    {
      id: 'job-iron-man',
      title: 'Iron Man',
      location: 'Shakurpur, Delhi / NCR',
      status: 'Rejected',
      rejectionReason:
        'Job post was flagged by trust & safety moderation: The title "Iron Man" is ambiguous and does not define standard industrial duties (e.g., Fabricator / Welder / CNC Operator / Steel Erector). Please update the designation and skill requirements to pass quality guidelines and re-activate.',
      responsesCount: 0,
      hotLeadsCount: 5,
      databaseLeadsCount: 69680,
      postedDate: '22nd September 26',
      isActive: false,
      salary: '₹25,000 - ₹35,000 / mo',
      company: 'Stark Fabrications & Industrial Works',
      jobType: 'Full Time',
    },
    {
      id: 'job-icu-nurse',
      title: 'ICU Staff Nurse / GNM',
      location: 'Muhammadpur, Patna',
      status: 'Active',
      responsesCount: 18,
      hotLeadsCount: 14,
      databaseLeadsCount: 69680,
      postedDate: '20th September 26',
      isActive: true,
      salary: '₹28,000 - ₹38,000 / mo',
      company: 'Apollo Diagnostics Patna',
      jobType: 'Full Time',
    },
    {
      id: 'job-telecaller-patna',
      title: 'Customer Care & Telecaller Executive',
      location: 'Fraser Road, Patna',
      status: 'Under Review',
      rejectionReason: 'Under routine 2-hour employer verification check for voice recording compliance.',
      responsesCount: 4,
      hotLeadsCount: 9,
      databaseLeadsCount: 69680,
      postedDate: '21st September 26',
      isActive: true,
      salary: '₹16,000 - ₹22,000 / mo',
      company: 'Tata 1mg Patna',
      jobType: 'Full Time',
    },
  ]);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('Apollo Diagnostics Patna');
  const [newLocality, setNewLocality] = useState('Muhammadpur, Patna');
  const [newMinSalary, setNewMinSalary] = useState('25000');
  const [newMaxSalary, setNewMaxSalary] = useState('40000');
  const [newJobType, setNewJobType] = useState<'Full Time' | 'Part Time' | 'Work From Home'>('Full Time');
  const [newHrName, setNewHrName] = useState('Dr. Alok Verma');
  const [newHrPhone, setNewHrPhone] = useState('+91 98350 12845');
  const [newHrEmail, setNewHrEmail] = useState('hr.alok@apollodiagnostics.in');

  // Handle Post New Job
  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newJobItem: EmployerJobItem = {
      id: `job-emp-${Date.now()}`,
      title: newTitle.trim(),
      location: newLocality.trim() || 'Patna, Bihar',
      status: 'Active',
      responsesCount: 0,
      hotLeadsCount: 8,
      databaseLeadsCount: 69680,
      postedDate: '22nd September 26',
      isActive: true,
      salary: `₹${parseInt(newMinSalary).toLocaleString('en-IN')} - ₹${parseInt(newMaxSalary).toLocaleString('en-IN')} / mo`,
      company: newCompany.trim() || 'Apollo Diagnostics Patna',
      jobType: newJobType,
    };

    setEmployerJobs([newJobItem, ...employerJobs]);

    // Also push to global jobs list for seekers
    const fullJob: Job = {
      id: newJobItem.id,
      title: newTitle,
      company: newCompany,
      companyLogoBg: '#059669',
      companyLogoText: newCompany.slice(0, 2).toUpperCase(),
      location: 'Patna, Bihar',
      locality: newLocality.split(',')[0].trim(),
      distance: 'Within 2.0 km',
      salary: newJobItem.salary || '₹25,000 - ₹40,000 / mo',
      minSalary: parseInt(newMinSalary) || 25000,
      maxSalary: parseInt(newMaxSalary) || 40000,
      experience: '1 - 3 Yrs',
      jobType: newJobType,
      isWorkFromHome: newJobType === 'Work From Home',
      isHighSalary: parseInt(newMaxSalary) >= 35000,
      isUrgent: true,
      isNew: true,
      postedTime: 'Just now',
      applicantsCount: 0,
      vacancies: 3,
      description: 'Newly created position for immediate hiring.',
      responsibilities: [
        'Perform day-to-day operations and deliver professional service.',
        'Coordinate candidate schedules and client meetings.',
      ],
      requiredSkills: ['Communication', 'Teamwork', 'Punctuality'],
      benefits: ['PF & ESI', 'Weekly Incentives'],
      aboutCompany: {
        rating: 4.8,
        reviewsCount: 340,
        employees: '500+ employees',
        industry: 'Healthcare & Corporate Services',
        address: `${newLocality}, Patna, Bihar`,
        verified: true,
      },
      recruiterContact: {
        name: newHrName.trim() || 'Dr. Alok Verma',
        designation: 'Talent Acquisition Partner',
        phone: newHrPhone.trim() || '+91 98350 12845',
        email: newHrEmail.trim() || 'recruiter@apollodiagnostics.in',
        isVerified: true,
        kycDocument: 'CIN-U85110DL2004PLC128314',
        companyGstin: '10AAACM1234F1Z8',
        verifiedAt: 'Verified Just Now',
      },
    };

    onAddJob(fullJob);
    setIsPostJobModalOpen(false);
    setNewTitle('');
    showToast(`Job "${newTitle}" posted successfully and is now Live!`);
  };

  // Toggle Activation
  const handleToggleActivate = (jobId: string) => {
    setEmployerJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextActive = !j.isActive;
          const nextStatus = nextActive ? 'Active' : 'Rejected';
          return {
            ...j,
            isActive: nextActive,
            status: nextStatus,
          };
        }
        return j;
      })
    );
    showToast('Job status updated successfully!');
  };

  // Delete Job
  const handleDeleteJob = (jobId: string) => {
    setEmployerJobs((prev) => prev.filter((j) => j.id !== jobId));
    setActiveMenuJobId(null);
    showToast('Job listing deleted.');
  };

  // Filtered jobs
  const displayedJobs = employerJobs.filter((j) => {
    if (statusFilter === 'All') return true;
    return j.status === statusFilter;
  });

  // Mock Hot Leads Candidates for modal
  const mockHotLeads = [
    {
      id: 'lead-1',
      name: 'Rakesh Kumar Sharma',
      experience: '2.5 Years Experience',
      location: 'Shakurpur / Delhi NCR',
      skills: 'Metal Fabrication, Arc Welding, Safety Protocols',
      matchScore: '96% Match',
      mobile: '+91 98712 34567',
    },
    {
      id: 'lead-2',
      name: 'Pankaj Verma',
      experience: '3 Years Experience',
      location: 'Netaji Subhash Place, Delhi',
      skills: 'Machine Operation, Fabrication, Heavy Duty Assembly',
      matchScore: '92% Match',
      mobile: '+91 99105 87412',
    },
    {
      id: 'lead-3',
      name: 'Sonu Prajapati',
      experience: '1.8 Years Experience',
      location: 'Rohini Sector 7, Delhi',
      skills: 'Welding, Precision Cutting, Team Coordination',
      matchScore: '89% Match',
      mobile: '+91 97184 21980',
    },
    {
      id: 'lead-4',
      name: 'Amit Kumar Singh',
      experience: '4 Years Experience',
      location: 'Pitampura, Delhi',
      skills: 'Industrial Workshop, MIG Welding, Tool Maintenance',
      matchScore: '87% Match',
      mobile: '+91 98110 54321',
    },
    {
      id: 'lead-5',
      name: 'Manoj Yadav',
      experience: '2 Years Experience',
      location: 'Azadpur, Delhi',
      skills: 'Mechanical Fitting, Blueprint Reading, Shift Supervision',
      matchScore: '85% Match',
      mobile: '+91 98991 76543',
    },
  ];

  return (
    <div
      id="employer-job-list-view"
      className="min-h-screen bg-[#F1F5F9] pb-24 text-slate-800 font-sans select-none"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (Exact royal blue matching the screenshot) */}
      {/* ========================================================================= */}
      <header className="bg-[#0047AB] text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Left: Hamburger Menu & Title */}
          <div className="flex items-center gap-3">
            <button
              id="employer-menu-hamburger-btn"
              onClick={() => setIsDrawerOpen(true)}
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 text-white stroke-[2.2]" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Job List
            </h1>
          </div>

          {/* Right: Notification Bell & Sliders/Filter */}
          <div className="flex items-center gap-2">
            {/* Bell Icon with Red Alert Badge */}
            <button
              id="employer-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#0047AB]" />
            </button>

            {/* Sliders / Filter Icon with Yellow Dot (exact as screenshot) */}
            <div className="relative">
              <button
                id="employer-filter-sliders-btn"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="relative p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Filter Job Posts"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
                {/* Yellow dot on top-right of sliders */}
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F59E0B] ring-2 ring-[#0047AB]" />
              </button>

              {/* Status Filter Dropdown */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  <div className="px-3 py-1.5 font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    Filter by Status
                  </div>
                  {(['All', 'Active', 'Rejected', 'Under Review'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                        statusFilter === status ? 'font-bold text-[#0047AB]' : 'text-slate-700'
                      }`}
                    >
                      <span>{status} Jobs</span>
                      {statusFilter === status && <Check className="w-3.5 h-3.5 text-[#0047AB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. WALLET BALANCE STRIP (White background with green RECHARGE button) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm sm:text-base">
            <span className="text-slate-500 font-medium">Wallet Balance</span>
            <span className="text-slate-900 font-bold text-base sm:text-lg">
              ₹{walletBalance}
            </span>
          </div>

          <button
            id="employer-wallet-recharge-btn"
            onClick={() => setIsRechargeModalOpen(true)}
            className="bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 text-white font-extrabold text-xs sm:text-[13px] tracking-wider uppercase px-4 py-1.5 rounded-md transition-all shadow-xs"
          >
            RECHARGE
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="max-w-xl mx-auto px-4 pt-3.5 space-y-3">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-[#0047AB] text-white px-3.5 py-2.5 rounded-xl shadow-md text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 3A. Call Customer Support Chip */}
        <div>
          <button
            id="employer-call-support-chip"
            onClick={() => setIsSupportModalOpen(true)}
            className="border border-slate-300 hover:border-slate-400 bg-white active:bg-slate-50 rounded-md px-3 py-1.5 inline-flex items-center gap-2 text-xs font-medium text-slate-700 shadow-2xs transition-colors"
          >
            {/* Cute Customer support avatar / headset icon */}
            <div className="w-4 h-4 rounded-full border border-slate-400/80 flex items-center justify-center text-slate-600">
              <Headphones className="w-2.5 h-2.5" />
            </div>
            <span>Call Customer support</span>
          </button>
        </div>

        {/* 3B. Complete Profile Banner */}
        <div
          id="employer-profile-visibility-banner"
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-3.5 py-3 flex items-center justify-between shadow-2xs cursor-pointer transition-all"
        >
          <span className="text-xs sm:text-sm font-semibold text-[#0047AB]">
            Complete your Profile to Increase Visibility
          </span>
          <span className="bg-[#22C55E] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            New
          </span>
        </div>

        {/* Active Filter Pill indicator if not All */}
        {statusFilter !== 'All' && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong>{statusFilter}</strong> posts ({displayedJobs.length})
            </span>
            <button
              onClick={() => setStatusFilter('All')}
              className="text-[#0047AB] font-bold hover:underline"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. JOB POSTINGS CARDS (Exact match to user's uploaded screenshot) */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-1">
          {displayedJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No job posts in this view</h3>
              <p className="text-xs text-slate-500">
                You do not have any job posts matching "{statusFilter}".
              </p>
              <button
                onClick={() => setStatusFilter('All')}
                className="mt-2 text-xs font-bold text-[#0047AB] hover:underline"
              >
                Show All Jobs
              </button>
            </div>
          ) : (
            displayedJobs.map((job) => (
              <div
                key={job.id}
                id={`employer-job-card-${job.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
              >
                {/* 4A. REJECTION ALERT BANNER (If rejected - exact replica of image) */}
                {job.status === 'Rejected' && (
                  <div className="bg-[#FFF1F2] border-b border-red-100 px-3.5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Red filled circle with '!' */}
                      <div className="w-4 h-4 rounded-full bg-[#EF4444] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        !
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                        This job post is rejected
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedJobForReason(job)}
                      className="text-[#0047AB] hover:text-blue-800 font-bold text-xs sm:text-sm flex items-center gap-1 flex-shrink-0 ml-2 hover:underline"
                    >
                      <span>See why</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Under Review Alert Banner */}
                {job.status === 'Under Review' && (
                  <div className="bg-amber-50 border-b border-amber-100 px-3.5 py-2 flex items-center justify-between text-xs text-amber-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Post is undergoing quality review (approx. 20 mins)</span>
                    </div>
                    <button
                      onClick={() => setSelectedJobForReason(job)}
                      className="text-[#0047AB] font-bold text-xs hover:underline flex items-center gap-0.5"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 4B. CARD BODY */}
                <div className="p-4 space-y-3.5">
                  {/* Title, Status Pill & More Options Menu */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {job.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                        {job.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 relative">
                      {/* Status Pill */}
                      <span
                        className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                          job.status === 'Rejected'
                            ? 'bg-[#F87171] text-white'
                            : job.status === 'Active'
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#F59E0B] text-white'
                        }`}
                      >
                        {job.status}
                      </span>

                      {/* Three vertical dots menu */}
                      <button
                        onClick={() =>
                          setActiveMenuJobId(activeMenuJobId === job.id ? null : job.id)
                        }
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Options */}
                      {activeMenuJobId === job.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setSelectedJobForResponses(job);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Applicants</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedJobForHotLeads(job);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>View Hot Leads</span>
                          </button>
                          <button
                            onClick={() => {
                              handleToggleActivate(job.id);
                              setActiveMenuJobId(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
                            <span>{job.isActive ? 'Deactivate Post' : 'Activate Post'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Delete Job Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4C. THREE METRIC BOXES (Exact layout from image) */}
                  <div className="space-y-2">
                    {/* Top Row: Two Boxes */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Box 1: Responses till now */}
                      <div
                        onClick={() => setSelectedJobForResponses(job)}
                        className="border border-[#1E3A8A] rounded-xl p-3 bg-white hover:bg-blue-50/40 transition-colors cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-[#1E3A8A]">
                            {job.responsesCount}
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1">
                          Responses till now
                        </p>
                      </div>

                      {/* Box 2: 5 Hot Leads Match */}
                      <div
                        onClick={() => setSelectedJobForHotLeads(job)}
                        className="border border-[#D97706] rounded-xl p-3 bg-white hover:bg-amber-50/40 transition-colors cursor-pointer flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-[#B45309]">
                            {job.hotLeadsCount} Hot Leads
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#B45309]" />
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1">
                          Match your job post
                        </p>
                      </div>
                    </div>

                    {/* Bottom Full-Width Box: Leads in Database */}
                    <div
                      onClick={() => setIsDatabaseLeadsOpen(true)}
                      className="border border-[#1E3A8A] rounded-xl p-3 bg-white hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="text-base sm:text-lg font-bold text-[#1E3A8A] block">
                          {job.databaseLeadsCount.toLocaleString('en-IN')}
                        </span>
                        <p className="text-xs text-slate-600 font-medium">
                          Leads in Database
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                  </div>

                  {/* 4D. FOOTER ROW: Posted Date & Activate / Manage Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      Posted on : {job.postedDate}
                    </span>

                    <button
                      id={`employer-activate-btn-${job.id}`}
                      onClick={() => handleToggleActivate(job.id)}
                      className={`font-bold text-xs sm:text-sm px-6 py-2 rounded-xl transition-all shadow-xs ${
                        job.status === 'Active'
                          ? 'bg-[#0047AB] hover:bg-[#003882] text-white'
                          : 'bg-[#37498B] hover:bg-[#2B3A70] text-white'
                      }`}
                    >
                      {job.status === 'Active' ? 'Active' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. FLOATING ACTION BUTTON: POST A JOB */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-5 z-20">
        <button
          id="employer-fab-post-job"
          onClick={() => setIsPostJobModalOpen(true)}
          className="bg-[#0047AB] hover:bg-[#003882] text-white font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. SIDE DRAWER MENU (When Hamburger icon is clicked) */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="bg-[#0047AB] text-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-base text-white">
                      AD
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight">Apollo Diagnostics</h3>
                      <p className="text-[11px] text-blue-200">Patna Hub • Verified HR</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-white/15">
                  <span className="text-blue-100">Wallet: ₹{walletBalance}</span>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsRechargeModalOpen(true);
                    }}
                    className="bg-[#22C55E] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                  >
                    Recharge
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-2 divide-y divide-slate-100 text-xs text-slate-700">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 font-bold text-[#0047AB]"
                  >
                    <Briefcase className="w-4 h-4 text-[#0047AB]" />
                    <span>Job List ({employerJobs.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsPostJobModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Post a New Job</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsDatabaseLeadsOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Candidate Database (69,680+ Leads)</span>
                  </button>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Company Profile & KYC</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsSupportModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700"
                  >
                    <Headphones className="w-4 h-4 text-amber-600" />
                    <span>Call Customer Support</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Switch Mode */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                id="drawer-switch-mode-btn"
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenSwitchMode();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-between shadow-2xs"
              >
                <span>Switch App Mode (Candidate / Admin)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: SEE WHY JOB WAS REJECTED */}
      {/* ========================================================================= */}
      {selectedJobForReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Job Post Review Notice</h3>
                  <p className="text-xs text-slate-500">{selectedJobForReason.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForReason(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-900 space-y-1.5">
              <h4 className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Moderation Reason:
              </h4>
              <p className="text-slate-700 leading-relaxed">
                {selectedJobForReason.rejectionReason}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <h5 className="font-bold text-slate-800">Quick Guidelines to Activate:</h5>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Use explicit job designations (e.g. Iron & Steel Fabricator, Welder).</li>
                <li>Specify accurate shift timings, locality, and minimum wage compliance.</li>
                <li>Ensure official recruiter phone & work email ID are attached.</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleToggleActivate(selectedJobForReason.id);
                  setSelectedJobForReason(null);
                }}
                className="flex-1 py-2.5 bg-[#0047AB] hover:bg-[#003882] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Request Re-Review & Activate
              </button>
              <button
                onClick={() => setSelectedJobForReason(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: HOT LEADS MATCHED CANDIDATES */}
      {/* ========================================================================= */}
      {selectedJobForHotLeads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <h3 className="font-bold text-base text-slate-900">
                    {selectedJobForHotLeads.hotLeadsCount} Hot Leads Matched
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-screened candidates for "{selectedJobForHotLeads.title}"
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForHotLeads(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidates list */}
            <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
              {mockHotLeads.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cand.name}</h4>
                      <p className="text-slate-500">{cand.experience} • {cand.location}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {cand.matchScore}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    <strong>Skills:</strong> {cand.skills}
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <a
                      href={`tel:${cand.mobile}`}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call {cand.mobile}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cand.mobile.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(cand.name)},%20we%20reviewed%20your%20profile%20for%20our%20Job%20Posting%20on%20Jobs%20India.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedJobForHotLeads(null)}
                className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: RESPONSES TILL NOW */}
      {/* ========================================================================= */}
      {selectedJobForResponses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Responses & Applications
                </h3>
                <p className="text-xs text-slate-500">{selectedJobForResponses.title}</p>
              </div>
              <button
                onClick={() => setSelectedJobForResponses(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedJobForResponses.responsesCount === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-2 border border-slate-200">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-xs">No responses received yet</h4>
                <p className="text-[11px] text-slate-500">
                  Once this job post is Activated, candidate responses will stream here in real-time.
                </p>
                <button
                  onClick={() => {
                    handleToggleActivate(selectedJobForResponses.id);
                    setSelectedJobForResponses(null);
                  }}
                  className="mt-2 px-4 py-1.5 bg-[#0047AB] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Activate Job Post Now
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="font-bold text-blue-900">Total {selectedJobForResponses.responsesCount} Candidates Applied</p>
                  <p className="text-slate-600 text-[11px]">Resumes are downloaded to candidate manager.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedJobForResponses(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: DATABASE LEADS (69,680+ Candidates) */}
      {/* ========================================================================= */}
      {isDatabaseLeadsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Search 69,680+ Leads in Database
                </h3>
                <p className="text-xs text-slate-500">
                  Verified candidate profiles in Delhi/NCR & Bihar
                </p>
              </div>
              <button
                onClick={() => setIsDatabaseLeadsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-3 flex-1 overflow-y-auto">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by skill, role or city (e.g. Welder, Nurse, Patna)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                />
              </div>

              {/* Sample DB Profiles */}
              <div className="space-y-2 text-xs">
                {mockHotLeads.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{cand.name}</h4>
                      <p className="text-[11px] text-slate-500">{cand.experience} • {cand.location}</p>
                    </div>
                    <button
                      onClick={() => showToast(`Contact details unlocked for ${cand.name}!`)}
                      className="px-3 py-1.5 bg-[#0047AB] text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDatabaseLeadsOpen(false)}
                className="py-2 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODAL: CALL CUSTOMER SUPPORT (Exact support details from prompt) */}
      {/* ========================================================================= */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Contact Jobs India Support</h3>
                <p className="text-xs text-slate-500">Reach our team 7 days a week</p>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* WhatsApp Helpdesk */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                  Official WhatsApp Helpdesk
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-900 font-mono">
                    +918863090950
                  </span>
                  <a
                    href="https://wa.me/918863090950?text=Hello%20Jobs%20India%20Support,%20I%20need%20help%20with%20my%20Employer%20Job%20List."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <p className="text-[10px] text-emerald-700">Mon - Sat: 9:00 AM to 7:00 PM IST</p>
              </div>

              {/* Toll-Free Candidate Helpline */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 block">
                  Toll-Free Candidate Helpline
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-blue-900 font-mono">
                    1800-JOBS-INDIA
                  </span>
                  <a
                    href="tel:18005627463"
                    className="px-3 py-1.5 bg-[#0047AB] hover:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Toll-Free</span>
                  </a>
                </div>
                <p className="text-[10px] text-blue-700">1800-562-7463 (Toll Free across India)</p>
              </div>

              {/* Support Email */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Support Email
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">support.jobsindia@gmail.com</span>
                  <a
                    href="mailto:support.jobsindia@gmail.com?subject=Employer%20Support%20Request"
                    className="text-[#0047AB] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
                <p className="text-[10px] text-slate-500">Average response time: under 2 hours</p>
              </div>

              {/* Corporate Office */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block text-xs mb-0.5">Corporate Office</span>
                Jobs India Tech Labs, Level 4, Koiri tola Dr narayan babu Road, Patna, Bihar 800007
              </div>
            </div>

            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="w-full py-2.5 bg-[#0047AB] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODAL: WALLET RECHARGE */}
      {/* ========================================================================= */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recharge Employer Wallet</h3>
                <p className="text-xs text-slate-500">Current Balance: ₹{walletBalance}</p>
              </div>
              <button
                onClick={() => setIsRechargeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { amount: 500, label: 'Starter Pack', leads: '50 Candidate Contacts' },
                { amount: 1000, label: 'Growth Pack (Popular)', leads: '120 Contacts + 1 Job Boost' },
                { amount: 2000, label: 'Pro Recruiter', leads: '300 Contacts + 3 Job Boosts' },
              ].map((pack) => (
                <button
                  key={pack.amount}
                  onClick={() => {
                    setWalletBalance((prev) => prev + pack.amount);
                    setIsRechargeModalOpen(false);
                    showToast(`Wallet credited with ₹${pack.amount} successfully!`);
                  }}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">₹{pack.amount}</h4>
                    <p className="text-[11px] text-slate-600">{pack.label}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{pack.leads}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#22C55E] text-white rounded-lg font-bold text-xs">
                    Add
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsRechargeModalOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. MODAL: POST A JOB FORM */}
      {/* ========================================================================= */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col p-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Post a New Job</h3>
                <p className="text-xs text-slate-500">Publish immediately to candidates</p>
              </div>
              <button
                onClick={() => setIsPostJobModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="py-3 space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Job Designation / Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Iron & Steel Fabricator / Staff Nurse"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Locality & City</label>
                  <input
                    type="text"
                    required
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    placeholder="e.g. Shakurpur, Delhi / NCR"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Salary (₹/mo)</label>
                  <input
                    type="number"
                    value={newMinSalary}
                    onChange={(e) => setNewMinSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Salary (₹/mo)</label>
                  <input
                    type="number"
                    value={newMaxSalary}
                    onChange={(e) => setNewMaxSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0047AB]"
                  />
                </div>
              </div>

              {/* Recruiter Details */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Recruiter Contact Details (Visible to Admin & Job Seekers)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newHrName}
                    onChange={(e) => setNewHrName(e.target.value)}
                    placeholder="HR Name"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newHrPhone}
                    onChange={(e) => setNewHrPhone(e.target.value)}
                    placeholder="HR Phone"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0047AB] hover:bg-[#003882] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Publish Job to Candidate List
                </button>
                <button
                  type="button"
                  onClick={() => setIsPostJobModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. MODAL: EMPLOYER PROFILE & KYC */}
      {/* ========================================================================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Employer Profile</h3>
                <p className="text-xs text-slate-500">Profile completion: 85%</p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900">Apollo Diagnostics Patna</h4>
                  <p className="text-slate-600 text-[11px]">CIN: CIN-U85110DL2004PLC128314</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <p><strong>Recruiter In-Charge:</strong> Dr. Alok Verma</p>
                <p><strong>Official Phone:</strong> +91 98350 12845</p>
                <p><strong>Official Work Email:</strong> hr.alok@apollodiagnostics.in</p>
                <p><strong>Office Locality:</strong> Muhammadpur, Patna, Bihar</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                showToast('Profile information verified.');
              }}
              className="w-full py-2.5 bg-[#0047AB] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. MODAL: NOTIFICATIONS */}
      {/* ========================================================================= */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-base text-slate-900">Notifications</h3>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-900">
                <p className="font-bold">Job Post Rejected: "Iron Man"</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Title needs clarification. Tap "See why" on your card.</p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <p className="font-bold">5 New Hot Leads Matched</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Candidates in Delhi & Patna matched your requirements.</p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
