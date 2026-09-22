import React, { useState } from 'react';
import {
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
          <span>Jobs India</span>
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

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrameMode
            ? 'max-w-md bg-white sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(30,37,68,0.18)] sm:border-[8px] sm:border-[#1E2544] relative overflow-hidden flex flex-col min-h-screen sm:min-h-[844px] sm:max-h-[92vh]'
            : 'max-w-2xl bg-white shadow-lg sm:rounded-2xl overflow-hidden min-h-screen'
        }`}
      >
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
