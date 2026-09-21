import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Check,
  X,
  Sparkles,
  Search,
} from 'lucide-react';
import { Job, Application } from '../types';

interface EmployerPortalProps {
  jobs: Job[];
  onAddJob: (job: Job) => void;
  applications: Application[];
  onUpdateApplicationStatus: (appId: string, newStatus: any) => void;
  onOpenSwitchMode: () => void;
}

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  jobs,
  onAddJob,
  applications,
  onUpdateApplicationStatus,
  onOpenSwitchMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'post-job' | 'candidates'>('listings');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Job Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Apollo Diagnostics Patna');
  const [locality, setLocality] = useState('Muhammadpur, Patna');
  const [minSalary, setMinSalary] = useState('25000');
  const [maxSalary, setMaxSalary] = useState('40000');
  const [vacancies, setVacancies] = useState('4');
  const [jobType, setJobType] = useState<'Full Time' | 'Part Time' | 'Work From Home'>('Full Time');
  const [experience, setExperience] = useState('1 - 3 Yrs');
  const [skills, setSkills] = useState('Nursing, Patient Care, ICU Support');
  const [description, setDescription] = useState('Looking for dedicated professionals to join our expanding clinical team in Patna.');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob: Job = {
      id: `job-emp-${Date.now()}`,
      title,
      company,
      companyLogoBg: '#059669',
      companyLogoText: company.slice(0, 2).toUpperCase(),
      location: 'Patna, Bihar',
      locality: locality.split(',')[0].trim(),
      distance: 'Within 2.0 km',
      salary: `₹${parseInt(minSalary).toLocaleString('en-IN')} - ₹${parseInt(maxSalary).toLocaleString('en-IN')} / mo`,
      minSalary: parseInt(minSalary) || 25000,
      maxSalary: parseInt(maxSalary) || 40000,
      experience,
      jobType,
      isWorkFromHome: jobType === 'Work From Home',
      isHighSalary: parseInt(maxSalary) >= 35000,
      isUrgent: true,
      isNew: true,
      postedTime: 'Just now',
      applicantsCount: 0,
      vacancies: parseInt(vacancies) || 1,
      description,
      responsibilities: [
        'Deliver high quality clinical or organizational care following protocol.',
        'Coordinate daily shifts, documentation, and candidate handovers.',
        'Maintain highest patient and workplace standards.',
      ],
      requiredSkills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      benefits: ['PF & ESI', 'Overtime Bonus', 'Health Insurance'],
      aboutCompany: {
        rating: 4.8,
        reviewsCount: 340,
        employees: '500+ employees',
        industry: 'Healthcare & Clinical Services',
        address: `${locality}, Patna, Bihar`,
        verified: true,
      },
    };

    onAddJob(newJob);
    setSuccessMessage(`Job "${title}" published successfully! Now visible to candidates in Patna.`);
    setActiveSubTab('listings');
    setTitle('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div id="employer-portal-view" className="min-h-screen bg-[#F8FAFC] pb-24 text-[#1E2544]">
      {/* Top Employer Bar */}
      <div className="bg-[#1E2544] text-white px-4 py-3 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm tracking-tight text-white">
                  Employer / HR Dashboard
                </h1>
                <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Verified HR
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Apollo Diagnostics • Patna Hub
              </p>
            </div>
          </div>

          <button
            id="employer-switch-mode-btn"
            onClick={onOpenSwitchMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            <span>Switch Mode</span>
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex gap-2 mt-3 pt-2 border-t border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'listings'
                ? 'bg-white text-[#1E2544] font-bold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            My Job Postings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('post-job')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeSubTab === 'post-job'
                ? 'bg-[#F59E0B] text-black font-bold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Job</span>
          </button>
          <button
            onClick={() => setActiveSubTab('candidates')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'candidates'
                ? 'bg-white text-[#1E2544] font-bold'
                : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            Applicants ({applications.length})
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="mx-4 mt-3 bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl p-3 flex items-center gap-2.5 text-[#0F8A43] text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Content Areas */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs text-center">
            <span className="text-[11px] font-semibold text-gray-500 block">Active Jobs</span>
            <span className="text-xl font-extrabold text-[#1E2544]">{jobs.length}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs text-center">
            <span className="text-[11px] font-semibold text-gray-500 block">Total Applicants</span>
            <span className="text-xl font-extrabold text-[#10B981]">{applications.length + 38}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs text-center">
            <span className="text-[11px] font-semibold text-gray-500 block">Interviews</span>
            <span className="text-xl font-extrabold text-[#4055B8]">
              {applications.filter((a) => a.status === 'Interview').length + 5}
            </span>
          </div>
        </div>

        {/* Tab 1: Job Listings */}
        {activeSubTab === 'listings' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1E2544]">Active Posted Jobs in Patna & Bihar</h2>
              <button
                onClick={() => setActiveSubTab('post-job')}
                className="text-xs text-[#4055B8] font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Job</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs hover:border-[#4055B8]/30 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#1E2544] leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {job.company} • {job.locality}, {job.location}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <span className="font-bold text-[#10B981]">{job.salary}</span>
                    <span>•</span>
                    <span>{job.experience}</span>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      {job.jobType}
                    </span>
                    <span className="ml-auto text-[11px] text-gray-400 font-medium">
                      {job.applicantsCount || 8} applicants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Post New Job */}
        {activeSubTab === 'post-job' && (
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-[#1E2544]">
                Create & Post a New Job Listing
              </h2>
              <p className="text-xs text-gray-500">
                Immediately published to job seekers in Patna and surrounding areas
              </p>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Job Designation / Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ICU Duty Doctor / Clinical Nurse"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#4055B8] focus:ring-1 focus:ring-[#4055B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company / Clinic Name
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#4055B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Locality (Patna Area)
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Muhammadpur, Patna"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#4055B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Min Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Max Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Vacancies
                  </label>
                  <input
                    type="number"
                    value={vacancies}
                    onChange={(e) => setVacancies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Required Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Fresher">Fresher (0 Yrs)</option>
                    <option value="1 - 3 Yrs">1 - 3 Yrs</option>
                    <option value="3 - 5 Yrs">3 - 5 Yrs</option>
                    <option value="5+ Yrs">5+ Yrs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. ICU Care, Vital Monitoring, GNM"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <button
                type="submit"
                id="publish-job-btn"
                className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Publish Job Now</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Candidates Applied */}
        {activeSubTab === 'candidates' && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#1E2544]">
              Candidate Applications ({applications.length})
            </h2>

            <div className="space-y-2.5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1E2544]">
                        Applicant for: {app.jobTitle}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Applied on {app.appliedDate} • {app.location}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        app.status === 'Interview'
                          ? 'bg-purple-100 text-purple-700'
                          : app.status === 'Shortlisted'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Actions for employer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                      className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Shortlist</span>
                    </button>
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'Interview')}
                      className="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Interview</span>
                    </button>
                    <button
                      onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                      className="py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
