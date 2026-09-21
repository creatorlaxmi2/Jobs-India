import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#E5E9F2] flex flex-col items-center justify-start sm:py-6 selection:bg-[#4055B8]/20">
      {/* Desktop view switcher banner (only shows on desktop screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md px-4 py-2 mb-2 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2544]">
          <Smartphone className="w-4 h-4 text-[#4055B8]" />
          <span>Android Mobile Preview (Jobs India)</span>
        </div>
        <button
          onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
          className="text-xs text-[#4055B8] hover:text-[#6B3FC7] font-bold flex items-center gap-1 bg-[#EEF2FF] px-2.5 py-1 rounded-lg transition-colors"
        >
          {isMobileFrameMode ? (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Expand View</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: either simulated Android handset or full-width container */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrameMode
            ? 'max-w-md bg-white sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(30,37,68,0.18)] sm:border-[8px] sm:border-[#1E2544] relative overflow-hidden flex flex-col min-h-screen sm:min-h-[844px] sm:max-h-[92vh]'
            : 'max-w-2xl bg-white shadow-lg sm:rounded-2xl overflow-hidden min-h-screen'
        }`}
      >
        {/* Android Status Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 pt-2 pb-1 flex items-center justify-between text-xs text-[#1E2544] select-none">
          {/* Time */}
          <span className="font-extrabold text-[13px] tracking-tight">10:20</span>

          {/* Punch hole camera simulation in mobile frame mode */}
          {isMobileFrameMode && (
            <div className="hidden sm:block w-3.5 h-3.5 rounded-full bg-[#0F172A] mx-auto ring-1 ring-gray-300" />
          )}

          {/* Android Status Icons: 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-2 text-[#1E2544]">
            <span className="text-[10px] font-black tracking-tighter text-[#4055B8]">
              5G
            </span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.2px]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">94%</span>
              <Battery className="w-4 h-4 fill-[#1E2544]" />
            </div>
          </div>
        </div>

        {/* Scrollable App Body */}
        <div className="flex-1 overflow-y-auto relative bg-[#F0F2F7]">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        {isMobileFrameMode && (
          <div className="hidden sm:flex bg-white py-1.5 items-center justify-center border-t border-gray-100 z-40">
            <div className="w-32 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
