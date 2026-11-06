import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchFilters from './components/SearchFilters';
import JobCard from './components/JobCard';
import JobDetailModal from './components/JobDetailModal';
import ApplyModal from './components/ApplyModal';
import PostJobModal from './components/PostJobModal';
import ApplicationTracker from './components/ApplicationTracker';
import StudentProfile from './components/StudentProfile';
import RecruiterDashboard from './components/RecruiterDashboard';
import Toast from './components/Toast';

export default function App() {
  const [currentRole, setRole] = useState('student'); // 'student' | 'recruiter'
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'applications' | 'profile' | 'recruiter-jobs' | 'recruiter-applicants'

  const [jobs, setJobs] = useState([]);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]); // for recruiter
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, shortlistedCount: 0, interviewingCount: 0, companiesCount: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    q: '',
    category: 'All',
    workplaceType: 'All',
    sortBy: 'newest'
  });

  // Modals state
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch Jobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.getJobs(filters);
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  }, [filters]);

  // Fetch Student Profile
  const fetchProfile = async () => {
    try {
      const res = await api.getProfile('2024091239@gitam.edu');
      if (res.success) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      // Student applications
      const resStudent = await api.getApplications('2024091239@gitam.edu');
      if (resStudent.success) {
        setApplications(resStudent.data);
      }

      // All applications (for recruiter)
      const resAll = await api.getApplications();
      if (resAll.success) {
        setAllApplications(resAll.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Initial Load
  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchApplications(),
        fetchStats()
      ]);
      setLoading(false);
    }
    init();
  }, []);

  // Update jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handlers
  const handleApplyClick = (job) => {
    const already = applications.some(a => a.jobId === job._id);
    if (already) {
      addToast('You have already applied for this position!', 'info');
      return;
    }
    setApplyJob(job);
  };

  const handleConfirmApply = async (applicationData) => {
    try {
      const res = await api.apply(applicationData);
      if (res.success) {
        addToast('Application submitted successfully! Track your status on the dashboard.', 'success');
        setApplyJob(null);
        await Promise.all([
          fetchApplications(),
          fetchJobs(),
          fetchStats()
        ]);
        setActiveTab('applications');
      }
    } catch (err) {
      addToast(err.message || 'Error submitting application', 'error');
      throw err;
    }
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      const res = await api.withdrawApplication(appId);
      if (res.success) {
        addToast('Application withdrawn successfully', 'info');
        await Promise.all([
          fetchApplications(),
          fetchJobs(),
          fetchStats()
        ]);
      }
    } catch (err) {
      addToast(err.message || 'Error withdrawing application', 'error');
    }
  };

  const handlePostJob = async (jobData) => {
    try {
      const res = await api.createJob(jobData);
      if (res.success) {
        addToast('New opportunity published successfully! Candidates can now apply.', 'success');
        setIsPostModalOpen(false);
        await Promise.all([
          fetchJobs(),
          fetchStats()
        ]);
        setRole('recruiter');
        setActiveTab('recruiter-jobs');
      }
    } catch (err) {
      addToast(err.message || 'Failed to post job opportunity', 'error');
      throw err;
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await api.deleteJob(jobId);
      if (res.success) {
        addToast('Job opportunity deleted successfully', 'info');
        await Promise.all([
          fetchJobs(),
          fetchApplications(),
          fetchStats()
        ]);
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete job', 'error');
    }
  };

  const handleUpdateStatus = async (appId, newStatus, feedback) => {
    try {
      const res = await api.updateApplicationStatus(appId, newStatus, feedback);
      if (res.success) {
        addToast(`Candidate status updated to "${newStatus}"`, 'success');
        await Promise.all([
          fetchApplications(),
          fetchStats()
        ]);
      }
    } catch (err) {
      addToast(err.message || 'Failed to update application status', 'error');
    }
  };

  const handleSaveProfile = async (profileData) => {
    try {
      const res = await api.updateProfile(profileData);
      if (res.success) {
        setStudent(res.data);
        addToast('Student profile saved successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save profile', 'error');
      throw err;
    }
  };

  // IDs of jobs already applied by current student
  const appliedJobIds = new Set(applications.map(a => a.jobId));

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appliedCount={applications.length}
        onOpenPostJob={() => setIsPostModalOpen(true)}
      />

      {/* Main Container */}
      <main className="main-content">
        {/* STUDENT ROLE VIEWS */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'jobs' && (
              <>
                <Hero stats={stats} />
                <SearchFilters filters={filters} setFilters={setFilters} />

                {/* Job Listings Grid */}
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Available Opportunities ({jobs.length})
                  </h2>
                  <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    {filters.category !== 'All' ? `Filtered by ${filters.category}` : 'Showing all verified tech roles'}
                  </span>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 10 }}>⏳</div>
                    <div>Loading verified opportunities...</div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3 className="empty-title">No Matching Internships Found</h3>
                    <p className="empty-desc">
                      Try adjusting your keywords, category, or workplace filter to see more listings.
                    </p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setFilters({ q: '', category: 'All', workplaceType: 'All', sortBy: 'newest' })}
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="jobs-layout">
                    {jobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        hasApplied={appliedJobIds.has(job._id)}
                        onViewDetails={(j) => setDetailJob(j)}
                        onApply={(j) => handleApplyClick(j)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'applications' && (
              <ApplicationTracker
                applications={applications}
                onWithdrawApplication={handleWithdrawApplication}
                onExploreJobs={() => setActiveTab('jobs')}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfile
                student={student}
                onSaveProfile={handleSaveProfile}
              />
            )}
          </>
        )}

        {/* RECRUITER / EMPLOYER ROLE VIEWS */}
        {currentRole === 'recruiter' && (
          <RecruiterDashboard
            jobs={jobs}
            applications={allApplications}
            activeSubTab={activeTab === 'recruiter-applicants' ? 'applicants' : 'jobs'}
            onOpenPostModal={() => setIsPostModalOpen(true)}
            onDeleteJob={handleDeleteJob}
            onUpdateApplicationStatus={handleUpdateStatus}
          />
        )}
      </main>

      {/* MODALS */}
      {detailJob && (
        <JobDetailModal
          job={detailJob}
          hasApplied={appliedJobIds.has(detailJob._id)}
          onClose={() => setDetailJob(null)}
          onApply={(j) => {
            setDetailJob(null);
            handleApplyClick(j);
          }}
        />
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          student={student}
          onClose={() => setApplyJob(null)}
          onSubmitApplication={handleConfirmApply}
        />
      )}

      {isPostModalOpen && (
        <PostJobModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmitJob={handlePostJob}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>CareerConnect</strong> — Modern Internship and Job Portal
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
              Built with HTML5, CSS3, JavaScript, ReactJS, NodeJS, ExpressJS & MongoDB
            </div>
          </div>

          <div className="footer-tech-stack">
            <span className="tech-chip">React 18</span>
            <span className="tech-chip">Node.js</span>
            <span className="tech-chip">Express</span>
            <span className="tech-chip">MongoDB</span>
            <span className="tech-chip">REST APIs</span>
            <span className="tech-chip">Vercel Ready</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div>Developed by: <strong>Debatra Nayak</strong> (2024091239)</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              GITAM University • Web Application Development Capstone
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

