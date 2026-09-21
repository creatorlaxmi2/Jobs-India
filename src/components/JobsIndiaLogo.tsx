import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightMode?: boolean;
}

export const JobsIndiaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightMode = false,
}) => {
  const iconDimensions = size === 'sm' ? 26 : size === 'lg' ? 42 : 32;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Original Jobs India Emblem */}
      <div
        className="relative flex items-center justify-center rounded-xl shadow-sm overflow-hidden flex-shrink-0"
        style={{
          width: iconDimensions,
          height: iconDimensions,
          background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 100%)',
        }}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 text-white"
        >
          {/* Briefcase base with smooth rounded corners */}
          <rect
            x="6"
            y="12"
            width="24"
            height="18"
            rx="4"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Handle */}
          <path
            d="M13 12V9.5C13 8.11929 14.1193 7 15.5 7H20.5C21.8807 7 23 8.11929 23 9.5V12"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Growth trajectory forward arrow inside briefcase */}
          <path
            d="M11 23L16.5 17.5L20 20.5L25 15"
            stroke="#4055B8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 15H25V18.5"
            stroke="#4055B8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle Indian orange & green opportunity badge indicators */}
          <circle cx="27.5" cy="8.5" r="2.5" fill="#F5A623" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-extrabold tracking-tight ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
              } ${lightMode ? 'text-white' : 'text-[#1E2544]'}`}
            >
              Jobs
            </span>
            <span
              className={`font-black tracking-tight ${
                size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
              } text-[#6B3FC7]`}
              style={{
                background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 70%, #E83B45 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              India
            </span>
          </div>
          <span className="text-[9px] font-semibold text-[#687386] tracking-wider uppercase">
            Rozgar Bharat
          </span>
        </div>
      )}
    </div>
  );
};
