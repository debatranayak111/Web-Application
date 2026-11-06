import React from 'react';

export default function JobDetailModal({
  job,
  hasApplied,
  onClose,
  onApply
}) {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="company-avatar">
              {job.companyInitials || (job.company ? job.company.substring(0, 2).toUpperCase() : 'CO')}
            </div>
            <div>
              <h2 className="modal-title">{job.title}</h2>
              <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                {job.company} • {job.location} ({job.workplaceType})
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Info Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            background: '#f8fafc',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Stipend</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>{job.stipend}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{job.duration}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Category</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{job.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Deadline</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>{job.deadline || 'Rolling'}</div>
            </div>
          </div>

          {/* About Opportunity */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              About the Role
            </h4>
            <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                Key Responsibilities
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                {job.responsibilities.map((resp, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                Qualifications & Skills Required
              </h4>
              <ul style={{ paddingLeft: 20, fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                {job.requirements.map((req, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills Badges */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              Required Tech Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.skills && job.skills.map((skill, index) => (
                <span key={index} className="skill-badge" style={{ fontSize: '0.82rem', padding: '4px 10px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Perks */}
          {job.perks && job.perks.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
                Perks & Benefits
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {job.perks.map((perk, i) => (
                  <span key={i} style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 9999
                  }}>
                    ✨ {perk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {hasApplied ? (
            <span className="status-badge applied" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              ✓ You have already applied
            </span>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onApply(job);
              }}
            >
              Apply for this Internship 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

