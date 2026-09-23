import React, { useState, useMemo } from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Check,
  Copy,
  Search,
  Bell,
  CheckCircle2,
  Calendar,
  XCircle,
  ExternalLink,
  ChevronRight,
  Send,
} from 'lucide-react';
import { QUICK_REPLY_TEMPLATES } from '../data/quickReplyTemplates';
import { QuickReplyActionType, QuickReplyTemplate } from '../types';

interface QuickReplyTemplatesLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApplicationsWithStatus?: (status: 'All' | 'Applied' | 'Shortlisted' | 'Interviewing' | 'Rejected') => void;
}

export const QuickReplyTemplatesLibraryModal: React.FC<QuickReplyTemplatesLibraryModalProps> = ({
  isOpen,
  onClose,
  onOpenApplicationsWithStatus,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | QuickReplyActionType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<QuickReplyTemplate>(QUICK_REPLY_TEMPLATES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return QUICK_REPLY_TEMPLATES.filter((tpl) => {
      const matchFilter = selectedFilter === 'All' || tpl.actionType === selectedFilter;
      const matchQuery =
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [selectedFilter, searchQuery]);

  const handleCopy = (tpl: QuickReplyTemplate) => {
    navigator.clipboard.writeText(`${tpl.subject}\n\n${tpl.messageTemplate}`);
    setCopiedId(tpl.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="quick-reply-templates-library-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-2xs animate-in fade-in select-none"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[800px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0047AB] text-white p-4 sm:p-5 flex items-start justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Quick Reply Templates Library
              </h2>
            </div>
            <p className="text-xs text-blue-100">
              Automated in-app notification templates for shortlisting, interviews, and rejections.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-white transition-all -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Search */}
        <div className="p-3 sm:px-4 bg-slate-50 border-b border-slate-200 space-y-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Shortlisted', 'Interviewing', 'Rejected'] as const).map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? filter === 'Shortlisted'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : filter === 'Interviewing'
                        ? 'bg-[#0047AB] text-white shadow-xs'
                        : filter === 'Rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filter === 'Shortlisted' && <CheckCircle2 className="w-3 h-3" />}
                  {filter === 'Interviewing' && <Calendar className="w-3 h-3" />}
                  {filter === 'Rejected' && <XCircle className="w-3 h-3" />}
                  <span>{filter}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {filter === 'All'
                      ? QUICK_REPLY_TEMPLATES.length
                      : QUICK_REPLY_TEMPLATES.filter((t) => t.actionType === filter).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, keyword, or message..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#0047AB]"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">No matching templates found</p>
              <button
                onClick={() => {
                  setSelectedFilter('All');
                  setSearchQuery('');
                }}
                className="text-xs text-[#0047AB] font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTemplates.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              const isShortlist = tpl.actionType === 'Shortlisted';
              const isInterview = tpl.actionType === 'Interviewing';
              const isReject = tpl.actionType === 'Rejected';

              const badgeColor = isShortlist
                ? 'bg-emerald-100 text-emerald-800'
                : isInterview
                ? 'bg-blue-100 text-[#0047AB]'
                : 'bg-rose-100 text-rose-800';

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0047AB] bg-blue-50/40 shadow-xs ring-2 ring-[#0047AB]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {tpl.actionType}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {tpl.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(tpl);
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Template Text"
                      >
                        {copiedId === tpl.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {onOpenApplicationsWithStatus && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenApplicationsWithStatus(
                              tpl.actionType === 'Shortlisted'
                                ? 'Shortlisted'
                                : tpl.actionType === 'Interviewing'
                                ? 'Interviewing'
                                : 'Rejected'
                            );
                          }}
                          className="px-2.5 py-1 bg-[#0047AB] hover:bg-[#003882] text-white rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Apply to Candidates</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                    <span className="font-bold text-slate-500 mr-1.5">Subject:</span>
                    <span className="font-semibold text-slate-800">{tpl.subject}</span>
                  </div>

                  {/* Message body */}
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans bg-white p-2.5 rounded-xl border border-slate-100">
                    {tpl.messageTemplate}
                  </p>

                  {/* Suggested tags */}
                  <div className="flex flex-wrap items-center gap-1 mt-2.5">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Tags:</span>
                    {tpl.suggestedTags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] text-slate-400 font-medium">
                      Automated in-app notification
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#0047AB]" />
            <span>Templates automatically populate candidate & job details.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
