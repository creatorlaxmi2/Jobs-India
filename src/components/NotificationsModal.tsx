import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Calendar,
  PhoneCall,
  Briefcase,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'hr' | 'interview' | 'jobs'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'hr') return n.type === 'hr';
    if (filter === 'interview') return n.type === 'interview';
    if (filter === 'jobs') return n.type === 'job_match';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-[#9333EA]" />;
      case 'hr':
        return <PhoneCall className="w-4 h-4 text-[#2563EB]" />;
      case 'job_match':
        return <Briefcase className="w-4 h-4 text-[#059669]" />;
      case 'profile':
        return <UserCheck className="w-4 h-4 text-[#D97706]" />;
      default:
        return <Bell className="w-4 h-4 text-[#4055B8]" />;
    }
  };

  return (
    <div
      id="notifications-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#4055B8]" />
            <h3 className="text-base font-bold text-[#1E2544]">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-[#4055B8] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-b border-gray-100">
          {[
            { id: 'all', label: 'All' },
            { id: 'interview', label: 'Interviews' },
            { id: 'hr', label: 'HR Requests' },
            { id: 'jobs', label: 'Job Matches' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-[#4055B8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-white border-gray-100 text-gray-600'
                    : 'bg-[#F0F4FF] border-[#C7D2FE] text-[#1E2544] shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold leading-tight line-clamp-1">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#687386] leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
