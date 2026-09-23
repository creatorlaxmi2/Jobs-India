import React, { useState } from 'react';
import {
  Headphones,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Plus,
  Check,
  X,
  Building2,
  User,
  Phone,
  Mail,
  Sparkles,
  MapPin,
  Briefcase,
} from 'lucide-react';

interface PostJobWizardProps {
  onClose: () => void;
  onSubmit: (jobData: any) => void;
  onOpenSupport: () => void;
  initialRole?: string;
  initialCity?: string;
  initialLocality?: string;
}

export const PostJobWizard: React.FC<PostJobWizardProps> = ({
  onClose,
  onSubmit,
  onOpenSupport,
  initialRole = 'Iron Man',
  initialCity = 'Delhi / NCR',
  initialLocality = 'Shakurpur',
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // ==========================================
  // STEP 1 STATE: Job Details
  // ==========================================
  const [jobTitle, setJobTitle] = useState(initialRole);
  const [jobRoleArea, setJobRoleArea] = useState('Housekeeping & Laundry');
  const [city, setCity] = useState(initialCity);
  const [locality, setLocality] = useState(initialLocality);
  const [minSalary, setMinSalary] = useState('10,000');
  const [maxSalary, setMaxSalary] = useState('10,000');
  const [offerBonus, setOfferBonus] = useState<'Yes' | 'No'>('No');

  // ==========================================
  // STEP 2 STATE: Job Descriptions
  // ==========================================
  const [englishLevel, setEnglishLevel] = useState<
    'Does not speak english' | 'Speaks thoda english' | 'Speaks good english' | 'Speaks fluent english'
  >('Does not speak english');

  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Cleaning and Housekeeping',
    'Housekeeping',
  ]);

  const suggestedSkillsList = [
    'Good Communication Skills',
    'Cleaning and Housekeeping',
    'Cooking',
    'Cleaning',
    'Washing',
    'Bathroom Cleaning',
    'Housekeeping',
    'Dusting',
    'Laundry',
    'Hotel Housekeeping',
    'Housekeeping Management',
    'Room Service',
    'House Keeping',
  ];

  const [candidateExperience, setCandidateExperience] = useState<
    'Any' | 'Freshers Only' | 'Experienced Only'
  >('Any');
  const [minExp, setMinExp] = useState('Fresher');
  const [maxExp, setMaxExp] = useState('Select Max');

  const [qualification, setQualification] = useState<
    '<10th pass' | '10th pass or above' | '12th pass or above' | 'Graduate / Post Graduate'
  >('<10th pass');

  const [gender, setGender] = useState<'Male' | 'Female' | 'Both'>('Male');

  const [callRadius, setCallRadius] = useState<'Nearby areas(up to 10 km)' | 'Anywhere in Delhi'>(
    'Anywhere in Delhi'
  );

  const [acceptOutsideCity, setAcceptOutsideCity] = useState<'Yes' | 'No'>('No');

  // ==========================================
  // STEP 3 STATE: Company Details
  // ==========================================
  const [companyName, setCompanyName] = useState('Stark Fabrications & Industrial Works');
  const [hrName, setHrName] = useState('Tony Stark');
  const [hrPhone, setHrPhone] = useState('+91 98712 34567');
  const [hrEmail, setHrEmail] = useState('recruiter.iron@jobsindia.in');
  const [vacancies, setVacancies] = useState('4');
  const [workShift, setWorkShift] = useState('Day Shift (9:00 AM - 6:00 PM)');

  // Toggle skills
  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillSearchQuery.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(skillSearchQuery.trim())) {
        setSelectedSkills([...selectedSkills, skillSearchQuery.trim()]);
      }
      setSkillSearchQuery('');
    }
  };

  // Handle final submit
  const handleFinalSubmit = () => {
    const newJob = {
      id: `job-emp-${Date.now()}`,
      title: jobTitle.trim() || 'Iron Man',
      roleArea: jobRoleArea,
      city,
      locality,
      location: `${locality}, ${city}`,
      salary: `₹${minSalary} - ₹${maxSalary} / mo`,
      minSalary: parseInt(minSalary.replace(/[^0-9]/g, '')) || 10000,
      maxSalary: parseInt(maxSalary.replace(/[^0-9]/g, '')) || 10000,
      offerBonus,
      englishLevel,
      skills: selectedSkills,
      experience: candidateExperience === 'Any' ? 'Fresher & Experienced' : candidateExperience,
      minExp,
      maxExp,
      qualification,
      gender,
      callRadius,
      acceptOutsideCity,
      company: companyName,
      hrName,
      hrPhone,
      hrEmail,
      vacancies: parseInt(vacancies) || 1,
      workShift,
      status: 'Active',
      postedDate: '22nd September 26',
      responsesCount: 0,
      hotLeadsCount: 5,
      databaseLeadsCount: 69680,
      isActive: true,
    };

    onSubmit(newJob);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto animate-in fade-in select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR (Step indicator, POST JOB, and Call Customer Support) */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs text-slate-500 font-bold block leading-none">
                {currentStep}/3
              </span>
              <h1 className="text-base sm:text-lg font-extrabold text-[#003882] tracking-wide mt-0.5">
                POST JOB
              </h1>
            </div>
          </div>

          <button
            onClick={onOpenSupport}
            className="border border-slate-300 rounded-md px-3 py-1.5 bg-white hover:bg-slate-50 active:scale-95 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <div className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-slate-600">
              <Headphones className="w-2.5 h-2.5" />
            </div>
            <span>Call Customer support</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. STEPPER BREADCRUMB TABS (Job Details > Job Descriptions > Company Details) */}
        {/* ========================================================================= */}
        <div className="max-w-xl mx-auto mt-3 grid grid-cols-3 text-center border-t border-slate-200">
          {/* Tab 1: Job Details */}
          <div
            onClick={() => setCurrentStep(1)}
            className={`cursor-pointer py-2.5 px-2 text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
              currentStep === 1
                ? 'bg-[#E8EFFE] text-[#003882]'
                : currentStep > 1
                ? 'bg-white text-slate-700 hover:bg-slate-50'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="leading-tight">Job</span>
            <span className="leading-tight">Details</span>
            {currentStep === 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 w-0 h-0 border-y-[18px] border-y-transparent border-l-[10px] border-l-[#E8EFFE] pointer-events-none hidden sm:block" />
            )}
          </div>

          {/* Tab 2: Job Descriptions */}
          <div
            onClick={() => setCurrentStep(2)}
            className={`cursor-pointer py-2.5 px-2 text-xs font-bold transition-all relative flex flex-col items-center justify-center border-x border-slate-200 ${
              currentStep === 2
                ? 'bg-[#E8EFFE] text-[#003882]'
                : currentStep > 2
                ? 'bg-white text-slate-700 hover:bg-slate-50'
                : 'bg-white text-slate-400'
            }`}
          >
            <span className="leading-tight">Job</span>
            <span className="leading-tight">Descriptions</span>
            {currentStep === 2 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 w-0 h-0 border-y-[18px] border-y-transparent border-l-[10px] border-l-[#E8EFFE] pointer-events-none hidden sm:block" />
            )}
          </div>

          {/* Tab 3: Company Details */}
          <div
            onClick={() => setCurrentStep(3)}
            className={`cursor-pointer py-2.5 px-2 text-xs font-bold transition-all flex flex-col items-center justify-center ${
              currentStep === 3
                ? 'bg-[#E8EFFE] text-[#003882]'
                : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            <span className="leading-tight">Company</span>
            <span className="leading-tight">Details</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STEP CONTENT BODY */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 pb-28">
        {/* ======================================================================= */}
        {/* STEP 1: JOB DETAILS */}
        {/* ======================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Field 1: I Want To Hire A */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                I Want To Hire A
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Iron Man"
                  className="w-full px-3.5 py-3 pr-10 rounded-xl border-2 border-emerald-600 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>
              </div>
            </div>

            {/* Field 2: Job Role / Area of Work (?) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700">
                <span>Job Role / Area of Work</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <div className="bg-[#E2E8F0]/60 border border-slate-300 rounded-xl px-3.5 py-3 text-slate-700 text-sm font-medium flex items-center justify-between">
                <span>{jobRoleArea}</span>
              </div>
            </div>

            {/* Field 3: In The City */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                In The City
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi / NCR"
                  className="w-full px-3.5 py-3 pr-10 rounded-xl border-2 border-emerald-600 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>
              </div>
            </div>

            {/* Field 4: For The Locality */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                For The Locality
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Shakurpur"
                  className="w-full px-3.5 py-3 pr-10 rounded-xl border-2 border-emerald-600 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                </div>
              </div>
            </div>

            {/* Field 5: I Will Pay A Monthly Salary Of */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                I Will Pay A Monthly Salary Of
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-center text-sm font-medium text-slate-700 focus:outline-hidden focus:border-[#003882]"
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">to</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-center text-sm font-medium text-slate-700 focus:outline-hidden focus:border-[#003882]"
                  />
                </div>
                <div className="text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Field 6: Bonus in addition to salary */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Do you offer bonus in addition to monthly salary?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOfferBonus('Yes')}
                  className={`px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    offerBonus === 'Yes'
                      ? 'bg-[#003882] text-white border-[#003882]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setOfferBonus('No')}
                  className={`px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                    offerBonus === 'No'
                      ? 'bg-[#003882] text-white border-[#003882]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: JOB DESCRIPTIONS */}
        {/* ======================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            {/* 1. English Speaking Requirement */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                English Requirement
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    'Does not speak english',
                    'Speaks thoda english',
                    'Speaks good english',
                    'Speaks fluent english',
                  ] as const
                ).map((level) => {
                  const isSelected = englishLevel === level;
                  const isRelevant = level === 'Does not speak english';
                  return (
                    <div key={level} className="relative">
                      {isRelevant && (
                        <span className="absolute -top-2 left-2 z-10 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          Relevant
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setEnglishLevel(level)}
                        className={`w-full p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#003882] text-white border-[#003882] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Skills Search & Suggested Skills */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700">
                <span>Skills</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </label>

              {/* Search input */}
              <input
                type="text"
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                placeholder="Type to search for skills"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-[#003882]"
              />

              {/* Selected skills pills */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="bg-blue-50 border border-blue-200 text-[#003882] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{s}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleToggleSkill(s)}
                      />
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Skills Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-400 font-semibold block">Suggested Skills</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkillsList.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#003882] text-white border-[#003882]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{skill}</span>
                        {isSelected ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Total Experience of Candidate */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Total Experience of Candidate
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Any', 'Freshers Only', 'Experienced Only'] as const).map((exp) => {
                  const isSelected = candidateExperience === exp;
                  const isRelevant = exp === 'Any';
                  return (
                    <div key={exp} className="relative">
                      {isRelevant && (
                        <span className="absolute -top-2 left-2 z-10 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          Relevant
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCandidateExperience(exp)}
                        className={`w-full p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#003882] text-white border-[#003882] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {exp}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Purple/Blue Info Banner */}
              <div className="bg-[#5063BD] text-white p-3 rounded-xl flex items-start gap-2 text-xs font-medium">
                <Info className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <p>Both freshers and experienced candidates will be able to Call/Apply.</p>
              </div>

              {/* Min & Max Experience selectors */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Minimum Experience *
                  </label>
                  <div className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-medium">
                    {minExp}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Maximum Experience *
                  </label>
                  <select
                    value={maxExp}
                    onChange={(e) => setMaxExp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#003882]"
                  >
                    <option value="Select Max">Select Max</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Candidate's Minimum Qualification */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Candidate's Minimum Qualification Should Be
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    '<10th pass',
                    '10th pass or above',
                    '12th pass or above',
                    'Graduate / Post Graduate',
                  ] as const
                ).map((q) => {
                  const isSelected = qualification === q;
                  const isRelevant = q === '<10th pass';
                  return (
                    <div key={q} className="relative">
                      {isRelevant && (
                        <span className="absolute -top-2 left-2 z-10 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          Relevant
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setQualification(q)}
                        className={`w-full p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#003882] text-white border-[#003882] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {q}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Gender Of The Staff Should Be */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Gender Of The Staff Should Be
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Male', 'Female', 'Both'] as const).map((g) => {
                  const isSelected = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`p-2.5 rounded-full border text-xs sm:text-sm font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-[#003882] text-white border-[#003882] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. I want calls from candidates within * */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                I want calls from candidates within *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Nearby areas(up to 10 km)', 'Anywhere in Delhi'] as const).map((rad) => {
                  const isSelected = callRadius === rad;
                  const isRelevant = rad === 'Anywhere in Delhi';
                  return (
                    <div key={rad} className="relative">
                      {isRelevant && (
                        <span className="absolute -top-2 left-2 z-10 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          Relevant
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCallRadius(rad)}
                        className={`w-full p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? 'bg-[#003882] text-white border-[#003882] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {rad}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. Do you accept candidates from outside the City? * */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Do you accept candidates from outside the City? *
              </label>
              <div className="flex items-center gap-3">
                {(['Yes', 'No'] as const).map((opt) => {
                  const isSelected = acceptOutsideCity === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAcceptOutsideCity(opt)}
                      className={`px-6 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#003882] text-white border-[#003882]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Purple/Blue Info Banner */}
              <div className="bg-[#5063BD] text-white p-3 rounded-xl flex items-start gap-2 text-xs font-medium">
                <Info className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <p>
                  "Yes" increases your chance of a better candidate. Candidates willing to relocate can apply on your job.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: COMPANY DETAILS */}
        {/* ======================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-[#003882] space-y-0.5">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#003882]" />
                Final Step: Review & Post Listing
              </p>
              <p className="text-slate-600">
                These credentials will appear on candidate applications and the verified Jobs India employer trust network.
              </p>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Company / Business Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stark Fabrications"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-[#003882]"
              />
            </div>

            {/* HR Recruiter Name */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Contact Person / HR Recruiter Name *
              </label>
              <input
                type="text"
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
                placeholder="e.g. Tony Stark"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-[#003882]"
              />
            </div>

            {/* Contact Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Mobile Number (for Call/WhatsApp) *
                </label>
                <input
                  type="text"
                  value={hrPhone}
                  onChange={(e) => setHrPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-[#003882]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Official Work Email ID
                </label>
                <input
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-[#003882]"
                />
              </div>
            </div>

            {/* Vacancies & Shift */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Total Vacancies
                </label>
                <select
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-xs sm:text-sm text-slate-700 font-medium focus:outline-hidden focus:border-[#003882]"
                >
                  <option value="1">1 Opening</option>
                  <option value="2">2 Openings</option>
                  <option value="4">4 Openings</option>
                  <option value="10">10+ Openings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Job Shift Timings
                </label>
                <input
                  type="text"
                  value={workShift}
                  onChange={(e) => setWorkShift(e.target.value)}
                  placeholder="e.g. Day Shift (9 AM - 6 PM)"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-[#003882]"
                />
              </div>
            </div>

            {/* Summary preview card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700 mt-2">
              <h4 className="font-bold text-slate-900 text-sm">{jobTitle}</h4>
              <p className="text-slate-500">{city} • {locality} • ₹{minSalary} - ₹{maxSalary} / mo</p>
              <p className="text-[11px] text-slate-600">
                Skills: {selectedSkills.slice(0, 4).join(', ')} • {candidateExperience} • {gender} Staff
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM NAVIGATION BAR (Circular Previous & Next/Submit Buttons) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-6 py-3.5 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Back button (disabled on step 1) */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="w-12 h-12 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 shadow-2xs transition-all active:scale-95"
              title="Previous Step"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-12 h-12" />
          )}

          {/* Next / Submit button */}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="w-12 h-12 rounded-full bg-[#003882] hover:bg-blue-900 active:scale-95 text-white flex items-center justify-center shadow-md transition-all ml-auto"
              title="Next Step"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-3 rounded-full bg-[#003882] hover:bg-blue-900 active:scale-95 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all ml-auto"
            >
              <span>Post Job Now</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
