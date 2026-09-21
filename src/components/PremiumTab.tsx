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
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PremiumTabProps {
  isPremiumUser: boolean;
  onUpgradePremium: () => void;
}

export const PremiumTab: React.FC<PremiumTabProps> = ({
  isPremiumUser,
  onUpgradePremium,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'1m' | '3m' | '6m'>('3m');
  const [isUpgraded, setIsUpgraded] = useState(isPremiumUser);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

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

  const plans = [
    {
      id: '1m' as const,
      name: '1 Month',
      price: '₹299',
      originalPrice: '₹499',
      duration: 'Billed monthly',
      popular: false,
    },
    {
      id: '3m' as const,
      name: '3 Months',
      price: '₹699',
      originalPrice: '₹1,497',
      duration: 'Save 53% • ₹233/mo',
      popular: true,
      badge: 'BEST VALUE',
    },
    {
      id: '6m' as const,
      name: '6 Months',
      price: '₹1,199',
      originalPrice: '₹2,994',
      duration: 'Save 60% • ₹199/mo',
      popular: false,
    },
  ];

  const handleSubscribe = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsUpgraded(true);
    setShowPaymentSuccess(true);
    onUpgradePremium();
  };

  return (
    <div className="space-y-4 pb-24 pt-1 px-4">
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
              <span>Premium Membership Active until Oct 2026</span>
            </div>
          ) : null}
        </div>
      </div>

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

      {/* Subscription Pricing Cards */}
      <section className="space-y-2.5">
        <h2 className="text-base font-extrabold text-[#1E2544] tracking-tight">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl p-3 text-center flex flex-col justify-between transition-all border ${
                  isSelected
                    ? 'border-[#6B3FC7] bg-[#FAF5FF] shadow-[0_4px_14px_rgba(107,63,199,0.15)] ring-2 ring-[#6B3FC7]/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#E83B45] to-[#F5A623] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="pt-1">
                  <h4 className="text-xs font-bold text-gray-700">{plan.name}</h4>
                  <p className="text-base font-black text-[#1E2544] mt-1">
                    {plan.price}
                  </p>
                  <p className="text-[10px] text-gray-400 line-through">
                    {plan.originalPrice}
                  </p>
                </div>

                <span className="text-[10px] font-semibold text-[#6B3FC7] mt-2 block">
                  {plan.duration}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          id="premium-subscribe-cta"
          onClick={handleSubscribe}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          style={{
            background: 'linear-gradient(135deg, #4055B8 0%, #6B3FC7 50%, #D94670 100%)',
          }}
        >
          <Crown className="w-4 h-4 fill-white" />
          <span>
            {isUpgraded ? 'Renew Premium Plan' : `Upgrade to Premium Now`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#687386]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#35A853]" />
          <span>100% Safe & Secure Payment • Cancel anytime</span>
        </div>
      </div>

      {/* Success Modal Confirmation */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-[#6B3FC7] flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 fill-[#6B3FC7]" />
            </div>
            <h3 className="text-lg font-black text-[#1E2544]">
              Welcome to Jobs India Premium!
            </h3>
            <p className="text-xs text-[#687386]">
              Your profile is now prioritized for recruiters in Patna and top companies. Enjoy direct recruiter connections!
            </p>
            <button
              onClick={() => setShowPaymentSuccess(false)}
              className="w-full py-2.5 rounded-xl bg-[#6B3FC7] text-white text-xs font-bold shadow-md"
            >
              Start Exploring Verified Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
