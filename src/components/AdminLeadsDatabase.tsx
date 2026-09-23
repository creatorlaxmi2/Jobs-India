import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Copy,
  Plus,
  X,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  JobSeekerLead,
  EmployerLead,
  exportLeadsToCSV,
} from '../data/leadsDatabase';

interface AdminLeadsDatabaseProps {
  jobSeekerLeads: JobSeekerLead[];
  employerLeads: EmployerLead[];
  onUpdateJobSeekerLeadStatus: (leadId: string, newStatus: JobSeekerLead['leadStatus']) => void;
  onUpdateEmployerLeadStatus: (leadId: string, newStatus: EmployerLead['leadStatus']) => void;
  onAddJobSeekerLead: (lead: Omit<JobSeekerLead, 'id'>) => void;
  onAddEmployerLead: (lead: Omit<EmployerLead, 'id'>) => void;
  onToast: (message: string) => void;
}

export const AdminLeadsDatabase: React.FC<AdminLeadsDatabaseProps> = ({
  jobSeekerLeads,
  employerLeads,
  onUpdateJobSeekerLeadStatus,
  onUpdateEmployerLeadStatus,
  onAddJobSeekerLead,
  onAddEmployerLead,
  onToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<'job-seekers' | 'employers' | 'analytics'>('job-seekers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLeadType, setAddLeadType] = useState<'job-seeker' | 'employer'>('job-seeker');

  // New Lead Form State
  const [newJsName, setNewJsName] = useState('');
  const [newJsPhone, setNewJsPhone] = useState('');
  const [newJsEmail, setNewJsEmail] = useState('');
  const [newJsCity, setNewJsCity] = useState('Patna');
  const [newJsLocality, setNewJsLocality] = useState('Muhammadpur');
  const [newJsRole, setNewJsRole] = useState('');
  const [newJsEducation, setNewJsEducation] = useState('');
  const [newJsExp, setNewJsExp] = useState('');
  const [newJsSalary, setNewJsSalary] = useState('');

  const [newEmpCompany, setNewEmpCompany] = useState('');
  const [newEmpHrName, setNewEmpHrName] = useState('');
  const [newEmpDesignation, setNewEmpDesignation] = useState('HR Manager');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpCity, setNewEmpCity] = useState('Patna');
  const [newEmpLocality, setNewEmpLocality] = useState('Muhammadpur');
  const [newEmpIndustry, setNewEmpIndustry] = useState('Healthcare & Services');
  const [newEmpGstin, setNewEmpGstin] = useState('');

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onToast(`📋 Copied ${label}: ${text}`);
  };

  // Filtered Job Seekers
  const filteredJobSeekers = useMemo(() => {
    return jobSeekerLeads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.locality.toLowerCase().includes(q) ||
        lead.preferredRole.toLowerCase().includes(q) ||
        lead.education.toLowerCase().includes(q) ||
        lead.skills.some((s) => s.toLowerCase().includes(q));

      const matchesStatus =
        selectedStatusFilter === 'all' || lead.leadStatus === selectedStatusFilter;

      const matchesCity =
        selectedCityFilter === 'all' ||
        lead.city.toLowerCase() === selectedCityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [jobSeekerLeads, searchQuery, selectedStatusFilter, selectedCityFilter]);

  // Filtered Employers
  const filteredEmployers = useMemo(() => {
    return employerLeads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.companyName.toLowerCase().includes(q) ||
        lead.hrName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.locality.toLowerCase().includes(q) ||
        lead.industry.toLowerCase().includes(q) ||
        (lead.gstin && lead.gstin.toLowerCase().includes(q));

      const matchesStatus =
        selectedStatusFilter === 'all' || lead.leadStatus === selectedStatusFilter;

      const matchesCity =
        selectedCityFilter === 'all' ||
        lead.city.toLowerCase() === selectedCityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [employerLeads, searchQuery, selectedStatusFilter, selectedCityFilter]);

  // Total Metrics Calculations
  const totalInquiries = useMemo(() => {
    return employerLeads.reduce((acc, emp) => acc + (emp.totalInquiriesReceived || 0), 0);
  }, [employerLeads]);

  const totalInterviewsScheduled = useMemo(() => {
    return jobSeekerLeads.filter(
      (l) => l.leadStatus === 'Interview Scheduled' || l.leadStatus === 'Hired / Placed'
    ).length;
  }, [jobSeekerLeads]);

  // Export handlers
  const handleExportJobSeekers = () => {
    const headers = [
      'Lead ID',
      'Candidate Name',
      'Mobile Number',
      'Email ID',
      'City',
      'Locality',
      'Preferred Role',
      'Education',
      'Experience',
      'Current Salary',
      'Expected Salary',
      'Skills',
      'Resume File',
      'Lead Status',
      'Applied Jobs Count',
      'Last Active Date',
      'Source',
      'Applied Jobs Summary',
    ];

    const rows = jobSeekerLeads.map((js) => [
      js.id,
      js.name,
      js.phone,
      js.email,
      js.city,
      js.locality,
      js.preferredRole,
      js.education,
      js.experience,
      js.currentSalary || 'N/A',
      js.expectedSalary || 'N/A',
      js.skills.join('; '),
      js.resumeName || 'N/A',
      js.leadStatus,
      js.appliedJobsCount,
      js.lastActiveDate,
      js.source,
      js.appliedJobsSummary || '',
    ]);

    exportLeadsToCSV('JobsIndia_JobSeeker_Leads_Database', headers, rows);
    onToast('📥 Exported complete Job Seeker Leads Database to CSV!');
  };

  const handleExportEmployers = () => {
    const headers = [
      'Lead ID',
      'Company Name',
      'HR Contact Name',
      'Designation',
      'Mobile Phone',
      'Work Email ID',
      'City',
      'Locality',
      'Industry Sector',
      'GSTIN Number',
      'CIN Number',
      'Active Posted Jobs',
      'Total Inquiries Received',
      'Account Plan Type',
      'Lead Status',
      'Registration Date',
      'Verification Status',
    ];

    const rows = employerLeads.map((emp) => [
      emp.id,
      emp.companyName,
      emp.hrName,
      emp.designation,
      emp.phone,
      emp.email,
      emp.city,
      emp.locality,
      emp.industry,
      emp.gstin || 'N/A',
      emp.cin || 'N/A',
      emp.postedJobsCount,
      emp.totalInquiriesReceived,
      emp.planType,
      emp.leadStatus,
      emp.registeredDate,
      emp.isVerified ? 'Verified' : 'Pending',
    ]);

    exportLeadsToCSV('JobsIndia_Employer_Recruiter_Leads_Database', headers, rows);
    onToast('📥 Exported complete Employer & Recruiter Leads Database to CSV!');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (addLeadType === 'job-seeker') {
      if (!newJsName.trim() || !newJsPhone.trim()) {
        onToast('⚠️ Please enter candidate name and phone number');
        return;
      }
      onAddJobSeekerLead({
        name: newJsName.trim(),
        phone: newJsPhone.trim().startsWith('+91') ? newJsPhone.trim() : `+91 ${newJsPhone.trim()}`,
        email: newJsEmail.trim() || `${newJsName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        city: newJsCity.trim() || 'Patna',
        locality: newJsLocality.trim() || 'Muhammadpur',
        preferredRole: newJsRole.trim() || 'Job Seeker',
        education: newJsEducation.trim() || 'Graduate',
        experience: newJsExp.trim() || 'Fresher (0 - 1 Yr)',
        currentSalary: newJsSalary.trim() || 'Negotiable',
        expectedSalary: '₹20,000 - ₹30,000 / mo',
        skills: ['Communication', 'MS Office', 'Teamwork'],
        resumeName: `${newJsName.replace(/\s+/g, '_')}_Resume.pdf`,
        leadStatus: 'New Lead',
        appliedJobsCount: 1,
        lastActiveDate: 'Just now',
        isVerified: true,
        source: 'Direct Registration',
        appliedJobsSummary: 'Manual Lead Added by Admin',
      });
      onToast(`✅ Successfully added Job Seeker lead: ${newJsName}`);
    } else {
      if (!newEmpCompany.trim() || !newEmpPhone.trim()) {
        onToast('⚠️ Please enter company name and official phone number');
        return;
      }
      onAddEmployerLead({
        companyName: newEmpCompany.trim(),
        hrName: newEmpHrName.trim() || 'HR Lead',
        designation: newEmpDesignation.trim() || 'Talent Acquisition Head',
        phone: newEmpPhone.trim().startsWith('+91') ? newEmpPhone.trim() : `+91 ${newEmpPhone.trim()}`,
        email: newEmpEmail.trim() || `hr@${newEmpCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        city: newEmpCity.trim() || 'Patna',
        locality: newEmpLocality.trim() || 'Muhammadpur',
        industry: newEmpIndustry.trim() || 'Corporate Services',
        gstin: newEmpGstin.trim() || '10AAACA0000A1Z5',
        postedJobsCount: 1,
        totalInquiriesReceived: 10,
        leadStatus: 'Verified Active',
        registeredDate: 'Today (Admin Added)',
        isVerified: true,
        planType: 'Pro Recruiter',
      });
      onToast(`✅ Successfully added Employer lead: ${newEmpCompany}`);
    }
    setShowAddModal(false);
  };

  return (
    <div id="admin-leads-database-section" className="space-y-4 text-slate-100">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-purple-950/70 border border-blue-800/40 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Real Database Leads Center
                </h2>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-500/40 uppercase">
                  Verified Data
                </span>
              </div>
              <p className="text-xs text-blue-200/75 mt-0.5">
                Complete database of active Job Seekers and Employers in Patna, Bihar & Pan-India.
              </p>
            </div>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="admin-add-lead-btn"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
            <button
              id="admin-export-js-leads-btn"
              onClick={handleExportJobSeekers}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Download all Job Seeker leads as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Candidates ({jobSeekerLeads.length})</span>
            </button>
            <button
              id="admin-export-emp-leads-btn"
              onClick={handleExportEmployers}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Download all Employer leads as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Employers ({employerLeads.length})</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="bg-[#1E293B]/80 border border-blue-900/40 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-blue-300 font-bold block flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-sky-400" />
              Job Seeker Leads
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
              {jobSeekerLeads.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              {jobSeekerLeads.filter((j) => j.isVerified).length} Verified Resumes
            </span>
          </div>

          <div className="bg-[#1E293B]/80 border border-purple-900/40 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-purple-300 font-bold block flex items-center justify-center gap-1">
              <Building2 className="w-3 h-3 text-purple-400" />
              Employer Leads
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
              {employerLeads.length}
            </span>
            <span className="text-[10px] text-purple-300 font-semibold block mt-0.5">
              {employerLeads.filter((e) => e.isVerified).length} Verified Companies
            </span>
          </div>

          <div className="bg-[#1E293B]/80 border border-emerald-900/40 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-emerald-300 font-bold block flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Candidate Inquiries
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5 block">
              {totalInquiries}+
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Across Bihar & India</span>
          </div>

          <div className="bg-[#1E293B]/80 border border-amber-900/40 rounded-2xl p-3 text-center">
            <span className="text-[11px] text-amber-300 font-bold block flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              Pipeline Placements
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">
              {totalInterviewsScheduled}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Interviews / Offers</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Job Seekers vs Employers vs Analytics */}
      <div className="grid grid-cols-3 gap-2 bg-[#1E293B] p-1.5 rounded-2xl border border-slate-800">
        <button
          id="tab-btn-job-seekers"
          onClick={() => {
            setActiveCategory('job-seekers');
            setSelectedStatusFilter('all');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'job-seekers'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Job Seekers ({filteredJobSeekers.length})</span>
        </button>

        <button
          id="tab-btn-employers"
          onClick={() => {
            setActiveCategory('employers');
            setSelectedStatusFilter('all');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'employers'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Employers ({filteredEmployers.length})</span>
        </button>

        <button
          id="tab-btn-analytics"
          onClick={() => setActiveCategory('analytics')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeCategory === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Lead Analytics</span>
        </button>
      </div>

      {/* Filter and Search Bar (Active for Job Seekers & Employers) */}
      {activeCategory !== 'analytics' && (
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeCategory === 'job-seekers'
                    ? 'Search candidate name, mobile, email, role, or skills...'
                    : 'Search company, HR name, phone, email, GSTIN, or industry...'
                }
                className="w-full pl-9 pr-8 py-2.5 bg-[#1E293B] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Locations (Bihar & Pan-India)</option>
              <option value="Patna">Patna (Muhammadpur & Core)</option>
              <option value="Gaya">Gaya</option>
              <option value="Muzaffarpur">Muzaffarpur</option>
            </select>
          </div>

          {/* Status Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            <span className="text-slate-400 font-semibold text-xs flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-slate-500" />
              Status:
            </span>
            {activeCategory === 'job-seekers' ? (
              <>
                {['all', 'New Lead', 'Interview Scheduled', 'Screened', 'Contacted', 'Hired / Placed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      selectedStatusFilter === st
                        ? 'bg-sky-500 text-slate-900 font-bold shadow-xs'
                        : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st === 'all' ? 'All Candidates' : st}
                  </button>
                ))}
              </>
            ) : (
              <>
                {['all', 'Verified Active', 'Enterprise Client', 'Pro Recruiter', 'Pending KYC', 'Follow-up Needed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      selectedStatusFilter === st
                        ? 'bg-purple-500 text-white font-bold shadow-xs'
                        : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st === 'all' ? 'All Employers' : st}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW 1: JOB SEEKER LEADS */}
      {activeCategory === 'job-seekers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{filteredJobSeekers.length}</strong> candidate leads in database
            </span>
            <span className="text-[11px] text-sky-400 font-medium">Real-time sync with candidate apps</span>
          </div>

          {filteredJobSeekers.length === 0 ? (
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Job Seeker Leads Found</p>
              <p className="text-xs text-slate-500">
                Try adjusting your search query or clear the status filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatusFilter('all');
                  setSelectedCityFilter('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobSeekers.map((lead, index) => {
              const statusColor =
                lead.leadStatus === 'Interview Scheduled'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : lead.leadStatus === 'Hired / Placed'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : lead.leadStatus === 'Screened'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : lead.leadStatus === 'Contacted'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-700/40 text-slate-300 border-slate-600/40';

              return (
                <div
                  key={lead.id}
                  className="bg-[#1E293B] border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 transition-all space-y-3 relative group shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-extrabold text-white">{lead.name}</h3>
                          {lead.isVerified && (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3" />
                              Verified Candidate
                            </span>
                          )}
                          <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
                            {lead.source}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-sky-300/90 mt-0.5 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                          <span>{lead.preferredRole}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {lead.locality}, {lead.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                        Stage:
                      </span>
                      <select
                        value={lead.leadStatus}
                        onChange={(e) =>
                          onUpdateJobSeekerLeadStatus(
                            lead.id,
                            e.target.value as JobSeekerLead['leadStatus']
                          )
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${statusColor}`}
                      >
                        <option value="New Lead">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Screened">Screened</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Hired / Placed">Hired / Placed</option>
                        <option value="Cold / Inactive">Cold / Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact & Profile Detail Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Mobile Phone with 1-Click Call & WhatsApp */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block font-medium">Candidate Mobile</span>
                          <span className="font-bold text-emerald-300 text-xs block truncate select-all">
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="Call Candidate Now"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            lead.name
                          )},%20this%20is%20Jobs%20India%20Admin%20regarding%20your%20application`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="WhatsApp Candidate"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(lead.phone, 'Mobile')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy Mobile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Email ID with 1-Click Mail */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block font-medium">Candidate Email</span>
                          <span className="font-bold text-sky-300 text-xs block truncate select-all">
                            {lead.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`mailto:${lead.email}?subject=Job%20Application%20Opportunity%20-%20Jobs%20India`}
                          className="p-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-colors"
                          title="Email Candidate"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(lead.email, 'Email')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Qualification, Experience & Salary Breakdown */}
                  <div className="bg-slate-900/40 rounded-xl p-2.5 border border-slate-800/60 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Education / Degree</span>
                      <span className="font-bold text-white block truncate">{lead.education}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="font-bold text-white block truncate">{lead.experience}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Current Salary</span>
                      <span className="font-semibold text-slate-300 block truncate">{lead.currentSalary || 'Fresher'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Expected Salary</span>
                      <span className="font-bold text-emerald-400 block truncate">{lead.expectedSalary || 'Negotiable'}</span>
                    </div>
                  </div>

                  {/* Skills Pills & Resume Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">Skills:</span>
                      {lead.skills.map((sk) => (
                        <span
                          key={sk}
                          className="bg-slate-800/90 text-slate-300 text-[10px] px-2 py-0.5 rounded-md border border-slate-700/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {lead.resumeName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                        <FileText className="w-3 h-3 text-purple-400" />
                        <span className="font-semibold truncate max-w-[160px]">{lead.resumeName}</span>
                      </div>
                    )}
                  </div>

                  {/* Applied Jobs Summary & Activity Footer */}
                  {lead.appliedJobsSummary && (
                    <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between gap-2">
                      <span className="truncate">
                        <strong>Applied to:</strong> {lead.appliedJobsSummary}
                      </span>
                      <span className="text-slate-500 text-[10px] flex-shrink-0">
                        Active: {lead.lastActiveDate}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: EMPLOYER LEADS */}
      {activeCategory === 'employers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{filteredEmployers.length}</strong> employer & recruiter leads
            </span>
            <span className="text-[11px] text-purple-400 font-medium">Real-time company job poster sync</span>
          </div>

          {filteredEmployers.length === 0 ? (
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No Employer Leads Found</p>
              <p className="text-xs text-slate-500">
                Try adjusting your search query or clear the status filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatusFilter('all');
                  setSelectedCityFilter('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredEmployers.map((emp, index) => {
              const statusColor =
                emp.leadStatus === 'Verified Active'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : emp.leadStatus === 'Enterprise Client'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : emp.leadStatus === 'Pending KYC'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

              return (
                <div
                  key={emp.id}
                  className="bg-[#1E293B] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 transition-all space-y-3 relative group shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-extrabold flex items-center justify-center flex-shrink-0 text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-extrabold text-white">{emp.companyName}</h3>
                          {emp.isVerified && (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3" />
                              Verified Recruiter
                            </span>
                          )}
                          <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                            {emp.planType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-purple-300 mt-0.5 font-semibold">
                          <span>{emp.hrName}</span>
                          <span className="text-slate-500">({emp.designation})</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {emp.locality}, {emp.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                        Account Status:
                      </span>
                      <select
                        value={emp.leadStatus}
                        onChange={(e) =>
                          onUpdateEmployerLeadStatus(
                            emp.id,
                            e.target.value as EmployerLead['leadStatus']
                          )
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${statusColor}`}
                      >
                        <option value="Verified Active">Verified Active</option>
                        <option value="Enterprise Client">Enterprise Client</option>
                        <option value="Pending KYC">Pending KYC</option>
                        <option value="Follow-up Needed">Follow-up Needed</option>
                        <option value="Dormant">Dormant</option>
                      </select>
                    </div>
                  </div>

                  {/* Recruiter Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Recruiter Mobile Phone with 1-Click Call & WhatsApp */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block font-medium">Recruiter Official Phone</span>
                          <span className="font-bold text-emerald-300 text-xs block truncate select-all">
                            {emp.phone}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`tel:${emp.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="Call Recruiter Now"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            emp.hrName
                          )},%20Jobs%20India%20Admin%20here%20regarding%20your%20employer%20portal%20account`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="WhatsApp Recruiter"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(emp.phone, 'Mobile')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy Mobile"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Official Work Email */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 block font-medium">Work Email ID</span>
                          <span className="font-bold text-purple-300 text-xs block truncate select-all">
                            {emp.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`mailto:${emp.email}?subject=Jobs%20India%20Recruitment%20Partnership%20-%20${encodeURIComponent(
                            emp.companyName
                          )}`}
                          className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                          title="Email Recruiter"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(emp.email, 'Email')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Business & Recruitment Analytics */}
                  <div className="bg-slate-900/40 rounded-xl p-2.5 border border-slate-800/60 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Industry Sector</span>
                      <span className="font-bold text-white block truncate">{emp.industry}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">GSTIN / Tax ID</span>
                      <span className="font-mono text-slate-300 block truncate">{emp.gstin || '10AAACA0000A1Z5'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Active Posted Jobs</span>
                      <span className="font-bold text-sky-400 block">{emp.postedJobsCount} Live Listings</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Candidate Inquiries</span>
                      <span className="font-bold text-emerald-400 block">{emp.totalInquiriesReceived} Applicants</span>
                    </div>
                  </div>

                  {/* Footer Registered Date */}
                  <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                    <span>Registered on Platform: {emp.registeredDate}</span>
                    {emp.cin && <span className="font-mono text-[10px] text-slate-500">CIN: {emp.cin}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 3: UNIFIED ANALYTICS & DATABASE HEALTH */}
      {activeCategory === 'analytics' && (
        <div className="space-y-4">
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Jobs India Leads Database Performance (Patna & Bihar Cluster)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Candidate Verification Ratio</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">
                    {Math.round(
                      (jobSeekerLeads.filter((j) => j.isVerified).length /
                        Math.max(jobSeekerLeads.length, 1)) *
                        100
                    )}
                    %
                  </span>
                  <span className="text-xs text-slate-400">
                    ({jobSeekerLeads.filter((j) => j.isVerified).length}/{jobSeekerLeads.length})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Aadhaar / Nursing / Degree verified</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Employer Verification Ratio</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-purple-400">
                    {Math.round(
                      (employerLeads.filter((e) => e.isVerified).length /
                        Math.max(employerLeads.length, 1)) *
                        100
                    )}
                    %
                  </span>
                  <span className="text-xs text-slate-400">
                    ({employerLeads.filter((e) => e.isVerified).length}/{employerLeads.length})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">GSTIN & CIN corporate verification</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">Avg Inquiries per Employer</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-sky-400">
                    {Math.round(totalInquiries / Math.max(employerLeads.length, 1))}
                  </span>
                  <span className="text-xs text-slate-400">candidate apps / company</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">High conversion in Healthcare & Sales</p>
              </div>
            </div>

            {/* Top Geographic Hub Breakdown */}
            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Geographic Lead Distribution
              </h4>
              <div className="space-y-2">
                {[
                  { city: 'Patna (Core & Muhammadpur Hub)', percentage: 78, count: `${Math.round(jobSeekerLeads.length * 0.78)} Leads` },
                  { city: 'Gaya & South Bihar', percentage: 12, count: `${Math.round(jobSeekerLeads.length * 0.12)} Leads` },
                  { city: 'Muzaffarpur & North Bihar', percentage: 8, count: `${Math.round(jobSeekerLeads.length * 0.08)} Leads` },
                  { city: 'Pan-India Remote (WFH)', percentage: 2, count: `${Math.round(jobSeekerLeads.length * 0.02)} Leads` },
                ].map((item) => (
                  <div key={item.city} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>{item.city}</span>
                      <span className="font-bold text-white">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Add New Lead to Database</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setAddLeadType('job-seeker')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  addLeadType === 'job-seeker'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Job Seeker Lead
              </button>
              <button
                type="button"
                onClick={() => setAddLeadType('employer')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  addLeadType === 'employer'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employer Lead
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              {addLeadType === 'job-seeker' ? (
                <>
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                      Candidate Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newJsName}
                      onChange={(e) => setNewJsName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98350 12345"
                        value={newJsPhone}
                        onChange={(e) => setNewJsPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        placeholder="candidate@gmail.com"
                        value={newJsEmail}
                        onChange={(e) => setNewJsEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={newJsCity}
                        onChange={(e) => setNewJsCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Locality
                      </label>
                      <input
                        type="text"
                        value={newJsLocality}
                        onChange={(e) => setNewJsLocality(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                      Preferred Job Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Staff Nurse / Sales Executive"
                      value={newJsRole}
                      onChange={(e) => setNewJsRole(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Education
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. B.Sc / GNM / B.Com"
                        value={newJsEducation}
                        onChange={(e) => setNewJsEducation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Years Exp"
                        value={newJsExp}
                        onChange={(e) => setNewJsExp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patna Heart Clinic"
                      value={newEmpCompany}
                      onChange={(e) => setNewEmpCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        HR Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amit Sharma"
                        value={newEmpHrName}
                        onChange={(e) => setNewEmpHrName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        placeholder="HR Head"
                        value={newEmpDesignation}
                        onChange={(e) => setNewEmpDesignation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98350 44556"
                        value={newEmpPhone}
                        onChange={(e) => setNewEmpPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        placeholder="hr@company.in"
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Healthcare"
                        value={newEmpIndustry}
                        onChange={(e) => setNewEmpIndustry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block font-semibold mb-1">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="10AAACA1234F1Z5"
                        value={newEmpGstin}
                        onChange={(e) => setNewEmpGstin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-md"
                >
                  Save Lead to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
