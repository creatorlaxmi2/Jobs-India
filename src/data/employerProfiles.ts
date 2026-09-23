import { EmployerProfile } from '../types';

export const getCompanyInitials = (name: string): string => {
  if (!name || !name.trim()) return 'HR';
  const clean = name.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const calculateProfileCompletion = (profile: Partial<EmployerProfile>): number => {
  const fields: (keyof EmployerProfile)[] = [
    'companyName',
    'hubName',
    'hrName',
    'designation',
    'workEmail',
    'phone',
    'officeAddress',
    'city',
    'state',
    'cinNumber',
    'gstin',
  ];

  let filled = 0;
  for (const field of fields) {
    if (profile[field] && String(profile[field]).trim().length > 0) {
      filled += 1;
    }
  }

  return Math.round((filled / fields.length) * 100);
};

export const DEFAULT_EMPLOYER_PROFILE: EmployerProfile = {
  companyName: 'Apollo Diagnostics',
  companyInitials: 'AD',
  hubName: 'Patna Hub',
  hrName: 'Dr. Alok Verma',
  designation: 'Verified HR',
  workEmail: 'hr.alok@apollodiagnostics.in',
  phone: '+91 98350 12845',
  officeAddress: 'Muhammadpur, Patna',
  city: 'Patna',
  state: 'Bihar',
  pincode: '800006',
  cinNumber: 'CIN-U85110DL2004PLC128314',
  gstin: '10AAACA1234F1Z5',
  industry: 'Healthcare & Diagnostics',
  website: 'https://apollodiagnostics.in',
  isVerified: true,
  completionPercent: 91,
};

export const EMPLOYER_PRESET_PROFILES: {
  id: string;
  name: string;
  tag: string;
  profile: EmployerProfile;
}[] = [
  {
    id: 'apollo-diagnostics',
    name: 'Apollo Diagnostics',
    tag: 'Healthcare • Patna Hub',
    profile: {
      companyName: 'Apollo Diagnostics',
      companyInitials: 'AD',
      hubName: 'Patna Hub',
      hrName: 'Dr. Alok Verma',
      designation: 'Verified HR',
      workEmail: 'hr.alok@apollodiagnostics.in',
      phone: '+91 98350 12845',
      officeAddress: 'Plot 14, Doctors Colony, Muhammadpur',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800006',
      cinNumber: 'CIN-U85110DL2004PLC128314',
      gstin: '10AAACA1234F1Z5',
      industry: 'Healthcare & Diagnostics',
      website: 'https://apollodiagnostics.in',
      isVerified: true,
      completionPercent: 100,
    },
  },
  {
    id: 'tata-medical',
    name: 'Tata Medical Care',
    tag: 'Hospitality & Health • Bailey Rd',
    profile: {
      companyName: 'Tata Medical Care Center',
      companyInitials: 'TM',
      hubName: 'Bailey Road Hub',
      hrName: 'Pooja Verma',
      designation: 'Senior HR Manager',
      workEmail: 'pooja.verma@tatamedical.org',
      phone: '+91 98765 01234',
      officeAddress: 'Level 3, Tata Health Plaza, Bailey Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800014',
      cinNumber: 'CIN-L85110MH1995PLC089456',
      gstin: '10AABCT1234A1Z9',
      industry: 'Hospitals & Healthcare',
      website: 'https://tatamedical.org',
      isVerified: true,
      completionPercent: 100,
    },
  },
  {
    id: 'flipkart-logistics',
    name: 'Flipkart Logistics (Instakart)',
    tag: 'Supply Chain • Bihta Hub',
    profile: {
      companyName: 'Flipkart Logistics Pvt Ltd',
      companyInitials: 'FL',
      hubName: 'Bihta Mega Hub',
      hrName: 'Vikram Aditya Singh',
      designation: 'Lead Talent Acquisition',
      workEmail: 'vikram.singh@flipkart.com',
      phone: '+91 94310 88219',
      officeAddress: 'Bihta Industrial Growth Centre, Phase 2',
      city: 'Patna',
      state: 'Bihar',
      pincode: '801103',
      cinNumber: 'CIN-U74140KA2010PTC053894',
      gstin: '10AAACF1982K1Z4',
      industry: 'Logistics & Warehousing',
      website: 'https://flipkartcareers.com',
      isVerified: true,
      completionPercent: 100,
    },
  },
  {
    id: 'stark-fabrication',
    name: 'Stark Fabrications & Industrial Works',
    tag: 'Manufacturing • Delhi NCR Hub',
    profile: {
      companyName: 'Stark Fabrications & Industrial Works',
      companyInitials: 'SF',
      hubName: 'Delhi / NCR Hub',
      hrName: 'Rajesh Mehra',
      designation: 'General Manager - HR',
      workEmail: 'hr@starkindustrial.co.in',
      phone: '+91 98112 34567',
      officeAddress: 'C-48, Industrial Area, Shakurpur',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110034',
      cinNumber: 'CIN-U28920DL2008PTC176543',
      gstin: '07AABCS9876P1Z3',
      industry: 'Heavy Industry & Engineering',
      website: 'https://starkindustrial.co.in',
      isVerified: true,
      completionPercent: 100,
    },
  },
  {
    id: 'reliance-retail',
    name: 'Reliance Retail Ventures',
    tag: 'Retail & FMCG • Boring Road Hub',
    profile: {
      companyName: 'Reliance Retail Ventures',
      companyInitials: 'RR',
      hubName: 'Boring Road Hub',
      hrName: 'Anjali Srivastava',
      designation: 'Regional HR Lead',
      workEmail: 'anjali.s@relianceretail.com',
      phone: '+91 99340 76543',
      officeAddress: 'Smart Point Commercial Complex, Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
      cinNumber: 'CIN-U01100MH1999PLC120563',
      gstin: '10AABCR9912Q1Z1',
      industry: 'Retail & Consumer Goods',
      website: 'https://relianceretail.com',
      isVerified: true,
      completionPercent: 100,
    },
  },
];
