import React, { useState } from 'react';
import {
  TabType,
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
      {/* Top Header (Patna/Muhammadpur, WhatsApp Refer, Heart, Bell) */}
      <Header
        currentCity={currentCity}
        currentLocality={currentLocality}
        onSelectLocation={(city, locality) => {
          setCurrentCity(city);
          setCurrentLocality(locality);
        }}
        savedJobsCount={savedJobIds.size}
        unreadNotificationsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSavedJobs={() => {
          setActiveTab('activity');
          setActivitySubView('saved');
        }}
        onOpenReferModal={() => setIsReferOpen(true)}
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
            onUpdateProfile={setUserProfile}
            onNavigateToPremium={() => setActiveTab('premium')}
          />
        )}
      </main>

      {/* Fixed 5-Tab Bottom Navigation (Home, All Jobs, My Activity, Premium, Profile) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActivitySubView(null);
        }}
        activityBadgeCount={pendingHRCount}
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
