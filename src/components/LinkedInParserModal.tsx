import React, { useState, useRef } from 'react';
import {
  X,
  Link as LinkIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Wrench,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  Info,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { UserProfile, UserExperienceItem } from '../types';
import {
  LinkedInParsedData,
  LINKEDIN_DEMO_PRESETS,
  parseLinkedInProfileUrl,
  parseLinkedInText,
} from '../services/linkedInParser';

interface LinkedInParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onImportComplete: (updatedProfile: UserProfile) => void;
}

export const LinkedInParserModal: React.FC<LinkedInParserModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onImportComplete,
}) => {
  // Modal Stages: 'input' | 'parsing' | 'review' | 'success'
  const [stage, setStage] = useState<'input' | 'parsing' | 'review' | 'success'>('input');
  const [activeTab, setActiveTab] = useState<'url' | 'pdf' | 'presets'>('url');

  // Input states
  const [profileUrl, setProfileUrl] = useState('https://www.linkedin.com/in/laxmi-kumari-nurse-patna');
  const [rawText, setRawText] = useState('');
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingStepText, setParsingStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parsed data & selection states
  const [parsedData, setParsedData] = useState<LinkedInParsedData | null>(null);
  const [selectedExpIndices, setSelectedExpIndices] = useState<Set<number>>(new Set());
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [importSummary, setImportSummary] = useState(true);
  const [importEducation, setImportEducation] = useState(true);
  const [mergeSkills, setMergeSkills] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handles executing the animated parsing step sequence
  const executeParsingSimulation = (data: LinkedInParsedData) => {
    setStage('parsing');
    setErrorMessage(null);
    setParsingProgress(15);
    setParsingStepText('Connecting to LinkedIn data stream...');

    setTimeout(() => {
      setParsingProgress(45);
      setParsingStepText('Extracting verified career history & job positions...');
    }, 300);

    setTimeout(() => {
      setParsingProgress(75);
      setParsingStepText('Analyzing core technical, clinical & domain skills...');
    }, 600);

    setTimeout(() => {
      setParsingProgress(100);
      setParsingStepText('Structuring credentials & profile details...');

      setTimeout(() => {
        setParsedData(data);
        // Default select all experiences
        setSelectedExpIndices(new Set(data.experiences.map((_, i) => i)));
        // Default select all skills
        setSelectedSkills(new Set(data.skills));
        setImportSummary(Boolean(data.aboutMe));
        setImportEducation(Boolean(data.education));
        setStage('review');
      }, 300);
    }, 900);
  };

  // URL Parsing Trigger
  const handleParseUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profileUrl.trim()) {
      setErrorMessage('Please enter a valid LinkedIn profile URL or username');
      return;
    }

    try {
      setStage('parsing');
      const data = await parseLinkedInProfileUrl(profileUrl);
      executeParsingSimulation(data);
    } catch {
      setStage('input');
      setErrorMessage('Could not parse this LinkedIn profile. Try a sample profile or paste text.');
    }
  };

  // Preset Selection Trigger
  const handleSelectPreset = (preset: typeof LINKEDIN_DEMO_PRESETS[0]) => {
    setProfileUrl(preset.data.linkedInUrl || '');
    executeParsingSimulation(preset.data);
  };

  // File Upload (PDF or TXT)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    setIsParsingPdf(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      setIsParsingPdf(false);

      if (content.length < 20) {
        // Mock fallback for binary PDFs in browser environment
        const fallback = LINKEDIN_DEMO_PRESETS[0].data;
        executeParsingSimulation({
          ...fallback,
          source: 'pdf',
        });
      } else {
        const parsed = parseLinkedInText(content, profileUrl);
        executeParsingSimulation(parsed);
      }
    };

    reader.onerror = () => {
      setIsParsingPdf(false);
      setErrorMessage('Failed to read file. Please try pasting the text instead.');
    };

    reader.readAsText(file);
  };

  // Text Paste Trigger
  const handleParseText = () => {
    if (!rawText.trim()) {
      setErrorMessage('Please paste your LinkedIn profile text or experience section.');
      return;
    }
    const parsed = parseLinkedInText(rawText, profileUrl);
    executeParsingSimulation(parsed);
  };

  // Toggle Experience Selection
  const toggleExpSelection = (index: number) => {
    setSelectedExpIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Toggle Skill Selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const selectAllSkills = () => {
    if (!parsedData) return;
    setSelectedSkills(new Set(parsedData.skills));
  };

  const deselectAllSkills = () => {
    setSelectedSkills(new Set());
  };

  // Final confirmation: apply parsed data to user profile
  const handleConfirmImport = () => {
    if (!parsedData) return;

    // Filter chosen experiences
    const chosenExperiences: UserExperienceItem[] = parsedData.experiences.filter((_, idx) =>
      selectedExpIndices.has(idx)
    );

    // Merge or replace experiences
    let finalExperiences: UserExperienceItem[] = [];
    if (chosenExperiences.length > 0) {
      // Prioritize imported experiences
      const existingExps = currentProfile.experiences || [];
      // Combine avoiding exact duplicates
      finalExperiences = [
        ...chosenExperiences,
        ...existingExps.filter(
          (ex) => !chosenExperiences.some((c) => c.companyName.toLowerCase() === ex.companyName.toLowerCase())
        ),
      ];
    } else {
      finalExperiences = currentProfile.experiences || [];
    }

    // Skills
    const chosenSkillsList = Array.from(selectedSkills);
    let finalSkills: string[] = [];
    if (mergeSkills) {
      const existingSkills = currentProfile.skills || [];
      const combined = [...existingSkills];
      for (const sk of chosenSkillsList) {
        if (!combined.some((s) => s.toLowerCase() === sk.toLowerCase())) {
          combined.push(sk);
        }
      }
      finalSkills = combined;
    } else {
      finalSkills = chosenSkillsList.length > 0 ? chosenSkillsList : currentProfile.skills;
    }

    // Calculate total experience
    const countYears = Math.max(1, finalExperiences.length);
    const totalExpString = `${countYears}+ years`;

    // Updated profile structure
    const updated: UserProfile = {
      ...currentProfile,
      // Name if candidate wishes or if current is default
      name: currentProfile.name || parsedData.name || 'Laxmi Kumari',
      aboutMe: importSummary && parsedData.aboutMe ? parsedData.aboutMe : currentProfile.aboutMe,
      experiences: finalExperiences,
      skills: finalSkills,
      totalWorkExperience: totalExpString,
      experienceLevel: finalExperiences.length > 0 ? 'experience' : currentProfile.experienceLevel,
      educationDetails:
        importEducation && parsedData.education ? parsedData.education : currentProfile.educationDetails,
      certifications: [
        ...(currentProfile.certifications || []),
        ...(parsedData.certifications || []).filter(
          (c) => !(currentProfile.certifications || []).includes(c)
        ),
      ],
      linkedInUrl: parsedData.linkedInUrl || profileUrl,
      linkedInHeadline: parsedData.headline,
      linkedInImportedAt: 'Imported Just Now',
      completionPercentage: Math.max(currentProfile.completionPercentage || 77, 95),
    };

    setStage('success');
    setTimeout(() => {
      onImportComplete(updated);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="linkedin-parser-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="linkedin-parser-modal-container"
        className="bg-white w-full sm:max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* HEADER WITH LINKEDIN BRANDING */}
        <div className="bg-[#0A66C2] text-white px-5 py-4 flex items-center justify-between relative overflow-hidden flex-shrink-0">
          {/* Subtle decorative glow */}
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66c0-.92-.74-1.66-1.66-1.66Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">Import from LinkedIn</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                  AI Parser
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Import career history, previous jobs & skills directly to your profile
              </p>
            </div>
          </div>

          <button
            id="linkedin-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer relative z-10"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
          {/* STAGE 1: INPUT MODES */}
          {stage === 'input' && (
            <div className="space-y-4">
              {/* Error notice */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Mode Selection Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'url'
                      ? 'bg-white text-[#0A66C2] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Profile URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'pdf'
                      ? 'bg-white text-[#0A66C2] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF / Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'presets'
                      ? 'bg-white text-[#0A66C2] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Sample Profiles</span>
                </button>
              </div>

              {/* TAB 1: PROFILE URL */}
              {activeTab === 'url' && (
                <div className="space-y-4">
                  <form onSubmit={handleParseUrl} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Your Public LinkedIn Profile URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <svg className="w-4 h-4 fill-gray-400" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66c0-.92-.74-1.66-1.66-1.66Z" />
                          </svg>
                        </div>
                        <input
                          id="linkedin-url-input"
                          type="url"
                          value={profileUrl}
                          onChange={(e) => setProfileUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/your-profile"
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:border-[#0A66C2] focus:outline-hidden"
                          required
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Enter your profile link. Our AI parser extracts your past employers, designations, and clinical / tech skills.
                      </p>
                    </div>

                    <button
                      id="linkedin-start-parse-btn"
                      type="submit"
                      className="w-full py-3 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Parse LinkedIn Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* 1-Click Quick Try Links */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-500 block mb-2">
                      Or test with 1-click verified sample profiles:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {LINKEDIN_DEMO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset)}
                          className="p-2.5 bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200/80 rounded-xl text-left transition-colors flex flex-col justify-between"
                        >
                          <span className="text-[11px] font-bold text-[#0A66C2] line-clamp-1">
                            {preset.title.split('&')[0]}
                          </span>
                          <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                            {preset.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PDF UPLOAD OR TEXT PASTE */}
              {activeTab === 'pdf' && (
                <div className="space-y-4">
                  {/* PDF Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-gray-300 hover:border-[#0A66C2] bg-gray-50/80 hover:bg-blue-50/30 rounded-2xl text-center cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0A66C2] flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">
                      {pdfFileName ? pdfFileName : 'Upload LinkedIn PDF Profile'}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      On LinkedIn, click “More” → “Save to PDF” on your profile, then upload it here.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Or Direct Paste */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Or Paste Profile Experience & Skills Text:
                    </label>
                    <textarea
                      rows={4}
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Paste your LinkedIn summary, experiences, and skills here..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:border-[#0A66C2] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleParseText}
                      className="w-full py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Extract Career History & Skills from Text</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFIED DEMO PRESETS */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Select a curated profile to preview how LinkedIn career history and skills seamlessly import into Jobs India:
                  </p>
                  <div className="space-y-2.5">
                    {LINKEDIN_DEMO_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className="p-3.5 bg-white border border-gray-200 hover:border-[#0A66C2] hover:shadow-md rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1E2544] group-hover:text-[#0A66C2] transition-colors">
                              {preset.title}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#0A66C2]">
                              {preset.data.experiences.length} Experiences
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-gray-600">
                            {preset.role} • {preset.data.name}
                          </p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">
                            {preset.subtitle}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#0A66C2] text-gray-500 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HOW IT HELPS BENEFIT BANNER */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 space-y-0.5 leading-snug">
                  <span className="font-bold block text-amber-900">
                    Why import your LinkedIn Profile?
                  </span>
                  <span>
                    Verified career histories and skills get <strong className="font-semibold text-amber-950">3x more interview calls</strong> from top hospitals, retailers, and tech firms in Patna & Bihar.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: PARSING PROGRESS ANIMATION */}
          {stage === 'parsing' && (
            <div className="py-12 px-4 text-center space-y-5">
              <div className="relative w-20 h-20 mx-auto">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-[#0A66C2] animate-spin" />
                {/* Center LinkedIn Logo */}
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-xs">
                  <svg className="w-8 h-8 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66Z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-[#1E2544]">
                  Analyzing LinkedIn Profile...
                </h4>
                <p className="text-xs text-gray-500 font-medium animate-pulse">
                  {parsingStepText}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0A66C2] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${parsingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* STAGE 3: REVIEW & SELECTIVE IMPORT */}
          {stage === 'review' && parsedData && (
            <div className="space-y-4">
              {/* Parsed Profile Top Banner */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0A66C2]">
                      LinkedIn Profile Found
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1E2544]">
                    {parsedData.name || currentProfile.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 line-clamp-1">
                    {parsedData.headline || 'Verified Professional'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStage('input')}
                  className="text-[11px] font-bold text-[#0A66C2] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Re-scan</span>
                </button>
              </div>

              {/* 1. CAREER HISTORY / EXPERIENCES SECTION */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#0A66C2]" />
                    <h4 className="text-xs font-bold text-[#1E2544]">
                      Career History ({parsedData.experiences.length} positions found)
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {selectedExpIndices.size} of {parsedData.experiences.length} selected
                  </span>
                </div>

                <div className="space-y-2">
                  {parsedData.experiences.map((exp, idx) => {
                    const isSelected = selectedExpIndices.has(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleExpSelection(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/40 border-[#0A66C2]/60 shadow-xs'
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 ${
                              isSelected
                                ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
                                : 'border-gray-300 bg-white text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-[#1E2544]">
                                {exp.jobTitle}
                              </h5>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {exp.startDate} - {exp.endDate || 'Present'}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#0A66C2]">
                              {exp.companyName}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                              <span>{exp.workType}</span>
                              <span>•</span>
                              <span>{exp.industry}</span>
                              {exp.currentSalary && (
                                <>
                                  <span>•</span>
                                  <span>₹{exp.currentSalary}</span>
                                </>
                              )}
                            </div>
                            {exp.description && (
                              <p className="text-[11px] text-gray-600 leading-snug pt-1 line-clamp-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. SKILLS SECTION */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#0A66C2]" />
                    <h4 className="text-xs font-bold text-[#1E2544]">
                      Extracted Skills ({parsedData.skills.length})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllSkills}
                      className="text-[11px] font-bold text-[#0A66C2] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAllSkills}
                      className="text-[11px] font-bold text-gray-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Skills badges */}
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-gray-50/70 border border-gray-200 rounded-2xl">
                  {parsedData.skills.map((skill) => {
                    const isSelected = selectedSkills.has(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A66C2] text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Merge toggle */}
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={mergeSkills}
                    onChange={(e) => setMergeSkills(e.target.checked)}
                    className="w-4 h-4 text-[#0A66C2] rounded border-gray-300 focus:ring-[#0A66C2]"
                  />
                  <span>
                    Merge with my existing skills ({currentProfile.skills?.length || 2} skills)
                  </span>
                </label>
              </div>

              {/* 3. OPTIONAL FIELDS: SUMMARY & EDUCATION */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                {parsedData.aboutMe && (
                  <label className="p-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-xl flex items-start gap-2.5 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={importSummary}
                      onChange={(e) => setImportSummary(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-[#0A66C2] rounded border-gray-300"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 block">
                        Update About Me Summary
                      </span>
                      <p className="text-gray-500 text-[11px] line-clamp-2 mt-0.5">
                        {parsedData.aboutMe}
                      </p>
                    </div>
                  </label>
                )}

                {parsedData.education && (
                  <label className="p-2.5 bg-gray-50 hover:bg-gray-100/70 border border-gray-200 rounded-xl flex items-start gap-2.5 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={importEducation}
                      onChange={(e) => setImportEducation(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-[#0A66C2] rounded border-gray-300"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 block">
                        Update Education Details
                      </span>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        {parsedData.education.degree} • {parsedData.education.collegeName} (
                        {parsedData.education.endYear})
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Impact score preview */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    Profile Completion Boost:
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 line-through">
                    {currentProfile.completionPercentage || 77}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    95% Complete
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: SUCCESS CONFIRMATION */}
          {stage === 'success' && (
            <div className="py-12 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>
              <h4 className="text-lg font-black text-[#1E2544]">
                LinkedIn Profile Successfully Imported!
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Your career history and verified skills have been applied directly to your Jobs India profile.
              </p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        {stage === 'review' && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setStage('input')}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl cursor-pointer"
            >
              Back
            </button>

            <button
              id="linkedin-confirm-import-btn"
              type="button"
              onClick={handleConfirmImport}
              className="flex-1 py-2.5 px-4 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                Import {selectedExpIndices.size} Positions & {selectedSkills.size} Skills
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
