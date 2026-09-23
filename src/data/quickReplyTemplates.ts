import { QuickReplyTemplate } from '../types';

export const QUICK_REPLY_TEMPLATES: QuickReplyTemplate[] = [
  // ================= SHORTLIST TEMPLATES =================
  {
    id: 'shortlist-congrats',
    actionType: 'Shortlisted',
    title: 'Congratulations & Next Steps',
    category: 'Next Steps',
    subject: '🎉 Congratulations! You have been shortlisted for {JobTitle}',
    messageTemplate:
      'Dear {CandidateName}, congratulations! Your application for {JobTitle} at {Company} has been shortlisted by our recruitment team. Your experience matches our immediate requirements. We will be reaching out via call or WhatsApp shortly to schedule the next steps.',
    suggestedTags: ['Standard', 'Popular', 'Next Steps'],
  },
  {
    id: 'shortlist-fast-track',
    actionType: 'Shortlisted',
    title: 'Fast-Track: HR Calling Soon',
    category: 'Fast Track',
    subject: '📞 Fast-Track Shortlist: Recruiter Calling Soon for {JobTitle}',
    messageTemplate:
      'Hi {CandidateName}, your profile has been fast-tracked for {JobTitle} at {Company}. Our Talent Acquisition Specialist will be calling your verified phone number directly today between 10:00 AM and 6:00 PM. Please keep your phone reachable.',
    suggestedTags: ['Fast Track', 'Urgent', 'Direct Call'],
  },
  {
    id: 'shortlist-docs',
    actionType: 'Shortlisted',
    title: 'Document Verification Request',
    category: 'Documentation',
    subject: '📋 Document Verification for {JobTitle} at {Company}',
    messageTemplate:
      'Hello {CandidateName}, we are pleased to inform you that you have been shortlisted for {JobTitle}. To expedite your onboarding process, please keep your government photo ID, Aadhaar card, and highest educational certificates ready for verification.',
    suggestedTags: ['Onboarding', 'KYC', 'Documents'],
  },
  {
    id: 'shortlist-assessment',
    actionType: 'Shortlisted',
    title: 'Skill Assessment Round',
    category: 'Assessment',
    subject: '📝 Skill Assessment invitation for {JobTitle} at {Company}',
    messageTemplate:
      'Dear {CandidateName}, congratulations on being shortlisted for {JobTitle} at {Company}! As part of the technical evaluation, you will receive a brief skill assessment link on your registered WhatsApp/SMS. Please complete it within 24 hours.',
    suggestedTags: ['Evaluation', 'Assessment', 'Technical'],
  },

  // ================= REJECTION TEMPLATES =================
  {
    id: 'reject-high-volume',
    actionType: 'Rejected',
    title: 'Role Filled / High Applicant Volume',
    category: 'High Volume',
    subject: 'Application Status Update: {JobTitle} at {Company}',
    messageTemplate:
      'Dear {CandidateName}, thank you for your interest in {JobTitle} at {Company}. Due to an overwhelmingly high volume of applicants, we have decided to advance other candidates whose current skillsets align more closely with our immediate requirements. We wish you every success in your job search.',
    suggestedTags: ['Standard', 'Polite', 'High Volume'],
  },
  {
    id: 'reject-talent-pool',
    actionType: 'Rejected',
    title: 'Saved in Talent Pool for Future',
    category: 'Talent Pool',
    subject: 'Profile Retained in Active Talent Pool: {Company}',
    messageTemplate:
      'Dear {CandidateName}, while we are unable to offer you the {JobTitle} position at this time, our hiring team was impressed by your background. We have saved your resume in our active talent pool and will proactively reach out as soon as matching openings arise.',
    suggestedTags: ['Talent Pool', 'Encouraging', 'Keep in Touch'],
  },
  {
    id: 'reject-location',
    actionType: 'Rejected',
    title: 'Location & Commute Requirement',
    category: 'Logistics',
    subject: 'Application Update: {JobTitle} Location Requirements',
    messageTemplate:
      'Dear {CandidateName}, thank you for applying. This specific role requires immediate on-site attendance in {Location} with mandatory morning/evening shift coverage. Because we are prioritizing candidates living within 10 km of the hub, we cannot proceed with your candidacy at this time.',
    suggestedTags: ['Location', 'On-Site', 'Commute'],
  },
  {
    id: 'reject-experience-gap',
    actionType: 'Rejected',
    title: 'Specific Experience Requirement',
    category: 'Qualifications',
    subject: 'Update regarding your application for {JobTitle}',
    messageTemplate:
      'Dear {CandidateName}, thank you for taking the time to apply for {JobTitle} at {Company}. At present, we are seeking candidates with verified prior domain experience in this specific field. We appreciate your effort and encourage you to explore other openings on Jobs India.',
    suggestedTags: ['Experience', 'Domain', 'Qualifications'],
  },

  // ================= INTERVIEW TEMPLATES =================
  {
    id: 'interview-telephonic',
    actionType: 'Interviewing',
    title: 'Telephonic Screening Round',
    category: 'Telephonic',
    subject: '🗓️ Telephonic Interview Invitation for {JobTitle}',
    messageTemplate:
      'Dear {CandidateName}, we would like to invite you for a telephonic screening interview for the {JobTitle} role at {Company}. Our HR manager will call you at the scheduled time. Please ensure your phone is reachable and you are in a quiet environment.',
    suggestedTags: ['Screening', 'Phone Round'],
  },
  {
    id: 'interview-inperson',
    actionType: 'Interviewing',
    title: 'In-Person Office Walk-In',
    category: 'In-Person',
    subject: '🏢 In-Person Interview Invitation at {Company}',
    messageTemplate:
      'Dear {CandidateName}, you are cordially invited for a face-to-face interview for {JobTitle} at our office located in {Location}. Please bring 2 passport-sized photographs, your updated resume, and valid government ID.',
    suggestedTags: ['Office', 'Face to Face', 'Walk-in'],
  },
];
