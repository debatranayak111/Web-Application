import React, { useState } from 'react';

export default function ApplyModal({
  job,
  student,
  onClose,
  onSubmitApplication
}) {
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job ? job.company : 'the company'},\n\nI am enthusiastic about applying for the ${job ? job.title : 'internship'} role. With my background in ${student ? student.degree : 'Computer Science'} and practical hands-on experience in ${(student && student.skills) ? student.skills.slice(0, 3).join(', ') : 'modern web development'}, I am confident I can contribute effectively to your team from day one.\n\nThank you for considering my application.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const appData = {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company,
        studentId: student ? student._id : 'student-1',
        studentName: student ? student.fullName : 'Debatra Nayak',
        studentEmail: student ? student.email : '2024091239@gitam.edu',
        studentPhone: student ? student.phone : '+91 98765 43210',
        studentCollege: student ? student.college : 'GITAM University',
        studentDegree: student ? student.degree : 'B.Tech CSE',
        studentSkills: student ? student.skills : [],
        coverLetter: coverLetter.trim()
      };

      await onSubmitApplication(appData);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Apply for Internship</h2>
            <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
              {job.title} • {job.company}
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: '0.85rem',
                marginBottom: 16
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Candidate Summary Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 16,
              marginBottom: 18
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                Applicant Profile (Auto-filled)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.88rem' }}>
                <div><strong>Name:</strong> {student?.fullName || 'Debatra Nayak'}</div>
                <div><strong>Email:</strong> {student?.email || '2024091239@gitam.edu'}</div>
                <div><strong>College:</strong> {student?.college || 'GITAM University'}</div>
                <div><strong>Degree:</strong> {student?.degree || 'B.Tech CSE'}</div>
              </div>
            </div>

            {/* Skills Included */}
            <div className="form-group">
              <label className="form-label">Key Skills Sent With Application</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {student?.skills?.map((skill, i) => (
                  <span key={i} className="skill-badge" style={{ background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="form-group">
              <label className="form-label">
                Cover Note to Hiring Manager <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you are the ideal candidate for this internship..."
              />
              <div className="form-hint">
                A concise, personalized message increases candidate response rates by 60%.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Confirm & Submit Application 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
