import React, { useState, useRef } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  Sparkles,
  PhoneCall,
  UserCheck,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Job, TabType } from '../types';
import { JobCard } from './JobCard';

interface HomeTabProps {
  jobs: Job[];
  savedJobIds: Set<string>;
  onToggleSave: (jobId: string) => void;
  onApplyJob: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  onNavigateTab: (tab: TabType) => void;
  onApplyQuickFilter: (filterKey: 'high-salary' | 'nearby' | 'wfh') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenProfile: () => void;
}

interface ActionPromoCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  gradient: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onApplyJob,
  onSelectJob,
  onNavigateTab,
  onApplyQuickFilter,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenProfile,
}) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const POPULAR_SEARCH_TERMS = [
    'Staff Nurse',
    'Sales Executive',
    'Customer Support',
    'Data Entry',
    'Delivery Executive',
    'Work From Home',
  ];

  const actionCards: ActionPromoCard[] = [
    {
      id: 'promo-1',
      badge: 'URGENT',
      title: 'No HR calls yet?',
      subtitle: 'Verified HRs in Patna are actively looking for candidates like you.',
      ctaText: 'Boost Profile',
      gradient: 'from-[#4055B8] to-[#6B3FC7]',
      borderColor: 'border-[#4055B8]/30',
      icon: PhoneCall,
      action: onOpenProfile,
    },
    {
      id: 'promo-2',
      badge: 'PROFILE 77%',
      title: 'Complete your profile',
      subtitle: 'Add 1 missing skill to unlock 3x more direct interview calls.',
      ctaText: 'Complete Now',
      gradient: 'from-[#E83B45] to-[#F5A623]',
      borderColor: 'border-[#F5A623]/40',
      icon: UserCheck,
      action: onOpenProfile,
    },
    {
      id: 'promo-3',
      badge: 'FAST TRACK',
      title: 'Get hired faster',
      subtitle: 'Apply to 3 urgent hiring jobs near Muhammadpur & Bailey Road.',
      ctaText: 'View Urgent Jobs',
      gradient: 'from-[#059669] to-[#10B981]',
      borderColor: 'border-[#059669]/30',
      icon: Zap,
      action: () => onApplyQuickFilter('nearby'),
    },
    {
      id: 'promo-4',
      badge: 'CAREER BOOST',
      title: 'Build your professional profile',
      subtitle: 'Generate a free 1-click ATS resume with pre-filled certifications.',
      ctaText: 'Build Resume',
      gradient: 'from-[#6B3FC7] to-[#D94670]',
      borderColor: 'border-[#6B3FC7]/30',
      icon: Award,
      action: onOpenProfile,
    },
  ];

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.clientWidth * 0.85;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveCarouselIndex(Math.min(index, actionCards.length - 1));
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.clientWidth * 0.85;
    carouselRef.current.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth',
    });
    setActiveCarouselIndex(index);
  };

  return (
    <div className="space-y-5 pb-20 pt-1">
      {/* Search Section with Orange/Gold subtle highlight */}
      <section className="px-4">
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit(searchQuery);
              setShowSuggestions(false);
            }}
            className="relative flex items-center"
          >
            <div
              id="home-search-container"
              className="w-full relative flex items-center bg-white rounded-2xl border-2 border-[#F5A623]/60 focus-within:border-[#4055B8] shadow-[0_4px_14px_rgba(245,166,35,0.12)] transition-all p-1 pl-3.5"
            >
              <Search className="w-5 h-5 text-[#687386] flex-shrink-0 mr-2.5" />
              <input
                id="home-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search jobs, skills or companies"
                className="w-full bg-transparent py-2.5 text-sm text-[#1E2544] placeholder-[#8E95A5] font-medium outline-hidden"
              />
              <button
                type="submit"
                id="home-search-action-btn"
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4055B8] to-[#6B3FC7] hover:from-[#34459B] hover:to-[#5833A8] text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-xs"
                title="Search Jobs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl p-3 z-30 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 text-xs font-semibold text-[#687386]">
                <span>Trending Searches</span>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-gray-400 hover:text-gray-700 text-xs"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      onSearchChange(term);
                      onSearchSubmit(term);
                      setShowSuggestions(false);
                    }}
                    className="text-xs bg-[#F8FAFC] hover:bg-[#EEF2FF] hover:text-[#4055B8] text-[#4B5563] font-medium px-3 py-1.5 rounded-lg border border-[#E2E8F0] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ACTION NEEDED SECTION (Horizontally scrollable promotional carousel) */}
      <section className="space-y-2.5">
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
              Action needed
            </h2>
            <span className="w-2 h-2 rounded-full bg-[#E83B45] animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-[#687386]">
            {activeCarouselIndex + 1} of {actionCards.length}
          </span>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`snap-center flex-shrink-0 w-[86%] sm:w-[320px] bg-white rounded-2xl border ${card.borderColor} p-4 shadow-[0_3px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Background decorative watermark */}
                <div className="absolute -right-3 -bottom-3 opacity-5 pointer-events-none">
                  <Icon className="w-28 h-28 text-[#4055B8]" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#4055B8]">
                      {card.badge}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-[#4055B8]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#1E2544] leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#687386] mt-1 line-clamp-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={card.action}
                    className={`w-full py-2 px-3.5 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow-md bg-gradient-to-r ${card.gradient} flex items-center justify-center gap-1.5 transition-transform active:scale-98`}
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {actionCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => scrollToCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeCarouselIndex === idx
                  ? 'w-5 bg-[#4055B8]'
                  : 'w-1.5 bg-[#CBD5E1] hover:bg-gray-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* QUICK FILTERS (3 large cards in a horizontal row) */}
      <section className="px-4 space-y-2.5">
        <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
          Quick Filters
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. High Salary Jobs (Money icon, green/mint background) */}
          <button
            id="quick-filter-high-salary"
            onClick={() => onApplyQuickFilter('high-salary')}
            className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#E8F8EE] hover:bg-[#DCFCE7] border border-[#C6F6D5] shadow-xs hover:shadow-sm transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#35A853] flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-[#166534] leading-tight line-clamp-2">
              High Salary Jobs
            </span>
            <span className="text-[10px] text-[#22C55E] font-medium mt-0.5">
              ₹30k+/mo
            </span>
          </button>

          {/* 2. Nearby Jobs (Location/navigation icon, blue/lavender background) */}
          <button
            id="quick-filter-nearby"
            onClick={() => onApplyQuickFilter('nearby')}
            className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] shadow-xs hover:shadow-sm transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#4055B8] flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-[#312E81] leading-tight line-clamp-2">
              Nearby Jobs
            </span>
            <span className="text-[10px] text-[#4055B8] font-medium mt-0.5">
              Within 5km
            </span>
          </button>

          {/* 3. Work From Home (Home icon, purple/light violet background) */}
          <button
            id="quick-filter-wfh"
            onClick={() => onApplyQuickFilter('wfh')}
            className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] shadow-xs hover:shadow-sm transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-[#6B3FC7] flex items-center justify-center shadow-xs mb-2 group-hover:scale-110 transition-transform">
              <HomeIcon className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-[#4C1D95] leading-tight line-clamp-2">
              Work From Home
            </span>
            <span className="text-[10px] text-[#6B3FC7] font-medium mt-0.5">
              Remote / Pan India
            </span>
          </button>
        </div>
      </section>

      {/* JOB RECOMMENDATIONS ("Apply to these jobs") */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
              Apply to these jobs
            </h2>
            <p className="text-xs text-[#687386]">
              Top jobs that match your profile
            </p>
          </div>

          <button
            id="home-view-all-jobs-btn"
            onClick={() => onNavigateTab('all-jobs')}
            className="text-xs font-bold text-[#4055B8] hover:text-[#6B3FC7] border border-[#4055B8]/30 hover:border-[#4055B8] bg-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Job Cards Stack */}
        <div className="space-y-3">
          {jobs.slice(0, 6).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.has(job.id)}
              onToggleSave={onToggleSave}
              onApply={onApplyJob}
              onSelectJob={onSelectJob}
            />
          ))}
        </div>

        {/* Bottom prompt to see more */}
        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigateTab('all-jobs')}
            className="w-full py-3 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#4055B8] text-[#4055B8] font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Explore All {jobs.length}+ Available Jobs in Patna</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
