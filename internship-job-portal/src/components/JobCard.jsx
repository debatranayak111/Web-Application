import React from 'react';

export default function JobCard({
  job,
  hasApplied,
  onViewDetails,
  onApply
}) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
          <div className="company-avatar">
            {job.companyInitials || (job.company ? job.company.substring(0, 2).toUpperCase() : 'CO')}
          </div>
          <div className="job-title-group">
            <h3 className="job-title">{job.title}</h3>
            <div className="company-meta">
              <span>🏢 {job.company}</span>
              <span>•</span>
              <span>📍 {job.location}</span>
            </div>
          </div>
        </div>
        <div className="stipend-tag">
          {job.stipend}
        </div>
      </div>

      <div className="job-info-chips">
        <span className="info-chip">🏷️ {job.category}</span>
        <span>•</span>
        <span className="info-chip">💼 {job.workplaceType}</span>
        <span>•</span>
        <span className="info-chip">⏳ {job.duration}</span>
        {job.openings > 1 && (
          <>
            <span>•</span>
            <span className="info-chip">👥 {job.openings} Openings</span>
          </>
        )}
      </div>

      <p className="job-description-preview">
        {job.description}
      </p>

      <div className="job-skills-row">
        {job.skills && job.skills.map((skill, index) => (
          <span key={index} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>

      <div className="job-card-footer">
        <div className="applicant-counter">
          <span>👥</span>
          <span><strong>{job.applicantCount || 0}</strong> applicants</span>
          <span style={{ margin: '0 4px' }}>•</span>
          <span>Deadline: {job.deadline || 'Rolling'}</span>
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewDetails(job)}
          >
            Details
          </button>

          {hasApplied ? (
            <span className="status-badge applied" style={{ padding: '6px 12px' }}>
              ✓ Applied
            </span>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onApply(job)}
            >
              Apply Now ⚡
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

