import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy,
  Check,
  Download,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { QRCodeConfig } from '../types';

interface QRCodeDisplayProps {
  config: QRCodeConfig;
  amount?: number | string;
  planName?: string;
  onToast?: (msg: string) => void;
  showDownloadBtn?: boolean;
  showPayIntentBtn?: boolean;
  className?: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  config,
  amount,
  planName,
  onToast,
  showDownloadBtn = true,
  showPayIntentBtn = true,
  className = '',
  size = 180,
}) => {
  const [copied, setCopied] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean numerical amount for UPI string if provided
  const numericAmount = amount
    ? String(amount).replace(/[^0-9.]/g, '')
    : '';

  // Generate UPI URI according to NPCI specifications:
  // upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=INR
  const upiUri = React.useMemo(() => {
    const params = new URLSearchParams();
    params.set('pa', config.upiId || 'jobsindia.careers@okaxis');
    params.set('pn', config.payeeName || 'Jobs India Careers');
    if (numericAmount) {
      params.set('am', numericAmount);
    }
    params.set(
      'tn',
      planName ? `Jobs India ${planName} Subscription` : config.transactionNote || 'Jobs India Premium Plan'
    );
    params.set('cu', 'INR');
    return `upi://pay?${params.toString()}`;
  }, [config.upiId, config.payeeName, numericAmount, planName, config.transactionNote]);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopied(true);
    if (onToast) onToast(`📋 Copied UPI ID: ${config.upiId}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    try {
      if (config.qrImageUrl) {
        // Download custom image
        const a = document.createElement('a');
        a.href = config.qrImageUrl;
        a.download = `JobsIndia-QRCode-${config.payeeName.replace(/\s+/g, '_')}.png`;
        a.click();
        if (onToast) onToast('📥 Custom QR Code downloaded successfully!');
        return;
      }

      // Convert SVG to PNG for clean download
      const svgElement = containerRef.current?.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      canvas.width = 600;
      canvas.height = 600;

      img.onload = () => {
        if (!ctx) return;
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 500, 500);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `JobsIndia-UPI-QRCode-${config.upiId}.png`;
        a.click();
        if (onToast) onToast('📥 UPI QR Code saved to downloads!');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      console.error('Error downloading QR code:', e);
      if (onToast) onToast('⚠️ Could not download QR image automatically.');
    }
  };

  const qrColor = config.qrThemeColor || '#4F46E5';

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-3.5 select-none ${className}`}
    >
      {/* Merchant Title & Security Badge */}
      <div className="w-full border-b border-slate-100 pb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NPCI Verified Merchant QR</span>
        </div>
        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          {config.payeeName || 'Jobs India Careers Official'}
        </h4>
        <p className="text-[11px] text-slate-500 font-medium">
          {config.qrSubtitle || 'Scan & Pay with any UPI app'}
        </p>
      </div>

      {/* QR Code Container with Frame */}
      <div className="relative p-3.5 rounded-2xl bg-white border-2 border-indigo-100 shadow-sm flex items-center justify-center">
        {/* Decorative corner markers */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-indigo-600 rounded-tl" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-indigo-600 rounded-tr" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-indigo-600 rounded-bl" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-indigo-600 rounded-br" />

        {config.qrImageUrl ? (
          <img
            src={config.qrImageUrl}
            alt="Merchant UPI QR Code"
            className="w-44 h-44 object-contain rounded-lg"
          />
        ) : (
          <QRCodeSVG
            value={upiUri}
            size={size}
            level="H"
            fgColor={qrColor}
            bgColor="#FFFFFF"
            includeMargin={false}
          />
        )}
      </div>

      {/* Amount Display if provided */}
      {amount && (
        <div className="bg-slate-50 border border-slate-200/80 px-4 py-1.5 rounded-xl">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
            Total Amount to Pay
          </span>
          <span className="text-lg font-black text-emerald-600 tracking-tight">
            {typeof amount === 'number' ? `₹${amount}` : amount.startsWith('₹') ? amount : `₹${amount}`}
          </span>
        </div>
      )}

      {/* UPI ID with 1-Click Copy */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 text-xs">
        <div className="text-left min-w-0 flex-1">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
            UPI ID / VPA
          </span>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm font-mono truncate block">
            {config.upiId || 'jobsindia.careers@okaxis'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyUpiId}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
          }`}
          title="Copy UPI ID"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Accepted UPI Apps Row */}
      <div className="w-full pt-1 flex items-center justify-center gap-2 flex-wrap text-[10px] font-bold text-slate-500">
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">GPay</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">PhonePe</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Paytm</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">BHIM UPI</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Cred</span>
      </div>

      {/* Action Buttons: Pay via UPI App Intent & Download QR */}
      <div className="w-full flex items-center gap-2 pt-1">
        {showPayIntentBtn && (
          <a
            href={upiUri}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open in UPI App</span>
          </a>
        )}

        {showDownloadBtn && (
          <button
            type="button"
            onClick={handleDownloadQR}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
            title="Download QR code image for print or offline payment"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save QR</span>
          </button>
        )}
      </div>
    </div>
  );
};
