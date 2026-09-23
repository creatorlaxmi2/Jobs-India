import { PremiumPlan, PlatformSettings, PaymentModeConfig, QRCodeConfig } from '../types';

export const DEFAULT_PAYMENT_MODES: PaymentModeConfig[] = [
  {
    id: 'upi_qr',
    name: 'UPI / Scan QR Code',
    description: 'Instant zero-fee payment with Google Pay, PhonePe, Paytm, BHIM or any UPI app',
    isEnabled: true,
    isPopular: true,
    discountOrOffer: 'Flat ₹50 Instant Discount via QR Code',
    instructionNote: 'Scan the official Jobs India QR code or pay to UPI ID for instant 60-second activation.',
  },
  {
    id: 'cards',
    name: 'Debit & Credit Cards',
    description: 'Visa, MasterCard, RuPay cards with 100% secure 3D tokenized authentication',
    isEnabled: true,
    isPopular: false,
    instructionNote: 'Domestic and international cards supported via secure SSL gateway.',
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All 50+ major Indian banks: SBI, HDFC, ICICI, Axis, PNB, Bank of Baroda',
    isEnabled: true,
    isPopular: false,
    instructionNote: 'Direct net banking verification with automated transaction confirmation.',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Direct Transfer (NEFT / IMPS)',
    description: 'Official corporate account transfer for bulk recruiters and company plans',
    isEnabled: true,
    isPopular: false,
    instructionNote: 'Beneficiary: Jobs India Careers Pvt Ltd | A/c: 50200084920194 | IFSC: HDFC0001248',
  },
  {
    id: 'cash_desk',
    name: 'Walk-in Cash / Verification Desk',
    description: 'Offline payment and document verification at Muhammadpur / Patna regional office',
    isEnabled: false,
    isPopular: false,
    instructionNote: 'Visit Jobs India Patna Center, Opp Medanta Hospital, Muhammadpur, Patna - 800020.',
  },
];

export const DEFAULT_QR_CODE_CONFIG: QRCodeConfig = {
  enabled: true,
  upiId: 'jobsindia.careers@okaxis',
  payeeName: 'Jobs India Careers Official',
  merchantCode: '8299',
  qrTitle: 'Jobs India Official UPI QR Code',
  qrSubtitle: 'Scan & Pay with any UPI app (GPay, PhonePe, Paytm, BHIM)',
  allowReceiptUpload: true,
  supportPhoneForUpi: '+91 80020 99412',
  transactionNote: 'Jobs India Premium Subscription',
  qrThemeColor: '#4F46E5', // Indigo/Purple
};

export const DEFAULT_PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: '1m',
    name: '1 Month',
    price: '₹299',
    originalPrice: '₹499',
    duration: 'Billed monthly',
    popular: false,
    isEnabled: true,
    activeTime: '30 Days Validity',
    validityDays: 30,
    activeStatus: 'Active Now',
    activeScheduleText: 'Instant 24x7 Activation',
    timerCountdownHours: 24,
    showActiveTimer: true,
    qrDiscountAmount: '₹30 Extra Off with QR',
  },
  {
    id: '3m',
    name: '3 Months',
    price: '₹699',
    originalPrice: '₹1,497',
    duration: 'Save 53% • ₹233/mo',
    popular: true,
    badge: 'BEST VALUE',
    isEnabled: true,
    activeTime: '90 Days Validity (3 Months)',
    validityDays: 90,
    activeStatus: 'Active Now',
    activeScheduleText: 'Instant 24x7 Activation + Priority Badge',
    timerCountdownHours: 18,
    showActiveTimer: true,
    qrDiscountAmount: 'Flat ₹50 Instant QR Discount',
  },
  {
    id: '6m',
    name: '6 Months',
    price: '₹1,199',
    originalPrice: '₹2,994',
    duration: 'Save 60% • ₹199/mo',
    popular: false,
    isEnabled: true,
    activeTime: '180 Days Full Access (6 Months)',
    validityDays: 180,
    activeStatus: 'Limited Time',
    activeScheduleText: 'Active during Special Hiring Drive',
    timerCountdownHours: 48,
    showActiveTimer: true,
    qrDiscountAmount: '₹100 Extra Off with QR',
  },
];

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'Jobs India',
  supportPhone: '+91 80020 99412',
  supportEmail: 'support@jobsindia.org.in',
  supportWhatsApp: '+91 94710 44820',
  paymentGatewayMode: 'Simulated UPI',
  ctaButtonText: 'Upgrade to Premium Now',
  ctaSecurityNote: '100% Safe & Secure Payment • Cancel anytime',
  allowDirectRecruiterCalls: true,
  requireJobModeration: false,
  autoVerifyHospitalJobs: true,
  freeDailyCandidateUnlocks: 3,
  bannerAnnouncement: 'Special Monsoon Discount: Get up to 60% off on all Premium Career Plans!',
  showAnnouncement: true,
  paymentModes: DEFAULT_PAYMENT_MODES,
  qrCodeConfig: DEFAULT_QR_CODE_CONFIG,
  activePlanOfferBadge: 'LIMITED TIME HIRING DRIVE OFFER',
  activePlanGlobalTimerEnabled: true,
  activePlanGlobalTimerHours: 24,
  activePlanGlobalTimerNote: 'Offer prices & extra QR code discount active for a limited time',
};

const PLANS_STORAGE_KEY = 'jobs_india_premium_plans';
const SETTINGS_STORAGE_KEY = 'jobs_india_platform_settings';

export const loadStoredPremiumPlans = (): PremiumPlan[] => {
  try {
    const saved = localStorage.getItem(PLANS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure activeTime defaults exist
        return parsed.map((p, idx) => {
          const fallback = DEFAULT_PREMIUM_PLANS[idx] || DEFAULT_PREMIUM_PLANS[0];
          return {
            ...fallback,
            ...p,
            activeTime: p.activeTime || fallback.activeTime || '30 Days Validity',
            validityDays: p.validityDays || fallback.validityDays || 30,
            activeStatus: p.activeStatus || fallback.activeStatus || 'Active Now',
            activeScheduleText: p.activeScheduleText || fallback.activeScheduleText || 'Instant 24x7 Activation',
          };
        });
      }
    }
  } catch (e) {
    console.error('Error loading stored premium plans:', e);
  }
  return DEFAULT_PREMIUM_PLANS;
};

export const saveStoredPremiumPlans = (plans: PremiumPlan[]): void => {
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Error saving premium plans:', e);
  }
};

export const loadStoredPlatformSettings = (): PlatformSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...parsed,
        paymentModes: parsed.paymentModes?.length ? parsed.paymentModes : DEFAULT_PAYMENT_MODES,
        qrCodeConfig: { ...DEFAULT_QR_CODE_CONFIG, ...(parsed.qrCodeConfig || {}) },
      };
    }
  } catch (e) {
    console.error('Error loading stored platform settings:', e);
  }
  return DEFAULT_PLATFORM_SETTINGS;
};

export const saveStoredPlatformSettings = (settings: PlatformSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving platform settings:', e);
  }
};
