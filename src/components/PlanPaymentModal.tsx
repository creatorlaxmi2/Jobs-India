import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Crown,
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  Building,
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiumPlan, PlatformSettings, PaymentModeConfig } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PlanPaymentModalProps {
  plan: PremiumPlan;
  settings: PlatformSettings;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    plan: PremiumPlan,
    details?: { paymentMode?: string; utrNumber?: string; finalAmount?: string }
  ) => void;
  onToast: (msg: string) => void;
}

export const PlanPaymentModal: React.FC<PlanPaymentModalProps> = ({
  plan,
  settings,
  isOpen,
  onClose,
  onSuccess,
  onToast,
}) => {
  const paymentModes = (settings.paymentModes || []).filter((m) => m.isEnabled);
  const [selectedModeId, setSelectedModeId] = useState<string>(
    paymentModes.find((m) => m.id === 'upi_qr')?.id || paymentModes[0]?.id || 'upi_qr'
  );
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bankCopied, setBankCopied] = useState(false);

  if (!isOpen) return null;

  // Selected mode
  const currentMode = paymentModes.find((m) => m.id === selectedModeId);

  // Final Price Calculation (Check if extra QR discount applies)
  const isQrMode = selectedModeId === 'upi_qr';

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      const generatedUtr = utrNumber.trim() || `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      onSuccess(plan, {
        paymentMode: currentMode?.name || 'UPI / Scan QR Code',
        utrNumber: generatedUtr,
        finalAmount: plan.price,
      });
      onToast(`🎉 Payment Verified! Your ${plan.name} (${plan.activeTime || '30 Days'}) plan is now active!`);
      onClose();
    }, 1200);
  };

  const handleCopyBankDetails = () => {
    const text = `Beneficiary: Jobs India Careers Pvt Ltd\nA/c Number: 50200084920194\nIFSC Code: HDFC0001248\nBank: HDFC Bank, Muhammadpur Branch, Patna\nAmount: ${plan.price}`;
    navigator.clipboard.writeText(text);
    setBankCopied(true);
    onToast('📋 Bank account details copied to clipboard!');
    setTimeout(() => setBankCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-4 sm:p-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md flex-shrink-0">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Checkout & Payment
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Instant Activation
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Subscribe to {plan.name} with 100% secure payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Summary Banner (Highlights Active Time & Pricing) */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-b border-indigo-100 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">
                Selected Subscription Tier
              </span>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>{plan.name}</span>
                {plan.badge && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.2 rounded-full border border-amber-300">
                    {plan.badge}
                  </span>
                )}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 line-through font-semibold block">
                {plan.originalPrice}
              </span>
              <span className="text-xl font-black text-slate-900">{plan.price}</span>
            </div>
          </div>

          {/* Active Time Highlight Box */}
          <div className="mt-2.5 pt-2.5 border-t border-indigo-100/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Active Time:</span>
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.2 rounded-lg">
                {plan.activeTime || '30 Days Validity'}
              </span>
            </div>

            <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{plan.activeScheduleText || 'Instant 24x7 Activation'}</span>
            </div>
          </div>
        </div>

        {/* Payment Modes Selector Tabs */}
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-xs font-extrabold text-slate-700 block mb-2">
              Select Payment Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentModes.map((mode) => {
                const isSelected = selectedModeId === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSelectedModeId(mode.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      {mode.id === 'upi_qr' ? (
                        <QrCode className="w-4 h-4 text-indigo-600" />
                      ) : mode.id === 'cards' ? (
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Building className="w-4 h-4 text-emerald-600" />
                      )}
                      {mode.isPopular && (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded">
                          BEST
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate block">
                      {mode.name}
                    </span>
                    {mode.discountOrOffer && (
                      <span className="text-[9px] text-indigo-600 font-extrabold block truncate mt-0.5">
                        {mode.discountOrOffer}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode 1: UPI / QR Code Payment */}
          {selectedModeId === 'upi_qr' && settings.qrCodeConfig && (
            <div className="space-y-3.5">
              <QRCodeDisplay
                config={settings.qrCodeConfig}
                amount={plan.price}
                planName={plan.name}
                onToast={onToast}
                size={170}
              />

              {/* UTR / Transaction ID Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Enter UPI UTR / Transaction ID (Optional)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">12 Digits</span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 426892019482 (from Google Pay / PhonePe receipt)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  After scanning and completing payment in your UPI app, click the button below for instant account activation.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Cards */}
          {selectedModeId === 'cards' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-extrabold text-slate-800">
                  Debit / Credit Card Checkout
                </span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-bold text-slate-700">
                  Visa / RuPay / MC
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  defaultValue="4532 •••• •••• 9102"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    defaultValue="10/28"
                  />
                  <input
                    type="password"
                    placeholder="CVV (3 digits)"
                    maxLength={3}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    defaultValue="829"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Net Banking */}
          {selectedModeId === 'netbanking' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-extrabold text-slate-800 block">
                Select Your Bank
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'PNB', 'Bank of Baroda'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-600 text-center font-bold text-slate-700"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 4: Bank Direct Transfer */}
          {selectedModeId === 'bank_transfer' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-slate-800">Direct Bank IMPS / NEFT</span>
                <button
                  type="button"
                  onClick={handleCopyBankDetails}
                  className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                >
                  {bankCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{bankCopied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <div className="space-y-1 text-slate-700 font-mono text-[11px]">
                <p><strong>Beneficiary:</strong> Jobs India Careers Pvt Ltd</p>
                <p><strong>Account No:</strong> 50200084920194</p>
                <p><strong>IFSC Code:</strong> HDFC0001248 (HDFC Bank Muhammadpur)</p>
                <p><strong>Account Type:</strong> Current Account</p>
              </div>
            </div>
          )}

          {/* CTA Submit Button */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              id="confirm-plan-payment-btn"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full py-3.5 sm:py-4 rounded-2xl text-white font-black text-sm shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #DB2777 100%)',
              }}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>
                    Confirm Payment & Activate {plan.name} ({plan.price})
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {settings.ctaSecurityNote || '100% Safe & Secure Payment • Cancel anytime'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
