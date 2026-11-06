import React, { useState } from 'react';

const STEPS = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Decision'];

export default function ApplicationTracker({
  applications,
  onWithdrawApplication,
  onExploreJobs
}) {
  const [filter, setFilter] = useState('All');

  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied': return 'applied';
      case 'Under Review': return 'under-review';
      case 'Shortlisted': return 'shortlisted';
      case 'Interview Scheduled': return 'interview-scheduled';
      case 'Accepted': return 'accepted';
      case 'Rejected': return 'rejected';
      default: return 'applied';
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Under Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview Scheduled': return 3;
      case 'Accepted':
      case 'Rejected': return 4;
      default: return 0;
    }
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(app.status);
    if (filter === 'Accepted') return app.status === 'Accepted';
    if (filter === 'Rejected') return app.status === 'Rejected';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Application Status Tracker
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Monitor your hiring stages, interview invitations, and employer feedback in real time.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Active', 'Accepted', 'Rejected'].map(statusFilter => (
            <button
              key={statusFilter}
              className={`filter-pill ${filter === statusFilter ? 'active' : ''}`}
              onClick={() => setFilter(statusFilter)}
            >
              {statusFilter} ({
                statusFilter === 'All'
                  ? applications.length
                  : statusFilter === 'Active'
                    ? applications.filter(a => ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(a.status)).length
                    : applications.filter(a => a.status === statusFilter).length
              })
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3 className="empty-title">No Applications Found</h3>
          <p className="empty-desc">
            {filter === 'All'
              ? 'You have not applied for any internships yet. Start exploring active opportunities to launch your career!'
              : `No applications found with status "${filter}".`}
          </p>
          <button className="btn btn-primary" onClick={onExploreJobs}>
            🔍 Browse Internships Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {filteredApps.map((app) => {
            const currentStepIdx = getStepIndex(app.status);
            const isAccepted = app.status === 'Accepted';
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app._id} className="job-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                      {app.jobTitle}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                      🏢 {app.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <span className={`status-badge ${getStatusClass(app.status)}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {app.status === 'Accepted' && '🎉 '}
                    {app.status === 'Shortlisted' && '⭐ '}
                    {app.status}
                  </span>
                </div>

                {/* Visual Pipeline Stepper */}
                <div className="status-stepper">
                  <div className="stepper-track">
                    <div
                      className="stepper-progress"
                      style={{
                        width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%`,
                        backgroundColor: isRejected ? '#ef4444' : isAccepted ? '#10b981' : '#4f46e5'
                      }}
                    />
                  </div>

                  {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isActive = idx === currentStepIdx;
                    const stepLabel = (idx === 4)
                      ? (isAccepted ? 'Accepted 🎉' : isRejected ? 'Rejected' : 'Final Decision')
                      : step;

                    return (
                      <div
                        key={step}
                        className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div
                          className="step-bubble"
                          style={{
                            borderColor: isActive && isRejected ? '#ef4444' : isActive && isAccepted ? '#10b981' : undefined,
                            color: isActive && isRejected ? '#ef4444' : isActive && isAccepted ? '#10b981' : undefined
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span
                          className="step-label"
                          style={{
                            color: isActive && isRejected ? '#ef4444' : isActive && isAccepted ? '#10b981' : undefined
                          }}
                        >
                          {stepLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Recruiter Feedback Notice */}
                {app.feedback && (
                  <div style={{
                    background: isAccepted ? '#f0fdf4' : isRejected ? '#fef2f2' : '#f8fafc',
                    border: `1px solid ${isAccepted ? '#bbf7d0' : isRejected ? '#fecaca' : '#e2e8f0'}`,
                    padding: '12px 16px',
                    borderRadius: 10,
                    margin: '14px 0',
                    fontSize: '0.86rem',
                    color: isAccepted ? '#166534' : isRejected ? '#991b1b' : '#334155'
                  }}>
                    <strong>💬 Recruiter Note:</strong> {app.feedback}
                  </div>
                )}

                {/* Cover note preview */}
                {app.coverLetter && (
                  <div style={{ fontSize: '0.84rem', color: '#64748b', fontStyle: 'italic', marginBottom: 14 }}>
                    "{app.coverLetter.length > 180 ? `${app.coverLetter.substring(0, 180)}...` : app.coverLetter}"
                  </div>
                )}

                {/* Card Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Application ID: <code style={{ color: '#4f46e5' }}>{app._id}</code>
                  </div>

                  {app.status !== 'Accepted' && app.status !== 'Rejected' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to withdraw your application for ${app.jobTitle} at ${app.companyName}?`)) {
                          onWithdrawApplication(app._id);
                        }
                      }}
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

