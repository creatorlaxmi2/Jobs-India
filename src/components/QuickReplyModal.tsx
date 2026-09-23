import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Bell,
  Eye,
  Edit3,
  Copy,
  Users,
  Check,
  Calendar,
  Briefcase,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { ApplicationStatus, QuickReplyTemplate } from '../types';
import { QUICK_REPLY_TEMPLATES } from '../data/quickReplyTemplates';

export interface TargetCandidateInfo {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  location?: string;
  phone?: string;
}

interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'Shortlisted' | 'Rejected' | 'Interviewing';
  targetCandidates: TargetCandidateInfo[];
  onConfirm: (payload: {
    status: ApplicationStatus;
    sendNotification: boolean;
    templateTitle: string;
    subject: string;
    message: string;
  }) => void;
}

export const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  isOpen,
  onClose,
  actionType,
  targetCandidates,
  onConfirm,
}) => {
  // Available templates for this action type
  const availableTemplates = useMemo(() => {
    return QUICK_REPLY_TEMPLATES.filter((t) => t.actionType === actionType);
  }, [actionType]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Representative candidate for previewing variable replacements
  const previewCandidate = targetCandidates[0] || {
    id: 'demo',
    name: 'Candidate',
    jobTitle: 'Job Role',
    company: 'Company',
    location: 'Delhi / NCR',
    phone: '98765 43210',
  };

  // Helper to replace variables
  const resolvePlaceholders = (text: string, cand: TargetCandidateInfo) => {
    return text
      .replace(/{CandidateName}/g, cand.name)
      .replace(/{JobTitle}/g, cand.jobTitle)
      .replace(/{Company}/g, cand.company)
      .replace(/{Location}/g, cand.location || 'Local Hub')
      .replace(/{CandidatePhone}/g, cand.phone || '98765 43210');
  };

  // Set default template when actionType changes or modal opens
  useEffect(() => {
    if (availableTemplates.length > 0) {
      const initial = availableTemplates[0];
      setSelectedTemplateId(initial.id);
      setSubject(resolvePlaceholders(initial.subject, previewCandidate));
      setMessage(resolvePlaceholders(initial.messageTemplate, previewCandidate));
    } else {
      setSelectedTemplateId('custom');
      setSubject(`${actionType} update for your application`);
      setMessage(`Dear ${previewCandidate.name}, your application has been ${actionType}.`);
    }
  }, [actionType, isOpen, availableTemplates]);

  const handleSelectTemplate = (template: QuickReplyTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(resolvePlaceholders(template.subject, previewCandidate));
    setMessage(resolvePlaceholders(template.messageTemplate, previewCandidate));
  };

  const handleSelectCustom = () => {
    setSelectedTemplateId('custom');
    setSubject(`Update on your application for ${previewCandidate.jobTitle}`);
    setMessage(
      `Dear ${previewCandidate.name},\n\nWe are writing to inform you that your application for ${previewCandidate.jobTitle} at ${previewCandidate.company} has been ${actionType.toLowerCase()}.\n\nBest regards,\nHR Recruitment Team`
    );
  };

  const insertVariable = (variable: string) => {
    setMessage((prev) => `${prev} ${variable}`);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`${subject}\n\n${message}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirmSubmit = (withNotification: boolean) => {
    const selectedTpl = availableTemplates.find((t) => t.id === selectedTemplateId);
    onConfirm({
      status: actionType,
      sendNotification: withNotification,
      templateTitle: selectedTpl ? selectedTpl.title : 'Custom Quick Reply',
      subject: subject.trim() || `${actionType} Update: ${previewCandidate.jobTitle}`,
      message: message.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  const isShortlist = actionType === 'Shortlisted';
  const isInterview = actionType === 'Interviewing';
  const isReject = actionType === 'Rejected';

  const badgeBg = isShortlist
    ? 'bg-emerald-500'
    : isInterview
    ? 'bg-[#0047AB]'
    : 'bg-rose-500';

  const accentColor = isShortlist
    ? 'text-emerald-700'
    : isInterview
    ? 'text-[#0047AB]'
    : 'text-rose-700';

  const count = targetCandidates.length;

  return (
    <div
      id="quick-reply-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-2xs animate-in fade-in select-none"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* ======================================================================= */}
        {/* HEADER */}
        {/* ======================================================================= */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`${badgeBg} text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1`}
              >
                {isShortlist ? (
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                ) : isInterview ? (
                  <Calendar className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <X className="w-3 h-3 stroke-[2.5]" />
                )}
                <span>{actionType}</span>
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Quick Reply & Notification
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Select an automated in-app template to notify {count > 1 ? `all ${count} selected candidates` : previewCandidate.name}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white transition-all -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================================= */}
        {/* RECIPIENT SUMMARY CHIP */}
        {/* ======================================================================= */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-slate-600 font-medium">Recipients:</span>
            <span className="font-bold text-slate-900 truncate">
              {count === 1
                ? `${previewCandidate.name} (${previewCandidate.jobTitle})`
                : `${count} Candidates Selected`}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {count} Applicant{count > 1 ? 's' : ''}
          </span>
        </div>

        {/* ======================================================================= */}
        {/* SCROLLABLE BODY */}
        {/* ======================================================================= */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Section 1: Template Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0047AB]" />
                <span>Choose Quick Reply Template</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {availableTemplates.length} templates available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0047AB] bg-blue-50/50 shadow-xs ring-2 ring-[#0047AB]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 text-xs line-clamp-1">
                        {tpl.title}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#0047AB] text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tpl.messageTemplate.replace(/\{[^}]+\}/g, '...')}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {tpl.category}
                      </span>
                      {tpl.suggestedTags?.slice(0, 1).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Option: Custom Template */}
              <div
                onClick={handleSelectCustom}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedTemplateId === 'custom'
                    ? 'border-[#0047AB] bg-blue-50/50 shadow-xs ring-2 ring-[#0047AB]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-900 text-xs">
                    ✍️ Write Custom Message
                  </span>
                  {selectedTemplateId === 'custom' && (
                    <div className="w-4 h-4 rounded-full bg-[#0047AB] text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Draft a personalized notification directly for this candidate.
                </p>
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                    Custom
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Subject & Message Editor */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Message & Notification Content</span>
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-bold text-[#0047AB] hover:underline flex items-center gap-1"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification Title / Subject */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Notification Title / Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter notification title..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#0047AB] shadow-2xs"
              />
            </div>

            {/* Notification Body / Message */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Automated Message Body
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message body..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-hidden focus:border-[#0047AB] shadow-2xs resize-none"
              />
            </div>

            {/* Quick Variable Chips */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Insert Candidate Dynamic Tags:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tag: '{CandidateName}', label: 'Candidate Name' },
                  { tag: '{JobTitle}', label: 'Job Title' },
                  { tag: '{Company}', label: 'Company' },
                  { tag: '{Location}', label: 'Location' },
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => insertVariable(item.tag)}
                    className="px-2 py-0.5 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-[#0047AB] rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Live In-App Notification Card Preview */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#0047AB]" />
                <span>Candidate In-App Notification Preview</span>
              </div>
              <span className="text-[11px] text-[#0047AB]">{isPreviewExpanded ? 'Hide' : 'Show Preview'}</span>
            </button>

            {isPreviewExpanded && (
              <div className="p-3.5 bg-slate-50/50 space-y-2 border-t border-slate-100">
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${badgeBg}`}
                  >
                    {isShortlist ? '⭐' : isInterview ? '🗓️' : '✕'}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
                        {subject || 'Application Status Update'}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                        Just now
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {resolvePlaceholders(message, previewCandidate)}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold text-slate-400">
                      <span>{previewCandidate.company}</span>
                      <span>•</span>
                      <span>Jobs India Notifications</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center italic">
                  This card will instantly appear in the applicant's Notification Bell & Application Timeline.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Send Notification Checkbox */}
          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 flex items-start gap-2.5">
            <input
              id="send-notification-checkbox"
              type="checkbox"
              checked={sendNotification}
              onChange={(e) => setSendNotification(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#0047AB] focus:ring-[#0047AB] cursor-pointer"
            />
            <label
              htmlFor="send-notification-checkbox"
              className="text-xs text-slate-800 cursor-pointer select-none leading-tight"
            >
              <strong className="block font-bold text-slate-900 mb-0.5">
                Dispatch automated in-app notification upon status change
              </strong>
              <span className="text-slate-600 text-[11px]">
                Sends this Quick Reply directly to the candidate's in-app notification center and updates their application history.
              </span>
            </label>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* FOOTER ACTIONS */}
        {/* ======================================================================= */}
        <div className="p-3.5 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleConfirmSubmit(false)}
            className="px-3 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Update Status Quietly (No Notification)
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              id="confirm-quick-reply-btn"
              onClick={() => handleConfirmSubmit(sendNotification)}
              className={`px-4 sm:px-5 py-2 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                isShortlist
                  ? 'bg-[#22C55E] hover:bg-[#16A34A]'
                  : isInterview
                  ? 'bg-[#0047AB] hover:bg-[#003882]'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {sendNotification ? 'Send Notification & ' : 'Confirm '}
                {actionType} ({count})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
