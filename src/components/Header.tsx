import React, { useState } from 'react';
import { MapPin, ChevronDown, Heart, Bell, Share2, Check, User, Briefcase, Shield, LogIn, LogOut, UserCheck } from 'lucide-react';
import { JobsIndiaLogo } from './JobsIndiaLogo';
import { AppMode } from '../types';
import { LocationPickerModal } from './LocationPickerModal';

interface HeaderProps {
  currentCity: string;
  currentLocality: string;
  onSelectLocation: (city: string, locality: string) => void;
  savedJobsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSavedJobs: () => void;
  onOpenReferModal: () => void;
  currentMode: AppMode;
  onOpenSwitchMode: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onOpenAuth?: (tab: 'login' | 'signup') => void;
  onLogout?: () => void;
}

const AVAILABLE_LOCATIONS = [
  { city: 'Patna', locality: 'Muhammadpur' },
  { city: 'Patna', locality: 'Kankarbagh' },
  { city: 'Patna', locality: 'Bailey Road' },
  { city: 'Patna', locality: 'Boring Road' },
  { city: 'Patna', locality: 'Patliputra' },
  { city: 'Delhi NCR', locality: 'Connaught Place / Noida' },
  { city: 'Bengaluru', locality: 'Koramangala / HSR' },
  { city: 'Mumbai', locality: 'Andheri / BKC' },
  { city: 'Pune', locality: 'Hinjewadi' },
  { city: 'Hyderabad', locality: 'Madhapur / Hitech City' },
];

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  currentLocality,
  onSelectLocation,
  savedJobsCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenSavedJobs,
  onOpenReferModal,
  currentMode,
  onOpenSwitchMode,
  isLoggedIn = false,
  userName,
  onOpenAuth,
  onLogout,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
      <header
        id="jobs-india-header"
        className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-3 py-2 shadow-xs"
      >
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Left: Location Selector with Patna & Muhammadpur */}
          <button
            id="header-location-selector-btn"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 text-left group hover:opacity-90 transition-opacity focus:outline-hidden py-0.5 max-w-[42%] sm:max-w-[48%]"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4055B8] flex-shrink-0 group-hover:bg-[#E0E7FF] transition-colors">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4055B8]" />
            </div>
            <div className="flex flex-col leading-tight truncate">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#1E2544] text-[13px] sm:text-[14px] tracking-tight truncate">
                  {currentCity}
                </span>
                <ChevronDown className="w-3 h-3 text-[#687386] transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#687386] truncate max-w-[85px] sm:max-w-[110px]">
                {currentLocality}
              </span>
            </div>
          </button>

          {/* Right: Auth Status / Log In, Switch Mode, Refer, Saved, Notifications */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Logged in User Account Badge (Only shown when logged in) */}
            {isLoggedIn && (
              <div className="flex items-center gap-1">
                <div
                  id="header-user-status-badge"
                  className="flex items-center gap-1 bg-[#EEF2FF] text-[#4055B8] border border-[#4055B8]/30 px-2 py-1 rounded-full text-[11px] font-bold"
                  title={`Logged in as ${userName || 'User'}`}
                >
                  <UserCheck className="w-3 h-3 text-[#10B981] flex-shrink-0" />
                  <span className="max-w-[65px] sm:max-w-[90px] truncate">
                    {userName ? userName.split(' ')[0] : 'User'}
                  </span>
                </div>
                {onLogout && (
                  <button
                    id="header-logout-btn"
                    onClick={onLogout}
                    title="Log Out"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Switch App Mode Trigger Button */}
            <button
              id="header-switch-mode-btn"
              onClick={onOpenSwitchMode}
              title="Switch App Mode (Job Seeker / Employer / Admin)"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
                currentMode === 'employer'
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/50 hover:bg-[#FDE68A]'
                  : currentMode === 'admin'
                  ? 'bg-[#F3E8FF] text-[#6B21A8] border-[#A855F7]/50 hover:bg-[#E9D5FF]'
                  : 'bg-[#ECFDF5] text-[#065F46] border-[#10B981]/40 hover:bg-[#D1FAE5]'
              }`}
            >
              {currentMode === 'employer' ? (
                <Briefcase className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0" />
              ) : currentMode === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-[#A855F7] flex-shrink-0" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
              )}
              <span className="text-[11px] font-extrabold tracking-tight hidden sm:inline">
                {currentMode === 'employer'
                  ? 'Employer'
                  : currentMode === 'admin'
                  ? 'Admin'
                  : 'Seeker'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Refer button with WhatsApp-style icon */}
            <button
              id="header-refer-whatsapp-btn"
              onClick={onOpenReferModal}
              title="Refer & Earn on WhatsApp"
              className="flex items-center gap-1 bg-[#25D366]/10 text-[#0F8A43] hover:bg-[#25D366]/20 px-2 py-1.5 rounded-full text-xs font-bold transition-colors"
            >
              {/* WhatsApp styled icon */}
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                className="text-[#25D366]"
              >
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.979-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.526.15-.176.201-.301.301-.502.1-.2.05-.377-.025-.527-.075-.15-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.517-.176-.008-.377-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.579-.088 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351z" />
                <path d="M12 2a10 10 0 0 0-8.52 15.228L2 22l4.908-1.423A10 10 0 1 0 12 2zm0 18.2a8.16 8.16 0 0 1-4.167-1.139l-.299-.177-3.09.896.903-2.996-.195-.314A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              <span>Refer</span>
            </button>

            {/* Saved Jobs Heart Icon */}
            <button
              id="header-saved-jobs-btn"
              onClick={onOpenSavedJobs}
              title="Saved Jobs"
              className="relative p-2 rounded-full text-[#4B5563] hover:text-[#E83B45] hover:bg-[#F3F4F6] transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${savedJobsCount > 0 ? 'fill-[#E83B45] text-[#E83B45]' : ''}`}
              />
              {savedJobsCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#E83B45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedJobsCount}
                </span>
              )}
            </button>

            {/* Notification Bell with Badge */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative p-2 rounded-full text-[#4B5563] hover:text-[#4055B8] hover:bg-[#F3F4F6] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E83B45] border-2 border-white rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Location Change Bottom Sheet / Modal with Live GPS Tracking */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentCity={currentCity}
        currentLocality={currentLocality}
        onSelectLocation={(city, locality) => {
          onSelectLocation(city, locality);
        }}
      />
    </>
  );
};
