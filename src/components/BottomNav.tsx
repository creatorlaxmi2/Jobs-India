import React from 'react';
import { Home, Briefcase, Activity, Crown, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activityBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activityBadgeCount = 0,
}) => {
  const tabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    hasBadge?: boolean;
    badgeText?: string;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'all-jobs',
      label: 'All Jobs',
      icon: Briefcase,
    },
    {
      id: 'activity',
      label: 'My Activity',
      icon: Activity,
      hasBadge: activityBadgeCount > 0,
      badgeText: activityBadgeCount > 0 ? String(activityBadgeCount) : undefined,
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: Crown,
      hasBadge: true,
      badgeText: 'NEW',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      id="jobs-india-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1 max-w-md mx-auto"
      style={{
        paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 min-w-[58px] ${
                isActive ? 'text-[#4055B8]' : 'text-[#8E95A5] hover:text-[#525B6C]'
              }`}
            >
              {/* Icon Container with active highlight */}
              <div className="relative mb-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px] text-[#4055B8]' : 'stroke-[1.8px]'
                  }`}
                />

                {/* Badge (NEW or Count) */}
                {tab.hasBadge && tab.badgeText && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shadow-xs ${
                      tab.badgeText === 'NEW'
                        ? 'bg-gradient-to-r from-[#E83B45] to-[#F5A623] text-white animate-pulse'
                        : 'bg-[#4055B8] text-white min-w-[15px] text-center'
                    }`}
                  >
                    {tab.badgeText}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] leading-tight whitespace-nowrap tracking-tight ${
                  isActive ? 'font-bold text-[#4055B8]' : 'font-medium text-[#8E95A5]'
                }`}
              >
                {tab.label}
              </span>

              {/* Active subtle pill dot indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4055B8] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
