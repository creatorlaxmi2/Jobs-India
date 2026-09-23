import React, { useState } from 'react';
import {
  TabType,
  AppMode,
  Job,
  UserProfile,
  Application,
  HRRequest,
  NotificationItem,
  JobPreference,
  EmployerProfile,
  PremiumPlan,
  PlatformSettings,
} from './types';
import {
  INITIAL_JOBS,
  INITIAL_USER_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_HR_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockJobs';
import { DEFAULT_EMPLOYER_PROFILE, getCompanyInitials } from './data/employerProfiles';
import {
  loadStoredPremiumPlans,
  saveStoredPremiumPlans,
  loadStoredPlatformSettings,
  saveStoredPlatformSettings,
} from './data/settingsData';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { AllJobsTab } from './components/AllJobsTab';
import { MyActivityTab } from './components/MyActivityTab';
import { PremiumTab } from './components/PremiumTab';
import { ProfileTab } from './components/ProfileTab';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplyModal } from './components/ApplyModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ReferModal } from './components/ReferModal';
import { SwitchModeModal } from './components/SwitchModeModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { EmployerPortal } from './components/EmployerPortal';
import { AdminPortal } from './components/AdminPortal';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activitySubView, setActivitySubView] = useState<
    'hr' | 'saved' | 'applications' | 'interviews' | 'alerts' | null
  >(null);

  // Core Data State
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('jobs_india_jobs_list');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_JOBS;
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('jobs_india_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILE;
  });
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [hrRequests, setHrRequests] = useState<HRRequest[]>(INITIAL_HR_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(['job-1', 'job-4']));
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Premium Plans & Platform Settings State (Configured by Admin)
  const [premiumPlans, setPremiumPlans] = useState<PremiumPlan[]>(() =>
    loadStoredPremiumPlans()
  );
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    loadStoredPlatformSettings()
  );

  const handleSavePremiumPlans = (updated: PremiumPlan[]) => {
    setPremiumPlans(updated);
    saveStoredPremiumPlans(updated);
  };

  const handleSavePlatformSettings = (updated: PlatformSettings) => {
    setPlatformSettings(updated);
    saveStoredPlatformSettings(updated);
  };

  // Location State (Default: Patna / Muhammadpur as requested)
  const [currentCity, setCurrentCity] = useState('Patna');
  const [currentLocality, setCurrentLocality] = useState('Muhammadpur');

  // Search & Filter state passed to All Jobs
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'high-salary' | 'nearby' | 'wfh' | null>(null);

  // Job Preferences state
  const [jobPreference, setJobPreference] = useState<JobPreference>({
    preferredRoles: userProfile.preferredRoles,
    preferredLocations: userProfile.preferredLocations,
    expectedSalary: userProfile.expectedSalary,
    experience: userProfile.experience,
    workMode: userProfile.workPreference,
    isConfigured: true,
  });

  // Modals
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);

  // App Mode & Auth State (Job Seeker / Employer / Admin)
  const [currentMode, setCurrentMode] = useState<AppMode>('job-seeker');
  const [isSwitchModeOpen, setIsSwitchModeOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');
  const [authInitialAccountType, setAuthInitialAccountType] = useState<'job-seeker' | 'employer' | 'admin'>('job-seeker');
  const [modeToast, setModeToast] = useState<string | null>(null);

  // Admin Panel Login Password & Security State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('jobs_india_admin_password') || 'admin@123';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('jobs_india_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminAuthInitialView, setAdminAuthInitialView] = useState<'login' | 'reset'>('login');

  // User Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('jobs_india_logged_in') === 'true';
  });

  // Employer / HR Profile State (Synchronized with localStorage & HR Login)
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(() => {
    try {
      const saved = localStorage.getItem('jobs_india_employer_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore parsing error
    }
    return DEFAULT_EMPLOYER_PROFILE;
  });

  const handleUpdateEmployerProfile = (updated: EmployerProfile) => {
    setEmployerProfile(updated);
    try {
      localStorage.setItem('jobs_india_employer_profile', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleSelectMode = (mode: AppMode) => {
    // Require password authentication for Admin Panel
    if (mode === 'admin' && !isAdminAuthenticated) {
      setAdminAuthInitialView('login');
      setIsAdminAuthModalOpen(true);
      return;
    }

    setCurrentMode(mode);
    const label =
      mode === 'employer'
        ? 'Switched to Employer / HR Mode'
        : mode === 'admin'
        ? 'Switched to Admin Moderation Panel'
        : 'Switched to Job Seeker Mode';
    setModeToast(label);
    setTimeout(() => setModeToast(null), 3000);
  };

  const handleOpenAdminAuth = (initialView: 'login' | 'reset' = 'login') => {
    setAdminAuthInitialView(initialView);
    setIsAdminAuthModalOpen(true);
  };

  const handleAdminLoginSuccess = (email?: string) => {
    const adminEmail = email || localStorage.getItem('jobs_india_admin_email') || 'rajashok926@gmail.com';
    setIsAdminAuthenticated(true);
    setIsLoggedIn(true);
    localStorage.setItem('jobs_india_admin_auth', 'true');
    localStorage.setItem('jobs_india_admin_email', adminEmail);
    localStorage.setItem('jobs_india_logged_in', 'true');
    localStorage.setItem('jobs_india_logged_mode', 'admin');
    localStorage.setItem('jobs_india_logged_user', adminEmail);
    setCurrentMode('admin');
    setModeToast(`Super Admin Authenticated (${adminEmail}) • Welcome to Access Panel`);
    setTimeout(() => setModeToast(null), 3500);
  };

  const handleLockAdminSession = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('jobs_india_admin_auth');
    setCurrentMode('job-seeker');
    setModeToast('Admin Session Locked • Switched to Job Seeker Mode');
    setTimeout(() => setModeToast(null), 3500);
  };

  const handleUpdateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem('jobs_india_admin_password', newPassword);
    setModeToast('Admin Password Successfully Updated & Saved!');
    setTimeout(() => setModeToast(null), 3500);
  };

  const handleOpenAuth = (
    tab: 'login' | 'signup',
    initialAccountType: 'job-seeker' | 'employer' | 'admin' = 'job-seeker'
  ) => {
    setAuthInitialTab(tab);
    setAuthInitialAccountType(initialAccountType);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (
    mode: AppMode,
    userName: string,
    details?: {
      email?: string;
      phone?: string;
      companyName?: string;
      designation?: string;
      city?: string;
      isNewSignUp?: boolean;
    }
  ) => {
    setIsLoggedIn(true);
    localStorage.setItem('jobs_india_logged_in', 'true');
    localStorage.setItem('jobs_india_logged_user', userName);
    localStorage.setItem('jobs_india_logged_mode', mode);

    if (mode === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('jobs_india_admin_auth', 'true');
    }

    if (mode === 'employer') {
      const emailKey = (details?.email || userName).toLowerCase().trim();
      if (details?.isNewSignUp) {
        // Clear old job postings for this newly signed-up employer to start fresh
        try {
          localStorage.setItem(`jobs_india_employer_jobs_${emailKey}`, JSON.stringify([]));
        } catch (e) {
          // ignore
        }
      }

      setEmployerProfile((prev) => {
        const company = details?.companyName || prev.companyName;
        const cityName = details?.city ? details.city.split(',')[0].trim() : prev.city;
        const updated: EmployerProfile = {
          ...prev,
          companyName: company,
          companyInitials: getCompanyInitials(company),
          hrName: userName,
          workEmail: details?.email || prev.workEmail,
          phone: details?.phone || prev.phone,
          city: cityName,
          hubName: `${cityName} Hub`,
          designation: details?.designation || prev.designation || 'Verified HR',
        };
        try {
          localStorage.setItem('jobs_india_employer_profile', JSON.stringify(updated));
        } catch (e) {
          // ignore
        }
        return updated;
      });
    }

    setCurrentMode(mode);
    setUserProfile((prev) => ({
      ...prev,
      name: userName,
      email: details?.email || prev.email,
      phone: details?.phone || prev.phone,
      city: details?.city ? details.city.split(',')[0].trim() : prev.city,
    }));
    const label = `Logged in as ${userName} (${
      mode === 'employer' ? 'Employer / HR' : mode === 'admin' ? 'Admin' : 'Job Seeker'
    })`;
    setModeToast(label);
    setTimeout(() => setModeToast(null), 3500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('jobs_india_logged_in');
    localStorage.removeItem('jobs_india_logged_user');
    localStorage.removeItem('jobs_india_logged_mode');
    localStorage.removeItem('jobs_india_admin_auth');
    localStorage.removeItem('jobs_india_user_profile');
    setUserProfile(INITIAL_USER_PROFILE);
    setCurrentMode('job-seeker');
    setModeToast('Logged out successfully • Profile refreshed');
    setTimeout(() => setModeToast(null), 3000);
  };

  const handleRefreshProfile = () => {
    try {
      const saved = localStorage.getItem('jobs_india_user_profile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      } else {
        setUserProfile(INITIAL_USER_PROFILE);
      }
    } catch {
      setUserProfile(INITIAL_USER_PROFILE);
    }
    setModeToast('Job Seeker Profile refreshed');
    setTimeout(() => setModeToast(null), 2500);
  };

  const handleVerifyJob = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          aboutCompany: { ...j.aboutCompany, verified: true },
          recruiterContact: j.recruiterContact
            ? {
                ...j.recruiterContact,
                isVerified: true,
                verifiedAt: 'Verified by Admin Just Now',
              }
            : undefined,
        };
      });
      try {
        localStorage.setItem('jobs_india_jobs_list', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRemoveJob = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.filter((j) => j.id !== jobId);
      try {
        localStorage.setItem('jobs_india_jobs_list', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleCleanDummyJobs = () => {
    setJobs((prev) => {
      const sampleIds = new Set(INITIAL_JOBS.map((j) => j.id));
      const cleaned = prev.filter((j) => !sampleIds.has(j.id) && !j.id.startsWith('sample-'));
      try {
        localStorage.setItem('jobs_india_jobs_list', JSON.stringify(cleaned));
      } catch {
        // ignore
      }
      return cleaned;
    });
  };

  const handleClearAllJobs = () => {
    setJobs([]);
    try {
      localStorage.setItem('jobs_india_jobs_list', JSON.stringify([]));
    } catch {
      // ignore
    }
  };

  const handleRestoreSampleJobs = () => {
    setJobs(INITIAL_JOBS);
    try {
      localStorage.setItem('jobs_india_jobs_list', JSON.stringify(INITIAL_JOBS));
    } catch {
      // ignore
    }
  };

  const handleUpdateApplicationStatus = (
    appId: string,
    status: any,
    notificationData?: { title: string; message: string }
  ) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== appId) return a;
        const newTimeline = [...a.statusTimeline];
        if (notificationData) {
          const stageName =
            status === 'Shortlisted'
              ? 'Shortlisted by HR'
              : status === 'Rejected'
              ? 'Application Closed'
              : status === 'Interview' || status === 'Interviewing'
              ? 'Interview Scheduled'
              : 'Status Updated';
          newTimeline.push({
            stage: stageName,
            date: 'Today',
            note: notificationData.message,
            completed: true,
            current: true,
          });
        }
        return { ...a, status, statusTimeline: newTimeline };
      })
    );

    if (notificationData) {
      const app = applications.find((a) => a.id === appId);
      const newNotif: NotificationItem = {
        id: `notif-app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type:
          status === 'Shortlisted' || status === 'Interview' || status === 'Interviewing'
            ? 'interview'
            : 'application',
        title: notificationData.title,
        message: notificationData.message,
        timestamp: 'Just now',
        read: false,
        jobId: app?.jobId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleBulkUpdateApplicationStatus = (
    appIds: string[],
    status: any,
    notificationData?: { title: string; message: string }
  ) => {
    const idSet = new Set(appIds);
    setApplications((prev) =>
      prev.map((a) => {
        if (!idSet.has(a.id)) return a;
        const newTimeline = [...a.statusTimeline];
        if (notificationData) {
          const stageName =
            status === 'Shortlisted'
              ? 'Shortlisted by HR'
              : status === 'Rejected'
              ? 'Application Closed'
              : status === 'Interview' || status === 'Interviewing'
              ? 'Interview Scheduled'
              : 'Status Updated';
          newTimeline.push({
            stage: stageName,
            date: 'Today',
            note: notificationData.message,
            completed: true,
            current: true,
          });
        }
        return { ...a, status, statusTimeline: newTimeline };
      })
    );

    if (notificationData) {
      const targetApps = applications.filter((a) => idSet.has(a.id));
      const newNotifs: NotificationItem[] = targetApps.map((app, idx) => ({
        id: `notif-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        type:
          status === 'Shortlisted' || status === 'Interview' || status === 'Interviewing'
            ? 'interview'
            : 'application',
        title: notificationData.title,
        message: notificationData.message
          .replace(/{CandidateName}/g, app.candidateName || 'Candidate')
          .replace(/{JobTitle}/g, app.jobTitle)
          .replace(/{Company}/g, app.company),
        timestamp: 'Just now',
        read: false,
        jobId: app.jobId,
      }));
      setNotifications((prev) => [...newNotifs, ...prev]);
    }
  };

  // Toggle Save Job
  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  // Quick Filter Action from Home Screen
  const handleApplyQuickFilter = (filterKey: 'high-salary' | 'nearby' | 'wfh') => {
    setActiveQuickFilter(filterKey);
    setActiveTab('all-jobs');
  };

  // Search from Home Screen
  const handleSearchSubmit = (query: string) => {
    setActiveTab('all-jobs');
  };

  // Application Submission Handler
  const handleSubmitApplication = (
    job: Job,
    screeningData: { noticePeriod: string; customResumeName?: string }
  ) => {
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.locality || job.location,
      salary: job.salary,
      appliedDate: 'Just now',
      status: 'Applied',
      statusTimeline: [
        {
          stage: 'Applied',
          date: 'Just now',
          note: `Resume (${screeningData.customResumeName || userProfile.resumeName}) submitted to HR`,
          completed: true,
          current: true,
        },
        {
          stage: 'Viewed',
          date: 'Pending',
          note: 'HR will review your profile shortly',
          completed: false,
        },
        {
          stage: 'Shortlisted',
          date: 'Pending',
          note: 'Verification and screening call',
          completed: false,
        },
      ],
      hrContact: {
        name: 'Talent Acquisition Team',
        designation: 'Hiring Specialist',
        phone: '+91 80029 11090',
      },
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'application',
      title: `Application Sent to ${job.company}! 📄`,
      message: `Your application for ${job.title} was submitted. HR has received your profile.`,
      timestamp: 'Just now',
      read: false,
      jobId: job.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle HR Request Accept/Decline
  const handleAcceptHRRequest = (requestId: string) => {
    setHrRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Accepted' } : r))
    );
  };

  const handleDeclineHRRequest = (requestId: string) => {
    setHrRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' } : r))
    );
  };

  // Share Job via WhatsApp
  const handleShareJob = (job: Job) => {
    const text = `Check out this opening for ${job.title} at ${job.company} (${job.salary}) in ${job.location} on Jobs India: https://jobsindia.app/jobs/${job.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Select notification action
  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.jobId) {
      const match = jobs.find((j) => j.id === notif.jobId);
      if (match) {
        setSelectedJobForDetails(match);
      }
    } else if (notif.type === 'hr') {
      setActiveTab('activity');
      setActivitySubView('hr');
    } else if (notif.type === 'profile') {
      setActiveTab('profile');
    }
    setIsNotificationsOpen(false);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const pendingHRCount = hrRequests.filter((r) => r.status === 'Pending').length;
  const savedJobsList = jobs.filter((j) => savedJobIds.has(j.id));

  return (
    <AndroidFrame>
      {/* Toast Alert for mode switch */}
      {modeToast && (
        <div
          id="mode-toast-notification"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#1E2544] text-white px-4 py-2 rounded-full shadow-xl border border-white/20 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{modeToast}</span>
        </div>
      )}

      {/* Render Mode Views */}
      {currentMode === 'employer' ? (
        <EmployerPortal
          jobs={jobs}
          onAddJob={(newJob) =>
            setJobs((prev) => {
              const updated = [newJob, ...prev];
              try {
                localStorage.setItem('jobs_india_jobs_list', JSON.stringify(updated));
              } catch {
                // ignore
              }
              return updated;
            })
          }
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onBulkUpdateApplicationStatus={handleBulkUpdateApplicationStatus}
          onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
          employerProfile={employerProfile}
          onUpdateEmployerProfile={handleUpdateEmployerProfile}
          onOpenAuth={handleOpenAuth}
          plans={premiumPlans}
          settings={platformSettings}
        />
      ) : currentMode === 'admin' ? (
        <AdminPortal
          jobs={jobs}
          onVerifyJob={handleVerifyJob}
          onRemoveJob={handleRemoveJob}
          onCleanDummyJobs={handleCleanDummyJobs}
          onClearAllJobs={handleClearAllJobs}
          onRestoreSampleJobs={handleRestoreSampleJobs}
          onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
          onOpenAdminSecurity={handleOpenAdminAuth}
          onLockAdminSession={handleLockAdminSession}
          plans={premiumPlans}
          settings={platformSettings}
          onSavePlans={handleSavePremiumPlans}
          onSaveSettings={handleSavePlatformSettings}
          applications={applications}
          userProfile={userProfile}
          employerProfile={employerProfile}
        />
      ) : (
        <>
          {/* Top Header (Patna/Muhammadpur, Switch Mode Button, WhatsApp Refer, Heart, Bell) */}
          <Header
            currentCity={currentCity}
            currentLocality={currentLocality}
            onSelectLocation={(city, locality) => {
              setCurrentCity(city);
              setCurrentLocality(locality);
              setUserProfile((prev) => ({
                ...prev,
                city,
                locality,
              }));
              setJobPreference((prev) => ({
                ...prev,
                preferredLocations: [locality, city],
              }));
            }}
            savedJobsCount={savedJobIds.size}
            unreadNotificationsCount={unreadNotifsCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSavedJobs={() => {
              setActiveTab('activity');
              setActivitySubView('saved');
            }}
            onOpenReferModal={() => setIsReferOpen(true)}
            currentMode={currentMode}
            onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
            isLoggedIn={isLoggedIn}
            userName={userProfile.name}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />

          {/* Admin Platform Announcement Banner if Enabled */}
          {platformSettings.showAnnouncement && platformSettings.bannerAnnouncement && (
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 text-white text-[11px] font-bold px-3 py-1.5 flex items-center justify-center gap-2 shadow-xs select-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-pulse" />
              <span className="truncate">{platformSettings.bannerAnnouncement}</span>
            </div>
          )}

          {/* Main Tab Views */}
          <main className="min-h-[calc(100vh-120px)]">
            {activeTab === 'home' && (
              <HomeTab
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSave}
                onApplyJob={(job) => setSelectedJobForApply(job)}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setActivitySubView(null);
                }}
                onApplyQuickFilter={handleApplyQuickFilter}
                searchQuery={homeSearchQuery}
                onSearchChange={setHomeSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                onOpenProfile={() => setActiveTab('profile')}
                isLoggedIn={isLoggedIn}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {activeTab === 'all-jobs' && (
              <AllJobsTab
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSave}
                onApplyJob={(job) => setSelectedJobForApply(job)}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                currentCity={currentCity}
                currentLocality={currentLocality}
                initialFilter={activeQuickFilter}
              />
            )}

            {activeTab === 'activity' && (
              <MyActivityTab
                applications={applications}
                hrRequests={hrRequests}
                savedJobs={savedJobsList}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSave}
                onApplyJob={(job) => setSelectedJobForApply(job)}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                jobPreference={jobPreference}
                onUpdateJobPreference={setJobPreference}
                onAcceptHRRequest={handleAcceptHRRequest}
                onDeclineHRRequest={handleDeclineHRRequest}
                initialSubView={activitySubView}
              />
            )}

            {activeTab === 'premium' && (
              <PremiumTab
                isPremiumUser={isPremiumUser}
                onUpgradePremium={() => setIsPremiumUser(true)}
                plans={premiumPlans}
                settings={platformSettings}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                profile={userProfile}
                onUpdateProfile={(updated) => {
                  setUserProfile(updated);
                  try {
                    localStorage.setItem('jobs_india_user_profile', JSON.stringify(updated));
                  } catch {
                    // ignore
                  }
                  if (updated.city && updated.locality) {
                    setCurrentCity(updated.city);
                    setCurrentLocality(updated.locality);
                  }
                }}
                onNavigateToPremium={() => setActiveTab('premium')}
                onBackToHome={() => setActiveTab('home')}
                onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
                onOpenAuth={handleOpenAuth}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onRefreshProfile={handleRefreshProfile}
              />
            )}
          </main>

          {/* Floating Switch Mode Button for Quick Access */}
          <button
            id="floating-switch-mode-btn"
            onClick={() => setIsSwitchModeOpen(true)}
            className="fixed bottom-20 right-4 z-40 bg-[#141A28] text-white px-3.5 py-2 rounded-full shadow-2xl border border-slate-700/80 hover:bg-[#1E273D] hover:scale-105 transition-all flex items-center gap-1.5 text-xs font-bold select-none cursor-pointer"
            title="Switch App Mode"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Switch Mode</span>
          </button>

          {/* Fixed 5-Tab Bottom Navigation (Home, All Jobs, My Activity, Premium, Profile) */}
          <BottomNav
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setActivitySubView(null);
            }}
            activityBadgeCount={pendingHRCount}
          />
        </>
      )}

      {/* SWITCH APP MODE MODAL (Job Seeker / Employer / Admin / Log In / Sign Up) */}
      <SwitchModeModal
        isOpen={isSwitchModeOpen}
        onClose={() => setIsSwitchModeOpen(false)}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onOpenAuth={handleOpenAuth}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminAuth={handleOpenAdminAuth}
      />

      {/* AUTH MODAL (Login / Signup for Seeker, Employer & Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
        initialAccountType={authInitialAccountType}
        adminPassword={adminPassword}
        onOpenAdminResetPassword={() => handleOpenAdminAuth('reset')}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* DEDICATED ADMIN AUTH & RESET PASSWORD MODAL */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        adminPassword={adminPassword}
        onUpdateAdminPassword={handleUpdateAdminPassword}
        onLoginSuccess={handleAdminLoginSuccess}
        initialView={adminAuthInitialView}
      />

      {/* JOB DETAILS MODAL */}
      <JobDetailsModal
        job={selectedJobForDetails}
        isOpen={Boolean(selectedJobForDetails)}
        onClose={() => setSelectedJobForDetails(null)}
        isSaved={selectedJobForDetails ? savedJobIds.has(selectedJobForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onApply={(job) => {
          setSelectedJobForDetails(null);
          setSelectedJobForApply(job);
        }}
        onShare={handleShareJob}
      />

      {/* APPLY NOW & APPLICATION FLOW MODAL */}
      <ApplyModal
        job={selectedJobForApply}
        profile={userProfile}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSubmitApplication={handleSubmitApplication}
        onViewApplications={() => {
          setActiveTab('activity');
          setActivitySubView('applications');
        }}
      />

      {/* NOTIFICATIONS MODAL */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* REFER VIA WHATSAPP MODAL */}
      <ReferModal
        isOpen={isReferOpen}
        onClose={() => setIsReferOpen(false)}
      />
    </AndroidFrame>
  );
}
