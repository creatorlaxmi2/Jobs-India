export interface SupportItem {
  id: string;
  title: string;
  iconName: string;
  category: string;
  description: string;
  points: { title: string; content: string }[];
}

export const SUPPORT_CONTENT: Record<string, SupportItem> = {
  'resume-tips': {
    id: 'resume-tips',
    title: 'Resume Tips for Indian Job Seekers',
    iconName: 'FileText',
    category: 'Tips & Guidance',
    description: 'Practical steps to craft a 1-page ATS-compliant Indian resume that gets 3x more HR calls.',
    points: [
      {
        title: '1. Keep it to 1 Page with Clear Contact Info',
        content: 'Indian HR recruiters spend less than 8 seconds per resume. Ensure your Name, Active WhatsApp Mobile Number, Email, and City (e.g., Patna, Bihar) are prominently positioned on top.'
      },
      {
        title: '2. Emphasize Quantifiable Achievements',
        content: 'Instead of saying "Handled sales", write "Closed 24+ customer consumer finance applications monthly, exceeding team quota by 18%."'
      },
      {
        title: '3. Include Key Technical & Soft Skills',
        content: 'List specific tools and certifications (e.g. Tally Prime, B.Sc Nursing, Patient Triage, MS Excel, Typing 35 WPM) matching the exact keywords from the job description.'
      },
      {
        title: '4. Format as Clean PDF',
        content: 'Avoid multi-column complicated graphics that break HR automated screening software (ATS). Use clean headers, bullet points, and high contrast.'
      }
    ]
  },
  'interview-prep': {
    id: 'interview-prep',
    title: 'Crack Your Job Interview: Complete Guide',
    iconName: 'Users',
    category: 'Interview Preparation',
    description: 'Master the most frequently asked questions and etiquette by Indian hiring managers.',
    points: [
      {
        title: '1. "Tell me about yourself" (The 90-Second Formula)',
        content: 'Cover: Past qualification/experience -> Present role or focus -> Future goal of why this specific company in Patna/India is the right next step.'
      },
      {
        title: '2. Salary Expectation Questions',
        content: 'Research market standards beforehand. For entry to mid-level roles, give a reasonable range (e.g., "As per industry standards and my clinical background, I am looking between ₹28,000 to ₹35,000 / month with PF benefits").'
      },
      {
        title: '3. Professional Grooming & Punctuality',
        content: 'Whether attending in-person (like Bailey Road/Kankarbagh hospital rounds) or via telephonic interview, dress professionally, keep documents in a neat folder, and reach 15 minutes before time.'
      },
      {
        title: '4. Questions to Ask the Recruiter',
        content: 'Always ask 1-2 thoughtful questions at the end: "What does success look like in the first 90 days?" or "What are the shift timings and weekly off policies?"'
      }
    ]
  },
  'career-tips': {
    id: 'career-tips',
    title: 'Fast-Track Career Growth & Increments',
    iconName: 'TrendingUp',
    category: 'Career Growth',
    description: 'Strategies to accelerate your career trajectory, skill up, and unlock higher salary bands.',
    points: [
      {
        title: '1. Learn Digital & Hybrid Tools',
        content: 'Whether you are in retail, logistics, administration, or nursing, digital literacy (CRM apps, electronic medical records, Excel, billing software) unlocks supervisor promotions.'
      },
      {
        title: '2. Build a Reputation for Dependability',
        content: 'Consistency in attendance, timely handovers, and positive team communication make you the first candidate considered for team lead or branch manager roles.'
      },
      {
        title: '3. Continuous Upskilling',
        content: 'Dedicate 2 hours each weekend to take free online certifications (Google, NPTEL, Skill India) that validate your specialized domain expertise.'
      }
    ]
  },
  'help-center': {
    id: 'help-center',
    title: 'Jobs India Help Center',
    iconName: 'HelpCircle',
    category: 'Support',
    description: 'Everything you need to know about applying, job safety, and verification on Jobs India.',
    points: [
      {
        title: '100% Free Job Applications - Zero Charges Guaranteed',
        content: 'Jobs India strictly forbids recruiters from asking job seekers for any registration fee, security deposit, laptop charge, or training fee. Never pay money for any job offer.'
      },
      {
        title: 'How Verified Badges Work',
        content: 'Employers with the blue checkmark badge have had their GSTIN, PAN, and corporate office address physically or digitally verified by the Jobs India trust & safety team.'
      },
      {
        title: 'Report Suspicious Recruiters',
        content: 'If an HR representative asks for banking OTPs, payment, or behaves inappropriately, tap "Report Job" or reach out to safety@jobsindia.app immediately.'
      }
    ]
  },
  'contact-support': {
    id: 'contact-support',
    title: 'Contact Jobs India Support',
    iconName: 'Headphones',
    category: 'Support',
    description: 'We are here to help you get hired. Reach our team 7 days a week.',
    points: [
      {
        title: 'Official WhatsApp Helpdesk',
        content: '+91 88002 99120 (Mon - Sat: 9:00 AM to 7:00 PM IST)'
      },
      {
        title: 'Toll-Free Candidate Helpline',
        content: '1800-JOBS-INDIA (1800-562-7463) - Toll Free across India'
      },
      {
        title: 'Support Email',
        content: 'support@jobsindia.app (Average response time: under 2 hours)'
      },
      {
        title: 'Corporate Office',
        content: 'Jobs India Tech Labs, Level 4, Tech Park, Frazer Road / Exhibition Road, Patna, Bihar 800001'
      }
    ]
  },
  'faqs': {
    id: 'faqs',
    title: 'Frequently Asked Questions (FAQs)',
    iconName: 'MessageCircleQuestion',
    category: 'FAQs',
    description: 'Quick answers to common questions about finding jobs on Jobs India.',
    points: [
      {
        title: 'Q: Is Jobs India completely free for candidates?',
        content: 'Yes! Applying for jobs, creating profiles, downloading resumes, and receiving direct HR calls is 100% free forever for all job seekers.'
      },
      {
        title: 'Q: How fast do HR recruiters call after applying?',
        content: 'Most employers respond within 24 to 48 hours. When you apply to "Urgent Hiring" jobs with a 85%+ complete profile, recruiters often call the same day.'
      },
      {
        title: 'Q: What is Jobs India Premium?',
        content: 'Premium gives your application top priority placement on the employer dashboard, provides direct recruiter contact numbers, and highlights your profile to verified HRs.'
      },
      {
        title: 'Q: Can I apply for Work-From-Home jobs from any city?',
        content: 'Yes! Our WFH jobs accept applications from across India regardless of your home city, provided you have a smartphone, internet connection, or required equipment.'
      }
    ]
  }
};
