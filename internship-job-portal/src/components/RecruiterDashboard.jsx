import React, { useState } from 'react';

export default function RecruiterDashboard({
  jobs,
  applications,
  activeSubTab = 'jobs', // 'jobs' or 'applicants'
  onOpenPostModal,
  onDeleteJob,
  onUpdateApplicationStatus
}) {
  const [subTab, setSubTab] = useState(activeSubTab);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const filteredApplications = applications.filter(app => {
    if (selectedJobFilter === 'All') return true;
    return app.jobId === selectedJobFilter;
  });

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const feedback = feedbackInputs[appId] || '';
      await onUpdateApplicationStatus(appId, newStatus, feedback);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFeedbackChange = (appId, text) => {
    setFeedbackInputs(prev => ({ ...prev, [appId]: text }));
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`btn ${subTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubTab('jobs')}
          >
            🏢 Company Postings ({jobs.length})
          </button>
          <button
            className={`btn ${subTab === 'applicants' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubTab('applicants')}
          >
            👥 Candidate Reviewer ({applications.length})
          </button>
        </div>

        <button className="btn btn-primary" onClick={onOpenPostModal}>
          ➕ Post New Internship
        </button>
      </div>

      {/* VIEW 1: MANAGE POSTED JOBS */}
      {subTab === 'jobs' && (
        <div>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3 className="empty-title">No Postings Yet</h3>
              <p className="empty-desc">
                Your company has not posted any opportunities yet. Publish your first internship to begin receiving candidates!
              </p>
              <button className="btn btn-primary" onClick={onOpenPostModal}>
                Post an Internship Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {jobs.map((job) => {
                const applicantsForThisJob = applications.filter(a => a.jobId === job._id);

                return (
                  <div key={job._id} className="job-card" style={{ padding: 22 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="status-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                            ● {job.status || 'Active'}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {job.title}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                          🏢 {job.company} • 📍 {job.location} ({job.workplaceType}) • 💰 {job.stipend}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedJobFilter(job._id);
                            setSubTab('applicants');
                          }}
                        >
                          👥 View Applicants ({applicantsForThisJob.length})
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${job.title}"? This will also remove candidate applications.`)) {
                              onDeleteJob(job._id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '14px 0' }}>
                      {job.skills && job.skills.map((s, i) => (
                        <span key={i} className="skill-badge">{s}</span>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      color: '#64748b',
                      paddingTop: 12,
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <div>
                        Duration: <strong>{job.duration}</strong> • Openings: <strong>{job.openings}</strong>
                      </div>
                      <div>
                        Deadline: <strong>{job.deadline || 'Rolling'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: APPLICANT REVIEWER */}
      {subTab === 'applicants' && (
        <div>
          {/* Job Filter Dropdown */}
          <div style={{
            background: '#ffffff',
            padding: '14px 18px',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                Filter by Opportunity:
              </span>
              <select
                className="select-control"
                style={{ width: 'auto', minWidth: 240 }}
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
              >
                <option value="All">All Opportunities ({applications.length})</option>
                {jobs.map(j => (
                  <option key={j._id} value={j._id}>{j.title} ({j.company})</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Showing <strong>{filteredApplications.length}</strong> candidate applications
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3 className="empty-title">No Candidates for this Selection</h3>
              <p className="empty-desc">
                No students have applied for this opportunity yet. Post more roles or check back shortly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              {filteredApplications.map((app) => {
                return (
                  <div key={app._id} className="job-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                            {app.studentName}
                          </h3>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            applied for <strong>{app.jobTitle}</strong> ({app.companyName})
                          </span>
                        </div>

                        <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                          <span>📧 {app.studentEmail}</span>
                          <span>📞 {app.studentPhone}</span>
                          <span>🎓 {app.studentDegree} - {app.studentCollege}</span>
                        </div>
                      </div>

                      {/* Current Status Pill */}
                      <div style={{ textAlign: 'right' }}>
                        <span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                          Current: {app.status}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Candidate Skills */}
                    {app.studentSkills && app.studentSkills.length > 0 && (
                      <div style={{ margin: '14px 0' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                          Candidate Skills
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {app.studentSkills.map((s, i) => (
                            <span key={i} className="skill-badge" style={{ background: '#f8fafc' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cover Note */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: '12px 16px',
                      fontSize: '0.88rem',
                      color: '#334155',
                      lineHeight: 1.5,
                      marginBottom: 16
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>
                        Cover Note from Applicant:
                      </div>
                      "{app.coverLetter || 'No cover letter provided.'}"
                    </div>

                    {/* Recruiter Action Control Panel */}
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 12,
                      padding: 16,
                      marginTop: 8
                    }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                        ⚡ Update Candidate Pipeline Status & Add Feedback:
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        {[
                          { label: 'Under Review', status: 'Under Review', variant: 'btn-secondary' },
                          { label: '⭐ Shortlist', status: 'Shortlisted', variant: 'btn-secondary' },
                          { label: '📅 Schedule Interview', status: 'Interview Scheduled', variant: 'btn-secondary' },
                          { label: '🎉 Offer Acceptance', status: 'Accepted', variant: 'btn-success' },
                          { label: '✕ Reject', status: 'Rejected', variant: 'btn-danger' }
                        ].map(act => (
                          <button
                            key={act.status}
                            disabled={updatingId === app._id || app.status === act.status}
                            className={`btn btn-sm ${act.variant}`}
                            style={{
                              opacity: app.status === act.status ? 0.6 : 1,
                              fontWeight: app.status === act.status ? 800 : 600
                            }}
                            onClick={() => handleStatusChange(app._id, act.status)}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>

                      {/* Recruiter Note Input */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 12px', fontSize: '0.84rem' }}
                          placeholder="Add recruiter feedback or interview notes (e.g. Technical round cleared)..."
                          value={feedbackInputs[app._id] !== undefined ? feedbackInputs[app._id] : (app.feedback || '')}
                          onChange={(e) => handleFeedbackChange(app._id, e.target.value)}
                        />
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(app._id, app.status)}
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

