import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Zap,
  Eye,
  PhoneCall,
  Sliders,
  Award,
  Bell,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  QrCode,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PremiumPlan, PlatformSettings } from '../types';
import {
  loadStoredPremiumPlans,
  loadStoredPlatformSettings,
} from '../data/settingsData';
import { PlanPaymentModal } from './PlanPaymentModal';

interface PremiumTabProps {
  isPremiumUser: boolean;
  onUpgradePremium: () => void;
  plans?: PremiumPlan[];
  settings?: PlatformSettings;
  onToast?: (msg: string) => void;
}

export const PremiumTab: React.FC<PremiumTabProps> = ({
  isPremiumUser,
  onUpgradePremium,
  plans: propPlans,
  settings: propSettings,
  onToast: propOnToast,
}) => {
  const plans = propPlans || loadStoredPremiumPlans();
  const settings = propSettings || loadStoredPlatformSettings();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find((p) => p.popular)?.id || plans[0]?.id || '3m'
  );
  const [isUpgraded, setIsUpgraded] = useState(isPremiumUser);
  const [activePlanDetails, setActivePlanDetails] = useState<PremiumPlan | null>(
    plans.find((p) => p.popular) || plans[0] || null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    if (propOnToast) propOnToast(msg);
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3500);
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const benefits = [
    {
      icon: Eye,
      title: 'Priority Profile Visibility',
      desc: 'Your application is highlighted at the top of HR recruiter dashboards in Patna & India.',
    },
    {
      icon: PhoneCall,
      title: 'More HR Connections',
      desc: 'Direct access to call verified company recruiters and instant WhatsApp interview scheduling.',
    },
    {
      icon: Sliders,
      title: 'Advanced Job Filters',
      desc: 'Filter exclusive confidential high-salary jobs (₹40,000+) before they go public.',
    },
    {
      icon: Award,
      title: 'Resume Boost',
      desc: 'Automated 1-click ATS resume scoring, keyword enhancement, and verified candidate badge.',
    },
    {
      icon: Bell,
      title: 'Instant Job Alerts',
      desc: 'Receive alerts 30 minutes before other candidates when new jobs in Muhammadpur open.',
    },
    {
      icon: Sparkles,
      title: 'Profile Highlighting',
      desc: 'Distinguished golden Jobs India Pro badge on your profile that builds instant recruiter trust.',
    },
  ];

  const handleOpenCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (plan: PremiumPlan) => {
    setIsUpgraded(true);
    setActivePlanDetails(plan);
    onUpgradePremium();
  };

  return (
    <div className="space-y-4 pb-24 pt-1 px-4 max-w-2xl mx-auto">
      {/* Toast Alert */}
      {localToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-indigo-500/50 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Hero Banner with Premium Purple/Pink Gradient Theme */}
      <div
        id="premium-hero-card"
        className="rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 50%, #D94670 100%)',
        }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide uppercase">
            <Crown className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
            <span>Jobs India Premium</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight pt-1">
            Get hired faster with Jobs India Premium
          </h1>

          <p className="text-xs text-white/90 max-w-xs mx-auto leading-relaxed">
            Candidates with Premium receive 4.5x more interview invitations and direct recruiter contact within 24 hours.
          </p>

          {isUpgraded ? (
            <div className="mt-3 bg-white/20 backdrop-blur-md rounded-xl p-2.5 inline-flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#35A853] fill-white" />
              <span>
                Premium Membership Active: {activePlanDetails?.name || 'Pro'} • {activePlanDetails?.activeTime || 'Valid for 90 Days'}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Active Hiring Drive Offer Banner */}
      {settings.activePlanGlobalTimerEnabled && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 text-white flex items-center justify-between text-xs font-black shadow-md">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 animate-bounce text-amber-100" />
            <span>{settings.activePlanOfferBadge || 'SPECIAL RECRUITMENT DRIVE OFFER'}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg text-[11px]">
            <Clock className="w-3 h-3 text-amber-200" />
            <span>Ends in {settings.activePlanGlobalTimerHours || 24} hours</span>
          </div>
        </div>
      )}

      {/* Benefits List */}
      <section className="space-y-2.5">
        <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
          Exclusive Premium Benefits
        </h2>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] divide-y divide-gray-100 shadow-xs overflow-hidden">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="p-3.5 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] text-[#6B3FC7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1E2544]">{b.title}</h4>
                  <p className="text-xs text-[#687386] mt-0.5 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subscription Pricing Cards with Active Time & QR Discount */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
            Choose Your Plan
          </h2>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Instant UPI & QR Code Available</span>
          </span>
        </div>

        <div className={`grid gap-2.5 ${plans.length === 2 ? 'grid-cols-2' : plans.length >= 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-2xl p-3 text-center flex flex-col justify-between transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-[#6B3FC7] bg-[#FAF5FF] shadow-[0_4px_14px_rgba(107,63,199,0.15)] ring-2 ring-[#6B3FC7]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#E83B45] to-[#F5A623] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap uppercase">
                    {plan.badge || 'BEST VALUE'}
                  </div>
                )}

                <div className="pt-1 space-y-1">
                  {/* Active Time Badge */}
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100/70 text-[#6B3FC7] text-[10px] font-black">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{plan.activeTime || `${plan.validityDays || 30} Days`}</span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-700">{plan.name}</h4>
                  <p className="text-base font-black text-[#1E2544] mt-0.5">
                    {plan.price}
                  </p>
                  <p className="text-[10px] text-gray-400 line-through">
                    {plan.originalPrice}
                  </p>
                </div>

                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-semibold text-[#6B3FC7] block">
                    {plan.duration}
                  </span>
                  {plan.qrDiscountAmount && (
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded block truncate">
                      {plan.qrDiscountAmount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA Button */}
      <div className="pt-2 space-y-2">
        <button
          id="premium-subscribe-cta"
          onClick={handleOpenCheckout}
          className="w-full py-3.5 sm:py-4 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 50%, #D94670 100%)',
          }}
        >
          <Crown className="w-4 h-4 fill-white" />
          <span>
            {isUpgraded
              ? `Renew ${selectedPlan.name} (${selectedPlan.price})`
              : `${settings.ctaButtonText || 'Upgrade to Premium Now'} • ${selectedPlan.price}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Quick QR Code Pay Button */}
        {settings.qrCodeConfig?.enabled && (
          <button
            type="button"
            onClick={handleOpenCheckout}
            className="w-full py-2.5 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>Scan Official Jobs India UPI QR Code to Pay ({selectedPlan.price})</span>
          </button>
        )}

        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#687386]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35A853]" />
          <span>
            {settings.ctaSecurityNote ||
              '100% Safe & Secure Payment • Cancel anytime'}
          </span>
        </div>
      </div>

      {/* Interactive Plan Payment & QR Code Modal */}
      {selectedPlan && (
        <PlanPaymentModal
          plan={selectedPlan}
          settings={settings}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          onToast={notify}
        />
      )}
    </div>
  );
};
