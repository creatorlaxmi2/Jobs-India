import React, { useState, useRef } from 'react';
import {
  CreditCard,
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Crown,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Building,
  Bell,
  CheckCircle2,
  Eye,
  Settings,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Info,
  Clock,
  QrCode,
  Upload,
  Download,
  Copy,
  Smartphone,
  Tag,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import {
  PremiumPlan,
  PlatformSettings,
  PaymentModeConfig,
  QRCodeConfig,
} from '../types';
import {
  DEFAULT_PREMIUM_PLANS,
  DEFAULT_PLATFORM_SETTINGS,
  DEFAULT_PAYMENT_MODES,
  DEFAULT_QR_CODE_CONFIG,
} from '../data/settingsData';
import { QRCodeDisplay } from './QRCodeDisplay';

interface AdminPlansAndSettingsProps {
  plans: PremiumPlan[];
  settings: PlatformSettings;
  onSavePlans: (updatedPlans: PremiumPlan[]) => void;
  onSaveSettings: (updatedSettings: PlatformSettings) => void;
  onToast: (msg: string) => void;
}

export const AdminPlansAndSettings: React.FC<AdminPlansAndSettingsProps> = ({
  plans: initialPlans,
  settings: initialSettings,
  onSavePlans,
  onSaveSettings,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'plans' | 'payment-modes' | 'qr-code' | 'settings'
  >('plans');

  // Local state for plans
  const [plans, setPlans] = useState<PremiumPlan[]>(initialPlans);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(
    initialPlans[1]?.id || initialPlans[0]?.id || null
  );

  // Local state for settings
  const [settings, setSettings] = useState<PlatformSettings>({
    ...DEFAULT_PLATFORM_SETTINGS,
    ...initialSettings,
    paymentModes: initialSettings.paymentModes?.length
      ? initialSettings.paymentModes
      : DEFAULT_PAYMENT_MODES,
    qrCodeConfig: {
      ...DEFAULT_QR_CODE_CONFIG,
      ...(initialSettings.qrCodeConfig || {}),
    },
  });

  // Preview plan selection state
  const [previewSelectedPlanId, setPreviewSelectedPlanId] = useState<string>(
    initialPlans.find((p) => p.popular)?.id || initialPlans[0]?.id || ''
  );

  // File input ref for custom QR image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers for Plan Editing
  const handleUpdatePlanField = (
    id: string,
    field: keyof PremiumPlan,
    value: any
  ) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleTogglePopular = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => ({
        ...p,
        popular: p.id === id,
      }))
    );
  };

  const handleAddNewPlan = () => {
    const newId = `plan_${Date.now()}`;
    const newPlan: PremiumPlan = {
      id: newId,
      name: '12 Months (Annual)',
      price: '₹1,999',
      originalPrice: '₹5,999',
      duration: 'Save 67% • ₹166/mo',
      popular: false,
      badge: 'ANNUAL SAVER',
      isEnabled: true,
      activeTime: '365 Days Full Year Access',
      validityDays: 365,
      activeStatus: 'Active Now',
      activeScheduleText: 'Instant 24x7 Activation + Priority Badge',
      timerCountdownHours: 48,
      showActiveTimer: true,
      qrDiscountAmount: 'Flat ₹150 Instant QR Discount',
    };
    const updated = [...plans, newPlan];
    setPlans(updated);
    setEditingPlanId(newId);
    onToast('➕ New subscription plan tier added! Configure pricing & active time.');
  };

  const handleDeletePlan = (id: string) => {
    if (plans.length <= 1) {
      onToast('⚠️ At least one plan must remain active.');
      return;
    }
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    if (editingPlanId === id) {
      setEditingPlanId(updated[0]?.id || null);
    }
    if (previewSelectedPlanId === id) {
      setPreviewSelectedPlanId(updated[0]?.id || '');
    }
    onToast('🗑️ Plan tier removed.');
  };

  const handleMovePlan = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= plans.length) return;
    const updated = [...plans];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPlans(updated);
  };

  const handleResetPlans = () => {
    if (
      window.confirm(
        'Reset all "Choose Your Plan" pricing, active times, and tiers to factory default values?'
      )
    ) {
      setPlans(DEFAULT_PREMIUM_PLANS);
      setEditingPlanId('3m');
      setPreviewSelectedPlanId('3m');
      onSavePlans(DEFAULT_PREMIUM_PLANS);
      onToast('🔄 Plans & active time settings reset to defaults.');
    }
  };

  const handleSaveAllPlans = () => {
    onSavePlans(plans);
    onToast('✅ "Choose Your Plan" & Active Time changes published successfully!');
  };

  // Handlers for Payment Modes
  const handleTogglePaymentMode = (modeId: string) => {
    const currentModes = settings.paymentModes || DEFAULT_PAYMENT_MODES;
    const updated = currentModes.map((m) =>
      m.id === modeId ? { ...m, isEnabled: !m.isEnabled } : m
    );
    setSettings((prev) => ({ ...prev, paymentModes: updated }));
    onToast('Updated payment mode status.');
  };

  const handleUpdatePaymentModeField = (
    modeId: string,
    field: keyof PaymentModeConfig,
    value: any
  ) => {
    const currentModes = settings.paymentModes || DEFAULT_PAYMENT_MODES;
    const updated = currentModes.map((m) =>
      m.id === modeId ? { ...m, [field]: value } : m
    );
    setSettings((prev) => ({ ...prev, paymentModes: updated }));
  };

  const handleAddNewPaymentMode = () => {
    const newModeId = `mode_${Date.now()}`;
    const newMode: PaymentModeConfig = {
      id: newModeId,
      name: 'EMI / Pay Later',
      description: 'Zero interest 3-month EMI options via partner banks',
      isEnabled: true,
      instructionNote: 'Available on all credit cards and select debit cards.',
    };
    const updated = [...(settings.paymentModes || DEFAULT_PAYMENT_MODES), newMode];
    setSettings((prev) => ({ ...prev, paymentModes: updated }));
    onToast('➕ Custom payment mode added!');
  };

  // Handlers for QR Code Studio
  const handleUpdateQrConfig = (field: keyof QRCodeConfig, value: any) => {
    setSettings((prev) => ({
      ...prev,
      qrCodeConfig: {
        ...(prev.qrCodeConfig || DEFAULT_QR_CODE_CONFIG),
        [field]: value,
      },
    }));
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('⚠️ Please upload a valid image file (PNG, JPG, SVG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      onToast('⚠️ Image file is larger than 2MB. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleUpdateQrConfig('qrImageUrl', dataUrl);
      onToast('🖼️ Custom QR Code image uploaded and activated!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQrImage = () => {
    handleUpdateQrConfig('qrImageUrl', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onToast('🔄 Switched back to dynamic SVG QR Code generator.');
  };

  // Handlers for Settings
  const handleUpdateSetting = (field: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        'Reset all platform settings, QR code, and payment modes to factory defaults?'
      )
    ) {
      setSettings(DEFAULT_PLATFORM_SETTINGS);
      onSaveSettings(DEFAULT_PLATFORM_SETTINGS);
      onToast('🔄 Platform settings restored to defaults.');
    }
  };

  const handleSaveAllSettings = () => {
    onSaveSettings(settings);
    onToast('✅ Platform configuration, payment modes & QR code saved successfully!');
  };

  // Active plan for preview
  const currentPreviewPlan =
    plans.find((p) => p.id === previewSelectedPlanId) || plans[0];

  const qrConfig = settings.qrCodeConfig || DEFAULT_QR_CODE_CONFIG;
  const paymentModes = settings.paymentModes || DEFAULT_PAYMENT_MODES;
  const enabledModesCount = paymentModes.filter((m) => m.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* Sub-navigation between 4 Admin Modules */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#1E293B] p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {/* Tab 1: Choose Your Plan & Active Time */}
          <button
            id="admin-tab-choose-plan"
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Choose Your Plan & Active Time</span>
            <span className="bg-purple-900/60 text-purple-200 text-[10px] px-1.5 py-0.2 rounded-full border border-purple-500/30">
              {plans.length} Tiers
            </span>
          </button>

          {/* Tab 2: Payment Modes */}
          <button
            id="admin-tab-payment-modes"
            type="button"
            onClick={() => setActiveTab('payment-modes')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'payment-modes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Payment Modes</span>
            <span className="bg-indigo-900/60 text-indigo-200 text-[10px] px-1.5 py-0.2 rounded-full border border-indigo-500/30">
              {enabledModesCount} Active
            </span>
          </button>

          {/* Tab 3: QR Code Studio & Add Feature */}
          <button
            id="admin-tab-qr-code"
            type="button"
            onClick={() => setActiveTab('qr-code')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'qr-code'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code Studio</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                qrConfig.enabled
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-950 text-red-300 border border-red-500/40'
              }`}
            >
              {qrConfig.enabled ? 'Live QR' : 'Disabled'}
            </span>
          </button>

          {/* Tab 4: Other Settings */}
          <button
            id="admin-tab-other-settings"
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>General Settings</span>
          </button>
        </div>

        {/* Global Save Actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {activeTab === 'plans' ? (
            <>
              <button
                type="button"
                onClick={handleResetPlans}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset Plans"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
              <button
                type="button"
                id="save-plans-top-btn"
                onClick={handleSaveAllPlans}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Plans</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleResetSettings}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset Settings"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
              <button
                type="button"
                id="save-settings-top-btn"
                onClick={handleSaveAllSettings}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: CHOOSE YOUR PLAN & ACTIVE TIME EDITOR                             */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* LIVE CANDIDATE VIEW PREVIEW */}
          <div className="bg-[#1E293B]/90 border border-purple-900/50 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Live Candidate View Preview</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      With Active Time & QR Support
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Real-time preview of how job seekers see subscription cards with active validity.
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                Click any card to select for preview
              </span>
            </div>

            {/* The Live Container */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-6 border border-slate-300 text-slate-900 shadow-inner space-y-4">
              {/* Limited Time Active Banner */}
              {settings.activePlanGlobalTimerEnabled && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-2.5 text-white flex items-center justify-between text-xs font-extrabold shadow-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 animate-bounce" />
                    <span>{settings.activePlanOfferBadge || 'LIMITED TIME HIRING DRIVE OFFER'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-lg text-[11px]">
                    <Clock className="w-3 h-3 text-amber-200" />
                    <span>Active for next {settings.activePlanGlobalTimerHours || 24} hours</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-[#1E2544] tracking-tight">
                  Choose Your Plan
                </h2>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Plans Active 24x7</span>
                </span>
              </div>

              {/* Cards Grid with Active Time Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {plans.map((plan) => {
                  const isSelected = previewSelectedPlanId === plan.id;
                  const isPopular = plan.popular;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setPreviewSelectedPlanId(plan.id)}
                      className={`relative rounded-3xl p-4 sm:p-5 text-center flex flex-col justify-between transition-all cursor-pointer select-none bg-white ${
                        isPopular || isSelected
                          ? 'border-2 border-[#7C3AED] shadow-[0_8px_24px_rgba(124,58,237,0.18)] ring-2 ring-[#7C3AED]/20'
                          : 'border border-slate-200 shadow-xs hover:border-slate-300'
                      }`}
                    >
                      {/* BEST VALUE / Custom Ribbon Badge */}
                      {plan.badge && isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-white text-[10px] font-black tracking-wider px-3 py-0.5 rounded-full shadow-md uppercase whitespace-nowrap">
                          {plan.badge}
                        </div>
                      )}

                      <div className="pt-2">
                        {/* Active Status Badge */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold mb-1.5 border border-emerald-200">
                          <Clock className="w-3 h-3" />
                          <span>{plan.activeStatus || 'Active Now'}</span>
                        </div>

                        <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                          {plan.name}
                        </h4>
                        <div className="mt-2 space-y-0.5">
                          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {plan.price}
                          </p>
                          <p className="text-xs text-slate-400 line-through font-semibold">
                            {plan.originalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Active Time & Validity Highlight */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                        <div className="bg-purple-50 text-[#6D28D9] font-black text-xs py-1 px-2 rounded-xl border border-purple-100 flex items-center justify-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#6D28D9]" />
                          <span>{plan.activeTime || `${plan.validityDays || 30} Days Validity`}</span>
                        </div>

                        <span className="text-[11px] font-semibold text-slate-500 block truncate">
                          {plan.duration}
                        </span>

                        {plan.qrDiscountAmount && (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded block">
                            🏷️ {plan.qrDiscountAmount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Modes Accepted Bar in Preview */}
              <div className="bg-white rounded-2xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span className="font-extrabold text-slate-700">Supported Payment Modes:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {paymentModes
                    .filter((m) => m.isEnabled)
                    .map((m) => (
                      <span
                        key={m.id}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-bold border border-slate-200"
                      >
                        {m.name}
                      </span>
                    ))}
                </div>
              </div>

              {/* CTA Upgrade Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  className="w-full py-3.5 sm:py-4 rounded-2xl text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #DB2777 100%)',
                  }}
                >
                  <Crown className="w-5 h-5 fill-white text-white" />
                  <span>
                    {settings.ctaButtonText || 'Upgrade to Premium Now'} ({currentPreviewPlan.price})
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {settings.ctaSecurityNote ||
                      '100% Safe & Secure Payment • Cancel anytime'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PLAN TIERS, ACTIVE TIME & PRICE EDITOR */}
          <div className="bg-[#1E293B]/80 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>Plan Tiers, Active Time & Pricing Editor</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Set prices, active validity time, duration, and discount badges for each subscription tier.
                </p>
              </div>

              <button
                type="button"
                id="add-new-plan-btn"
                onClick={handleAddNewPlan}
                className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Plan Tier</span>
              </button>
            </div>

            {/* Individual Plan Cards Editor */}
            <div className="space-y-4">
              {plans.map((plan, index) => {
                const isSelectedForEdit = editingPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border transition-all p-4 space-y-4 ${
                      isSelectedForEdit
                        ? 'bg-slate-900 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-black flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">{plan.name}</h4>
                        <span className="text-emerald-400 font-extrabold text-sm">
                          {plan.price}
                        </span>
                        <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{plan.activeTime || '30 Days'}</span>
                        </span>
                        {plan.popular && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                            {plan.badge || 'BEST VALUE'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Move Up/Down Order */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMovePlan(index, 'left')}
                          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === plans.length - 1}
                          onClick={() => handleMovePlan(index, 'right')}
                          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Set as Popular Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(plan.id)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ml-1 ${
                            plan.popular
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                          title="Toggle Highlight/Popular"
                        >
                          ⭐ {plan.popular ? 'Best Value (Active)' : 'Mark Best Value'}
                        </button>

                        {/* Delete Plan */}
                        <button
                          type="button"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                          title="Delete this plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs Row 1: Basic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                      {/* Plan Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) =>
                            handleUpdatePlanField(plan.id, 'name', e.target.value)
                          }
                          placeholder="e.g. 1 Month, 3 Months"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold"
                        />
                      </div>

                      {/* Selling Price */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Discounted Selling Price
                        </label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) =>
                            handleUpdatePlanField(plan.id, 'price', e.target.value)
                          }
                          placeholder="e.g. ₹299, ₹699"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-bold text-emerald-400"
                        />
                      </div>

                      {/* Strikethrough Price */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Original Price (Strikethrough)
                        </label>
                        <input
                          type="text"
                          value={plan.originalPrice}
                          onChange={(e) =>
                            handleUpdatePlanField(
                              plan.id,
                              'originalPrice',
                              e.target.value
                            )
                          }
                          placeholder="e.g. ₹499, ₹1,497"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold"
                        />
                      </div>

                      {/* Duration / Savings Subtitle */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Duration & Savings Subtitle
                        </label>
                        <input
                          type="text"
                          value={plan.duration}
                          onChange={(e) =>
                            handleUpdatePlanField(
                              plan.id,
                              'duration',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Save 53% • ₹233/mo"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Inputs Row 2: ACTIVE TIME & VALIDITY SETTINGS */}
                    <div className="bg-[#0F172A]/90 p-3.5 rounded-xl border border-indigo-950 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-black text-white">
                            Active Time & Plan Validity Configuration
                          </span>
                        </div>
                        {/* Quick Presets */}
                        <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 font-semibold">Presets:</span>
                          {[
                            { label: '15D', days: 15, text: '15 Days Trial Validity' },
                            { label: '30D', days: 30, text: '30 Days Validity' },
                            { label: '90D', days: 90, text: '90 Days Validity (3 Months)' },
                            { label: '180D', days: 180, text: '180 Days Full Access' },
                            { label: '365D', days: 365, text: '365 Days Annual Access' },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                handleUpdatePlanField(plan.id, 'activeTime', preset.text);
                                handleUpdatePlanField(plan.id, 'validityDays', preset.days);
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-bold transition-colors"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Active Time Text Display */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Active Time Display Label
                          </label>
                          <input
                            type="text"
                            value={plan.activeTime || ''}
                            onChange={(e) =>
                              handleUpdatePlanField(plan.id, 'activeTime', e.target.value)
                            }
                            placeholder="e.g. 90 Days Validity (3 Months)"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-indigo-300 font-extrabold focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Validity in Days */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Validity Duration (Days)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="3650"
                            value={plan.validityDays || 30}
                            onChange={(e) =>
                              handleUpdatePlanField(
                                plan.id,
                                'validityDays',
                                parseInt(e.target.value) || 30
                              )
                            }
                            placeholder="30"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        {/* Active Status Mode */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Active Status Badge
                          </label>
                          <select
                            value={plan.activeStatus || 'Active Now'}
                            onChange={(e) =>
                              handleUpdatePlanField(plan.id, 'activeStatus', e.target.value)
                            }
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Active Now">🟢 Active Now (Live 24x7)</option>
                            <option value="Limited Time">⚡ Limited Time Offer</option>
                            <option value="Expiring Soon">⏳ Expiring Soon</option>
                            <option value="Always Active">♾️ Always Active</option>
                            <option value="Paused">⏸️ Paused (Inactive)</option>
                          </select>
                        </div>
                      </div>

                      {/* Extra Sub-row: Activation Schedule & QR Discount */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Activation Schedule / Timing Note
                          </label>
                          <input
                            type="text"
                            value={plan.activeScheduleText || ''}
                            onChange={(e) =>
                              handleUpdatePlanField(
                                plan.id,
                                'activeScheduleText',
                                e.target.value
                              )
                            }
                            placeholder="e.g. Instant 24x7 Activation within 60s"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Extra Discount on UPI QR Code Payment
                          </label>
                          <input
                            type="text"
                            value={plan.qrDiscountAmount || ''}
                            onChange={(e) =>
                              handleUpdatePlanField(
                                plan.id,
                                'qrDiscountAmount',
                                e.target.value
                              )
                            }
                            placeholder="e.g. Flat ₹50 Instant QR Discount"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ribbon Badge Input for Popular Plan */}
                    {plan.popular && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="text-amber-200 font-bold">
                            Top Badge Ribbon Text:
                          </span>
                        </div>
                        <input
                          type="text"
                          value={plan.badge || ''}
                          onChange={(e) =>
                            handleUpdatePlanField(plan.id, 'badge', e.target.value)
                          }
                          placeholder="BEST VALUE / POPULAR / RECOMMENDED"
                          className="w-full sm:w-64 px-3 py-1 bg-slate-900 border border-amber-500/40 rounded-lg text-xs text-amber-200 placeholder-amber-500/40 font-black focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Save Action */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Changes to plan pricing and active time take effect immediately on candidate screens.
              </span>
              <button
                type="button"
                id="save-plans-bottom-btn"
                onClick={handleSaveAllPlans}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save All "Choose Your Plan" & Active Time Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PAYMENT MODES MANAGEMENT                                          */}
      {/* ========================================================================= */}
      {activeTab === 'payment-modes' && (
        <div className="space-y-6">
          <div className="bg-[#1E293B]/90 border border-indigo-900/50 rounded-3xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Configured Payment Modes</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Enable, disable, or customize payment channels offered to candidates during checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddNewPaymentMode}
                className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Payment Mode</span>
              </button>
            </div>

            {/* Gateway Mode Selector */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  Payment Processing Gateway Mode
                </label>
                <select
                  value={settings.paymentGatewayMode}
                  onChange={(e) =>
                    handleUpdateSetting('paymentGatewayMode', e.target.value)
                  }
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  <option value="Simulated UPI">Simulated UPI / Instant Confetti (Demo & Testing Mode)</option>
                  <option value="Razorpay Live">Razorpay India Gateway (UPI, Cards, NetBanking)</option>
                  <option value="PhonePe UPI">PhonePe Merchant Gateway / QR Code</option>
                  <option value="Cashfree">Cashfree Payments Auto-Collect</option>
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Determines whether payments are instantly simulated or processed through live Indian gateways.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  Limited-Time Global Active Offer Banner
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateSetting(
                        'activePlanGlobalTimerEnabled',
                        !settings.activePlanGlobalTimerEnabled
                      )
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      settings.activePlanGlobalTimerEnabled
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.activePlanGlobalTimerEnabled ? '⚡ Active Timer ON' : 'Off'}
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.activePlanGlobalTimerHours || 24}
                    onChange={(e) =>
                      handleUpdateSetting(
                        'activePlanGlobalTimerHours',
                        parseInt(e.target.value) || 24
                      )
                    }
                    className="w-24 px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-bold text-center"
                    placeholder="24"
                  />
                  <span className="text-xs text-slate-400">Hours countdown</span>
                </div>
              </div>
            </div>

            {/* List of Payment Modes */}
            <div className="space-y-3.5">
              {paymentModes.map((mode) => {
                return (
                  <div
                    key={mode.id}
                    className={`rounded-2xl border p-4 transition-all space-y-3 ${
                      mode.isEnabled
                        ? 'bg-slate-900 border-indigo-900/60 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                            mode.isEnabled
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {mode.id === 'upi_qr' ? (
                            <QrCode className="w-5 h-5 text-indigo-400" />
                          ) : mode.id === 'cards' ? (
                            <CreditCard className="w-5 h-5 text-blue-400" />
                          ) : mode.id === 'netbanking' ? (
                            <Building className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Smartphone className="w-5 h-5 text-purple-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-white">{mode.name}</h4>
                            {mode.isPopular && (
                              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.2 rounded-full border border-emerald-500/30 uppercase">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{mode.description}</p>
                        </div>
                      </div>

                      {/* Enable/Disable Switch */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            mode.isEnabled ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {mode.isEnabled ? 'Active' : 'Disabled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleTogglePaymentMode(mode.id)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                            mode.isEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              mode.isEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Mode Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Promotional Offer / Discount Badge
                        </label>
                        <input
                          type="text"
                          value={mode.discountOrOffer || ''}
                          onChange={(e) =>
                            handleUpdatePaymentModeField(
                              mode.id,
                              'discountOrOffer',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Flat ₹50 Instant Discount via QR Code"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-emerald-400 font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 block">
                          Checkout Instruction / Note for User
                        </label>
                        <input
                          type="text"
                          value={mode.instructionNote || ''}
                          onChange={(e) =>
                            handleUpdatePaymentModeField(
                              mode.id,
                              'instructionNote',
                              e.target.value
                            )
                          }
                          placeholder="e.g. Scan QR Code using Google Pay, PhonePe, or Paytm"
                          className="w-full px-3 py-1.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-slate-300 font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Save */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAllSettings}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Payment Modes Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: QR CODE STUDIO & ADD FEATURE                                      */}
      {/* ========================================================================= */}
      {activeTab === 'qr-code' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: QR Code Settings & Upload Form */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#1E293B]/90 border border-emerald-900/50 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        Official Merchant UPI & QR Code Configuration
                      </h3>
                      <p className="text-xs text-slate-400">
                        Configure the UPI ID, payee details, and QR code image for instant candidate payments.
                      </p>
                    </div>
                  </div>

                  {/* Toggle QR Code Mode */}
                  <button
                    type="button"
                    onClick={() => handleUpdateQrConfig('enabled', !qrConfig.enabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      qrConfig.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        qrConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-3.5">
                  {/* UPI ID */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      Merchant UPI ID / VPA <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={qrConfig.upiId}
                      onChange={(e) => handleUpdateQrConfig('upiId', e.target.value)}
                      placeholder="e.g. jobsindia.careers@okaxis or 8002099412@ybl"
                      className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-slate-400 block">
                      This UPI ID is embedded into the dynamic QR code and 1-click mobile UPI intent.
                    </span>
                  </div>

                  {/* Payee Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      Merchant Business / Payee Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={qrConfig.payeeName}
                      onChange={(e) => handleUpdateQrConfig('payeeName', e.target.value)}
                      placeholder="Jobs India Careers Official"
                      className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* QR Code Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">
                        QR Header Title
                      </label>
                      <input
                        type="text"
                        value={qrConfig.qrTitle}
                        onChange={(e) => handleUpdateQrConfig('qrTitle', e.target.value)}
                        placeholder="Jobs India Official UPI QR Code"
                        className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Default Transaction Note */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300 block">
                        UPI Transaction Note (Remarks)
                      </label>
                      <input
                        type="text"
                        value={qrConfig.transactionNote || ''}
                        onChange={(e) =>
                          handleUpdateQrConfig('transactionNote', e.target.value)
                        }
                        placeholder="Jobs India Premium Subscription"
                        className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* QR Color Theme Styling */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-300 block">
                      QR Code Color Theme
                    </label>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Indigo Purple', color: '#4F46E5' },
                        { label: 'Emerald Green', color: '#059669' },
                        { label: 'Royal Violet', color: '#7C3AED' },
                        { label: 'Classic Black', color: '#0F172A' },
                      ].map((theme) => (
                        <button
                          key={theme.color}
                          type="button"
                          onClick={() => handleUpdateQrConfig('qrThemeColor', theme.color)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            (qrConfig.qrThemeColor || '#4F46E5') === theme.color
                              ? 'border-white text-white bg-slate-800 shadow-sm'
                              : 'border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span>{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ADD / UPLOAD CUSTOM QR CODE IMAGE */}
                  <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-white">
                          Add / Upload Custom QR Code Image
                        </span>
                      </div>
                      {qrConfig.qrImageUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomQrImage}
                          className="text-[11px] text-red-400 hover:text-red-300 font-bold"
                        >
                          Remove Custom Image
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Upload your official PhonePe, Google Pay for Business, Paytm, or Bank soundbox QR code image (PNG, JPG, SVG).
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleQrImageUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload QR Image File</span>
                      </button>

                      <span className="text-xs text-slate-500">or</span>

                      <input
                        type="text"
                        value={qrConfig.qrImageUrl || ''}
                        onChange={(e) =>
                          handleUpdateQrConfig('qrImageUrl', e.target.value)
                        }
                        placeholder="Paste Image URL (https://...)"
                        className="w-full sm:flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Verification Settings */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <span className="font-bold text-white block">
                        Require Candidate 12-Digit UTR Number
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Allows manual audit of UPI reference IDs against your bank statement.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQrConfig(
                          'allowReceiptUpload',
                          !qrConfig.allowReceiptUpload
                        )
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        qrConfig.allowReceiptUpload ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          qrConfig.allowReceiptUpload ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Bottom Save QR Settings */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveAllSettings}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save QR Code Studio Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Real-time Live Scannable QR Code Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#1E293B]/90 border border-emerald-900/50 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      Live Candidate QR Code Preview
                    </h4>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Scannable
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  This exact QR code is rendered when candidates click "Upgrade to Premium Now".
                </p>

                {/* Live Card */}
                <QRCodeDisplay
                  config={qrConfig}
                  amount={699}
                  planName="3 Months Pro Plan"
                  onToast={onToast}
                  size={190}
                />

                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant NPCI UPI Compatibility</span>
                  </p>
                  <p>
                    Supports Google Pay, PhonePe, Paytm, BHIM, Cred, and all major Indian banking UPI apps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: GENERAL PLATFORM SETTINGS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Section 1: Checkout & Trust Settings */}
          <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Payment CTA & Trust Guarantee Settings
                </h3>
                <p className="text-xs text-slate-400">
                  Configure checkout button text and security badges displayed under the plan cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={settings.ctaButtonText}
                  onChange={(e) =>
                    handleUpdateSetting('ctaButtonText', e.target.value)
                  }
                  placeholder="Upgrade to Premium Now"
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-bold"
                />
                <span className="text-[11px] text-slate-400 block">
                  Appears inside the gradient button under the plan cards.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Security & Payment Trust Note
                </label>
                <input
                  type="text"
                  value={settings.ctaSecurityNote}
                  onChange={(e) =>
                    handleUpdateSetting('ctaSecurityNote', e.target.value)
                  }
                  placeholder="100% Safe & Secure Payment • Cancel anytime"
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold"
                />
                <span className="text-[11px] text-slate-400 block">
                  Displayed alongside the green verified badge below the button.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Daily Free Candidate CV Unlocks
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.freeDailyCandidateUnlocks}
                    onChange={(e) =>
                      handleUpdateSetting(
                        'freeDailyCandidateUnlocks',
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-28 px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-black"
                  />
                  <span className="text-xs text-slate-400">
                    Unlocks/day for basic non-premium users before requiring upgrade.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Support & Contact Details */}
          <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Official Support & Helpdesk Contacts
                </h3>
                <p className="text-xs text-slate-400">
                  Phone and WhatsApp channels provided to job seekers and employers for support.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Support Helpline Phone</span>
                </label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    handleUpdateSetting('supportPhone', e.target.value)
                  }
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official WhatsApp Support</span>
                </label>
                <input
                  type="text"
                  value={settings.supportWhatsApp}
                  onChange={(e) =>
                    handleUpdateSetting('supportWhatsApp', e.target.value)
                  }
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Support Email</span>
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    handleUpdateSetting('supportEmail', e.target.value)
                  }
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Safety, Verification & Moderation Rules */}
          <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Safety, Moderation & Anti-Fraud Flags
                </h3>
                <p className="text-xs text-slate-400">
                  Platform automation rules designed to prevent scams and ensure job quality.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Allow Direct Recruiter Calls */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-white block">
                    Allow Direct Recruiter Calls & WhatsApp Connection
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Enables verified candidates to directly dial recruiters during business hours (9 AM - 6 PM).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateSetting(
                      'allowDirectRecruiterCalls',
                      !settings.allowDirectRecruiterCalls
                    )
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.allowDirectRecruiterCalls ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.allowDirectRecruiterCalls ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Require Super Admin Moderation */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="font-bold text-xs text-white block">
                    Strict Job Approval Mode
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    When ON, new employer postings remain in 'Pending' moderation queue until an admin approves.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateSetting(
                      'requireJobModeration',
                      !settings.requireJobModeration
                    )
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.requireJobModeration ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      settings.requireJobModeration ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Announcement Notice Banner */}
          <div className="bg-[#1E293B]/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    App-Wide Announcement Notice Banner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Display an alert notice bar at the top of candidate and recruiter screens.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleUpdateSetting('showAnnouncement', !settings.showAnnouncement)
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.showAnnouncement ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.showAnnouncement ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.showAnnouncement && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs font-bold text-slate-300 block">
                  Announcement Message Text
                </label>
                <textarea
                  rows={2}
                  value={settings.bannerAnnouncement || ''}
                  onChange={(e) =>
                    handleUpdateSetting('bannerAnnouncement', e.target.value)
                  }
                  placeholder="Type banner alert message..."
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-semibold leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Save Settings Bottom Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Settings are stored securely and synchronized across the platform.
            </span>
            <button
              type="button"
              id="save-settings-bottom-btn"
              onClick={handleSaveAllSettings}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save All Platform Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
