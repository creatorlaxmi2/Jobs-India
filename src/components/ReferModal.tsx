import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const ReferModal: React.FC<ReferModalProps> = ({
  isOpen,
  onClose,
  referralCode = 'ROZGAR2026',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Hey! I found verified jobs in Patna & Bihar on the Jobs India app. Register with my code ${referralCode} to get 100% free direct calls from verified HRs: https://jobsindia.app/join/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="refer-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-base font-bold text-[#1E2544]">
              Refer & Earn with WhatsApp
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-[#25D366]/15 via-[#10B981]/15 to-[#3B82F6]/15 p-4 rounded-2xl border border-[#25D366]/30 text-center space-y-1">
          <div className="w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.979-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.526.15-.176.201-.301.301-.502.1-.2.05-.377-.025-.527-.075-.15-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.517-.176-.008-.377-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.579-.088 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351z" />
              <path d="M12 2a10 10 0 0 0-8.52 15.228L2 22l4.908-1.423A10 10 0 1 0 12 2zm0 18.2a8.16 8.16 0 0 1-4.167-1.139l-.299-.177-3.09.896.903-2.996-.195-.314A8.2 8.2 0 1 1 12 20.2z" />
            </svg>
          </div>
          <h4 className="text-sm font-extrabold text-[#1E2544] pt-1">
            Help Friends Get Verified Jobs
          </h4>
          <p className="text-xs text-[#687386]">
            Share Jobs India on WhatsApp. Both you and your friend unlock 1 month of free Premium alerts when they apply!
          </p>
        </div>

        {/* Referral Code Box */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">
              Your Referral Code
            </span>
            <span className="text-sm font-black text-[#4055B8] tracking-wider">
              {referralCode}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Direct WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.979-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.526.15-.176.201-.301.301-.502.1-.2.05-.377-.025-.527-.075-.15-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.517-.176-.008-.377-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.511 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.579-.088 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351z" />
            <path d="M12 2a10 10 0 0 0-8.52 15.228L2 22l4.908-1.423A10 10 0 1 0 12 2zm0 18.2a8.16 8.16 0 0 1-4.167-1.139l-.299-.177-3.09.896.903-2.996-.195-.314A8.2 8.2 0 1 1 12 20.2z" />
          </svg>
          <span>Share on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
