import React, { useState } from 'react';
import { MapPin, ChevronDown, Heart, Bell, Share2, Check } from 'lucide-react';
import { JobsIndiaLogo } from './JobsIndiaLogo';

interface HeaderProps {
  currentCity: string;
  currentLocality: string;
  onSelectLocation: (city: string, locality: string) => void;
  savedJobsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSavedJobs: () => void;
  onOpenReferModal: () => void;
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
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  return (
    <>
      <header
        id="jobs-india-header"
        className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] px-4 py-2.5 shadow-xs"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left: Location Selector with Patna & Muhammadpur */}
          <button
            id="header-location-selector-btn"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 text-left group hover:opacity-90 transition-opacity focus:outline-hidden py-1 max-w-[55%]"
          >
            <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4055B8] flex-shrink-0 group-hover:bg-[#E0E7FF] transition-colors">
              <MapPin className="w-4 h-4 text-[#4055B8]" />
            </div>
            <div className="flex flex-col leading-tight truncate">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#1E2544] text-[15px] tracking-tight">
                  {currentCity}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#687386] transition-transform group-hover:translate-y-0.5" />
              </div>
              <span className="text-xs text-[#687386] truncate max-w-[130px]">
                {currentLocality}
              </span>
            </div>
          </button>

          {/* Right: Refer, Saved Hearts, Notification Bell */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Refer button with WhatsApp-style icon */}
            <button
              id="header-refer-whatsapp-btn"
              onClick={onOpenReferModal}
              title="Refer & Earn on WhatsApp"
              className="flex items-center gap-1 bg-[#25D366]/10 text-[#0F8A43] hover:bg-[#25D366]/20 px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors"
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

      {/* Quick Location Change Bottom Sheet / Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            id="location-picker-sheet"
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-bold text-[#1E2544]">Select Your Location</h3>
                <p className="text-xs text-[#687386]">Jobs will be prioritized near you</p>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 text-sm font-semibold"
              >
                Done
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto space-y-1.5">
              {AVAILABLE_LOCATIONS.map((loc) => {
                const isSelected =
                  currentCity === loc.city && currentLocality === loc.locality;
                return (
                  <button
                    key={`${loc.city}-${loc.locality}`}
                    onClick={() => {
                      onSelectLocation(loc.city, loc.locality);
                      setShowLocationModal(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#EEF2FF] border border-[#4055B8] text-[#4055B8] font-bold'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin
                        className={`w-4 h-4 ${
                          isSelected ? 'text-[#4055B8]' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-semibold">{loc.city}</p>
                        <p className="text-xs text-gray-500">{loc.locality}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#4055B8]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
