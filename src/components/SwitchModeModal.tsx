import React from 'react';
import { User, Briefcase, Shield, LogIn, UserPlus, X, Lock, KeyRound } from 'lucide-react';
import { AppMode } from '../types';

interface SwitchModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenAuth: (initialTab: 'login' | 'signup') => void;
  isAdminAuthenticated?: boolean;
  onOpenAdminAuth?: (initialView?: 'login' | 'reset') => void;
}

export const SwitchModeModal: React.FC<SwitchModeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  onOpenAuth,
  isAdminAuthenticated = false,
  onOpenAdminAuth,
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
        className="w-full max-w-[340px] bg-[#141A28] border border-slate-700/60 rounded-3xl p-4 shadow-2xl animate-in zoom-in-95 duration-150 text-white"
      >
        {/* Header Title with close icon */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <span className="text-[12px] font-bold tracking-wider text-[#8E9DB8] uppercase">
            SWITCH APP MODE
          </span>
          <button
            id="close-switch-mode-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
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
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all group cursor-pointer ${
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
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all group cursor-pointer ${
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

          {/* Option 3: Admin Panel (Password Protected) */}
          <div className="relative">
            <div
              id="mode-admin-container"
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all group ${
                currentMode === 'admin'
                  ? 'bg-[#3B2C63] ring-1 ring-[#A855F7]/60'
                  : 'hover:bg-[#1C2438]'
              }`}
            >
              <button
                type="button"
                id="mode-admin-btn"
                onClick={() => {
                  if (isAdminAuthenticated) {
                    onSelectMode('admin');
                    onClose();
                  } else if (onOpenAdminAuth) {
                    onClose();
                    onOpenAdminAuth('login');
                  } else {
                    onSelectMode('admin');
                    onClose();
                  }
                }}
                className="flex items-center gap-3.5 min-w-0 flex-1 text-left cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#A855F7] stroke-[2.2]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[15px] text-white tracking-tight leading-snug">
                      Admin Panel
                    </span>
                    {!isAdminAuthenticated ? (
                      <span className="bg-purple-500/20 text-[#D8B4FE] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Protected</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                        <span>Unlocked</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#C4B5FD] leading-tight truncate">
                    Verify & moderate
                  </span>
                </div>
              </button>

              {!isAdminAuthenticated && (
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onOpenAdminAuth?.('reset');
                    }}
                    className="text-[10px] text-purple-300 hover:text-white bg-purple-900/50 hover:bg-purple-800 px-2 py-1 rounded-lg border border-purple-700/50 transition-colors cursor-pointer"
                    title="Reset Admin Password"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
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
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left hover:bg-[#1C2438] transition-all group cursor-pointer"
          >
            <LogIn className="w-5 h-5 text-[#10B981] stroke-[2.2] flex-shrink-0" />
            <span className="font-bold text-[15px] text-[#10B981] tracking-tight">
              Log In
            </span>
          </button>

          {/* Create Account */}
          <button
            id="switch-mode-signup-btn"
            onClick={() => {
              onClose();
              onOpenAuth('signup');
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left hover:bg-[#1C2438] transition-all group cursor-pointer"
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
