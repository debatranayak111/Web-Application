import React from 'react';

export default function Navbar({
  currentRole,
  setRole,
  activeTab,
  setActiveTab,
  appliedCount,
  onOpenPostJob
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-group" onClick={() => setActiveTab('jobs')}>
          <div className="brand-icon">CC</div>
          <div>
            <div className="brand-title">
              Career<span>Connect</span>
              <span className="brand-badge">2026</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs based on Role */}
        <nav className="nav-links">
          {currentRole === 'student' ? (
            <>
              <button
                className={`nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                <span>🔍</span> Browse Internships
              </button>
              <button
                className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <span>📋</span> Track Applications
                {appliedCount > 0 && <span className="nav-badge">{appliedCount}</span>}
              </button>
              <button
                className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span>👤</span> Student Profile
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-btn ${activeTab === 'recruiter-jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('recruiter-jobs')}
              >
                <span>🏢</span> Posted Opportunities
              </button>
              <button
                className={`nav-btn ${activeTab === 'recruiter-applicants' ? 'active' : ''}`}
                onClick={() => setActiveTab('recruiter-applicants')}
              >
                <span>👥</span> Review Candidates
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenPostJob}
                style={{ marginLeft: 6 }}
              >
                <span>➕</span> Post Internship
              </button>
            </>
          )}
        </nav>

        {/* Role Switcher */}
        <div className="nav-right">
          <div className="role-switcher">
            <button
              className={`role-tab ${currentRole === 'student' ? 'active' : ''}`}
              onClick={() => {
                setRole('student');
                if (activeTab.startsWith('recruiter')) setActiveTab('jobs');
              }}
            >
              🎓 Student
            </button>
            <button
              className={`role-tab ${currentRole === 'recruiter' ? 'active' : ''}`}
              onClick={() => {
                setRole('recruiter');
                if (!activeTab.startsWith('recruiter')) setActiveTab('recruiter-jobs');
              }}
            >
              💼 Employer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

