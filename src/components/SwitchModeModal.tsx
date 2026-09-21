import React from 'react';
import { User, Briefcase, Shield, LogIn, UserPlus, X } from 'lucide-react';
import { AppMode } from '../types';

interface SwitchModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenAuth: (initialTab: 'login' | 'signup') => void;
}

export const SwitchModeModal: React.FC<SwitchModeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="switch-mode-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="switch-mode-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] bg-[#141A28] border border-slate-700/60 rounded-3xl p-4 shadow-2xl animate-in zoom-in-95 duration-150 text-white select-none"
      >
        {/* Header Title with close icon */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <span className="text-[12px] font-bold tracking-wider text-[#8E9DB8] uppercase">
            SWITCH APP MODE
          </span>
          <button
            id="close-switch-mode-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-1.5 mt-1">
          {/* Option 1: Job Seeker */}
          <button
            id="mode-job-seeker-btn"
            onClick={() => {
              onSelectMode('job-seeker');
              onClose();
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all group ${
              currentMode === 'job-seeker'
                ? 'bg-[#1E293B] ring-1 ring-[#10B981]/50'
                : 'hover:bg-[#1C2438]'
            }`}
          >
            <div className="flex-shrink-0">
              <User className="w-5 h-5 text-[#10B981] stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-white tracking-tight leading-snug">
                Job Seeker
              </span>
              <span className="text-xs text-slate-400 leading-tight">
                Find nearby jobs
              </span>
            </div>
          </button>

          {/* Option 2: Employer / HR */}
          <button
            id="mode-employer-btn"
            onClick={() => {
              onSelectMode('employer');
              onClose();
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all group ${
              currentMode === 'employer'
                ? 'bg-[#2A2318] ring-1 ring-[#F59E0B]/50'
                : 'hover:bg-[#1C2438]'
            }`}
          >
            <div className="flex-shrink-0">
              <Briefcase className="w-5 h-5 text-[#F59E0B] stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-white tracking-tight leading-snug">
                Employer / HR
              </span>
              <span className="text-xs text-slate-400 leading-tight">
                Post & hire talent
              </span>
            </div>
          </button>

          {/* Option 3: Admin Panel */}
          <button
            id="mode-admin-btn"
            onClick={() => {
              onSelectMode('admin');
              onClose();
            }}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all group ${
              currentMode === 'admin'
                ? 'bg-[#3B2C63] ring-1 ring-[#A855F7]/60'
                : 'hover:bg-[#1C2438]'
            }`}
          >
            <div className="flex-shrink-0">
              <Shield className="w-5 h-5 text-[#A855F7] stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] text-white tracking-tight leading-snug">
                Admin Panel
              </span>
              <span className="text-xs text-[#C4B5FD] leading-tight">
                Verify & moderate
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/60 my-2.5 mx-1" />

        {/* Auth Actions */}
        <div className="space-y-1">
          {/* Log In */}
          <button
            id="switch-mode-login-btn"
            onClick={() => {
              onClose();
              onOpenAuth('login');
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left hover:bg-[#1C2438] transition-all group"
          >
            <LogIn className="w-5 h-5 text-[#10B981] stroke-[2.2] flex-shrink-0" />
            <span className="font-bold text-[15px] text-[#10B981] tracking-tight">
              Log In
            </span>
          </button>

          {/* Create Account (Sign Up) */}
          <button
            id="switch-mode-signup-btn"
            onClick={() => {
              onClose();
              onOpenAuth('signup');
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left hover:bg-[#1C2438] transition-all group"
          >
            <UserPlus className="w-5 h-5 text-[#2DD4BF] stroke-[2.2] flex-shrink-0" />
            <span className="font-bold text-[15px] text-[#2DD4BF] tracking-tight">
              Create Account (Sign Up)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
