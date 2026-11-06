import React, { useState } from 'react';

const CATEGORIES = [
  'Software Engineering',
  'Frontend',
  'Backend',
  'Data Science & AI',
  'UI/UX Design',
  'Product Management',
  'Marketing'
];

export default function PostJobModal({
  onClose,
  onSubmitJob
}) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Software Engineering',
    workplaceType: 'Hybrid',
    employmentType: 'Internship',
    location: 'Bengaluru, India',
    stipend: '₹30,000 / month',
    duration: '6 Months',
    openings: 2,
    skills: 'ReactJS, NodeJS, ExpressJS, MongoDB, Git',
    description: '',
    responsibilities: 'Develop user-facing features using React\nBuild robust backend REST endpoints with Express\nParticipate in daily standups and agile sprints',
    requirements: 'Solid understanding of JavaScript ES6+\nKnowledge of MERN stack principles\nEager to learn and solve complex problems',
    perks: 'Certificate of Internship, Letter of Recommendation, PPO Opportunity, Flexible Timings',
    postedBy: 'talent@company.com',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      setError('Title, Company Name, and Description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        openings: parseInt(formData.openings, 10) || 1,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        perks: formData.perks.split(',').map(s => s.trim()).filter(Boolean)
      };

      await onSubmitJob(payload);
    } catch (err) {
      setError(err.message || 'Failed to post opportunity.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Post an Internship / Job Opportunity</h2>
            <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Publish listing for verified student applicants
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

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Job / Internship Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  required
                  placeholder="e.g. Full Stack Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  required
                  placeholder="e.g. Razorpay, Google, Startup"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Workplace Type</label>
                <select
                  name="workplaceType"
                  className="form-select"
                  value={formData.workplaceType}
                  onChange={handleChange}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Bengaluru, India or Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stipend / Compensation</label>
                <input
                  type="text"
                  name="stipend"
                  className="form-input"
                  placeholder="e.g. ₹35,000 / month"
                  value={formData.stipend}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="form-input"
                  placeholder="e.g. 6 Months"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Openings</label>
                <input
                  type="number"
                  min="1"
                  name="openings"
                  className="form-input"
                  value={formData.openings}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                className="form-input"
                placeholder="ReactJS, NodeJS, ExpressJS, MongoDB, Git"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Overview & Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={3}
                required
                placeholder="Describe the role, the mission of your team, and key project goals..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Key Responsibilities (One per line)</label>
                <textarea
                  name="responsibilities"
                  className="form-textarea"
                  rows={3}
                  value={formData.responsibilities}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Candidate Requirements (One per line)</label>
                <textarea
                  name="requirements"
                  className="form-textarea"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Perks & Benefits (Comma separated)</label>
                <input
                  type="text"
                  name="perks"
                  className="form-input"
                  placeholder="Certificate, PPO Opportunity, Mentorship"
                  value={formData.perks}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing Opportunity...' : 'Post Opportunity Now 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
