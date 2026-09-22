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
} from './types';
import {
  INITIAL_JOBS,
  INITIAL_USER_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_HR_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockJobs';
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
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [hrRequests, setHrRequests] = useState<HRRequest[]>(INITIAL_HR_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(['job-1', 'job-4']));
  const [isPremiumUser, setIsPremiumUser] = useState(false);

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

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('jobs_india_admin_auth', 'true');
    setCurrentMode('admin');
    setModeToast('Super Admin Authenticated • Welcome to Admin Moderation Panel');
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

  const handleOpenAuth = (tab: 'login' | 'signup') => {
    setAuthInitialTab(tab);
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
    setCurrentMode('job-seeker');
    setModeToast('Successfully logged out');
    setTimeout(() => setModeToast(null), 3000);
  };

  const handleVerifyJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
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
      })
    );
  };

  const handleRemoveJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleUpdateApplicationStatus = (appId: string, status: any) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
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
          onAddJob={(newJob) => setJobs((prev) => [newJob, ...prev])}
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
        />
      ) : currentMode === 'admin' ? (
        <AdminPortal
          jobs={jobs}
          onVerifyJob={handleVerifyJob}
          onRemoveJob={handleRemoveJob}
          onOpenSwitchMode={() => setIsSwitchModeOpen(true)}
          onOpenAdminSecurity={handleOpenAdminAuth}
          onLockAdminSession={handleLockAdminSession}
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
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                profile={userProfile}
                onUpdateProfile={(updated) => {
                  setUserProfile(updated);
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
