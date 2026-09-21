import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  ChevronDown,
  RotateCw,
  SlidersHorizontal,
  X,
  IndianRupee,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { Job, JobType } from '../types';
import { JobCard } from './JobCard';

interface AllJobsTabProps {
  jobs: Job[];
  savedJobIds: Set<string>;
  onToggleSave: (jobId: string) => void;
  onApplyJob: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  currentCity: string;
  currentLocality: string;
  initialFilter?: string | null;
}

type SortOption = 'relevance' | 'latest' | 'salary';

export const AllJobsTab: React.FC<AllJobsTabProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onApplyJob,
  onSelectJob,
  currentCity,
  currentLocality,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [onlyWFH, setOnlyWFH] = useState<boolean>(initialFilter === 'wfh');
  const [onlyHighSalary, setOnlyHighSalary] = useState<boolean>(
    initialFilter === 'high-salary'
  );
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Experience options
  const EXPERIENCE_OPTIONS = ['All', 'Fresher', '1 - 3 Yrs', '3+ Yrs'];
  // Job Type options
  const JOB_TYPES = ['All', 'Full Time', 'Part Time', 'Work From Home'];
  // Location options
  const LOCATION_OPTIONS = [
    'All',
    'Muhammadpur',
    'Kankarbagh',
    'Bailey Road',
    'Boring Road',
    'Patliputra',
  ];

  // Pull to refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchSkills = job.requiredSkills.some((s) =>
            s.toLowerCase().includes(q)
          );
          const matchLoc = job.location.toLowerCase().includes(q) || job.locality.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchSkills && !matchLoc) {
            return false;
          }
        }

        // Job Type
        if (selectedJobType !== 'All' && job.jobType !== selectedJobType) {
          return false;
        }

        // Work From Home
        if (onlyWFH && !job.isWorkFromHome) {
          return false;
        }

        // High Salary
        if (onlyHighSalary && !job.isHighSalary && job.maxSalary < 30000) {
          return false;
        }

        // Experience
        if (selectedExperience !== 'All') {
          if (selectedExperience === 'Fresher' && !job.experience.toLowerCase().includes('fresher') && !job.experience.includes('0')) {
            return false;
          }
          if (selectedExperience === '1 - 3 Yrs' && !job.experience.includes('1') && !job.experience.includes('2') && !job.experience.includes('3')) {
            return false;
          }
        }

        // Location
        if (selectedLocation !== 'All' && !job.locality.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'latest') {
          return a.isNew ? -1 : 1;
        }
        if (selectedSort === 'salary') {
          return b.maxSalary - a.maxSalary;
        }
        // Relevance: Urgent first, then high salary
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0;
      });
  }, [
    jobs,
    searchQuery,
    selectedJobType,
    onlyWFH,
    onlyHighSalary,
    selectedExperience,
    selectedLocation,
    selectedSort,
  ]);

  const activeFiltersCount =
    (selectedJobType !== 'All' ? 1 : 0) +
    (onlyWFH ? 1 : 0) +
    (onlyHighSalary ? 1 : 0) +
    (selectedExperience !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSelectedJobType('All');
    setOnlyWFH(false);
    setOnlyHighSalary(false);
    setSelectedExperience('All');
    setSelectedLocation('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-3 pb-20 pt-1">
      {/* Top Search & Filter Bar */}
      <div className="px-4 space-y-2 sticky top-[57px] bg-[#F0F2F7] z-20 py-2">
        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="flex-1 relative flex items-center bg-white rounded-xl border border-[#E5E7EB] shadow-xs px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, skills or hospital/firm..."
              className="w-full bg-transparent text-sm text-[#1E2544] outline-hidden placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Drawer Toggle Button */}
          <button
            id="all-jobs-filters-btn"
            onClick={() => setShowFilterDrawer(true)}
            className={`relative p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              activeFiltersCount > 0
                ? 'bg-[#EEF2FF] border-[#4055B8] text-[#4055B8]'
                : 'bg-white border-[#E5E7EB] text-gray-700 hover:bg-gray-50'
            }`}
            title="All Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#4055B8] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setOnlyHighSalary(!onlyHighSalary)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1 border ${
              onlyHighSalary
                ? 'bg-[#35A853] text-white border-[#35A853] shadow-xs'
                : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-gray-300'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>High Salary</span>
          </button>

          <button
            onClick={() => setOnlyWFH(!onlyWFH)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
              onlyWFH
                ? 'bg-[#6B3FC7] text-white border-[#6B3FC7] shadow-xs'
                : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-gray-300'
            }`}
          >
            Work From Home
          </button>

          <button
            onClick={() =>
              setSelectedJobType(selectedJobType === 'Full Time' ? 'All' : 'Full Time')
            }
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
              selectedJobType === 'Full Time'
                ? 'bg-[#4055B8] text-white border-[#4055B8] shadow-xs'
                : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-gray-300'
            }`}
          >
            Full Time
          </button>

          <button
            onClick={() =>
              setSelectedExperience(
                selectedExperience === 'Fresher' ? 'All' : 'Fresher'
              )
            }
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
              selectedExperience === 'Fresher'
                ? 'bg-[#4055B8] text-white border-[#4055B8] shadow-xs'
                : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-gray-300'
            }`}
          >
            Fresher
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs px-2.5 py-1.5 rounded-full text-[#E83B45] hover:bg-[#FEF2F2] font-semibold whitespace-nowrap flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Sorting Bar & Results Count */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1 text-[#687386]">
            <span className="font-bold text-[#1E2544]">{filteredJobs.length}</span>
            <span>jobs in {currentCity}</span>
            <button
              onClick={handleRefresh}
              className="ml-1 text-[#4055B8] hover:rotate-180 transition-transform p-1"
              title="Refresh jobs"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
            <span className="text-gray-400 font-medium">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-transparent font-bold text-[#1E2544] text-xs outline-hidden cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="latest">Latest</option>
              <option value="salary">Salary (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SKELETON LOADING STATE WHEN REFRESHING */}
      {isRefreshing ? (
        <div className="px-4 space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-200 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-2/3 h-4 bg-gray-200 rounded-sm" />
                  <div className="w-1/2 h-3 bg-gray-100 rounded-sm" />
                </div>
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-lg" />
              <div className="flex gap-2">
                <div className="w-20 h-4 bg-gray-100 rounded-sm" />
                <div className="w-24 h-4 bg-gray-100 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        /* EMPTY STATE */
        <div className="px-4 py-12 text-center bg-white rounded-2xl border border-[#E5E7EB] mx-4 space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] text-[#4055B8] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1E2544]">
            No matching jobs found
          </h3>
          <p className="text-xs text-[#687386] max-w-xs mx-auto">
            Try adjusting your search terms or remove some filters to explore more
            opportunities.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#4055B8] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#34459B] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* JOB LISTINGS */
        <div className="px-4 space-y-3">
          {filteredJobs.slice(0, visibleCount).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.has(job.id)}
              onToggleSave={onToggleSave}
              onApply={onApplyJob}
              onSelectJob={onSelectJob}
            />
          ))}

          {/* Load More / Pagination */}
          {visibleCount < filteredJobs.length && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="w-full py-2.5 bg-white border border-[#E5E7EB] hover:border-[#4055B8] text-[#4055B8] rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Load More Jobs ({filteredJobs.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* FILTER BOTTOM SHEET / DRAWER */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#4055B8]" />
                <h3 className="text-base font-bold text-[#1E2544]">
                  Filter Jobs
                </h3>
              </div>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E2544]">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedJobType(type)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                      selectedJobType === type
                        ? 'bg-[#4055B8] text-white border-[#4055B8]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E2544]">
                Experience
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExperience(exp)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                      selectedExperience === exp
                        ? 'bg-[#4055B8] text-white border-[#4055B8]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Locality in Patna */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1E2544]">
                Locality / Area
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                      selectedLocation === loc
                        ? 'bg-[#4055B8] text-white border-[#4055B8]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-xs font-semibold text-gray-800">
                  High Salary Only (₹30,000+)
                </span>
                <input
                  type="checkbox"
                  checked={onlyHighSalary}
                  onChange={(e) => setOnlyHighSalary(e.target.checked)}
                  className="w-4 h-4 text-[#4055B8] rounded-sm accent-[#4055B8]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                <span className="text-xs font-semibold text-gray-800">
                  Work From Home Only
                </span>
                <input
                  type="checkbox"
                  checked={onlyWFH}
                  onChange={(e) => setOnlyWFH(e.target.checked)}
                  className="w-4 h-4 text-[#6B3FC7] rounded-sm accent-[#6B3FC7]"
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#4055B8] to-[#6B3FC7] text-white text-xs font-bold shadow-md"
              >
                Apply Filters ({filteredJobs.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
