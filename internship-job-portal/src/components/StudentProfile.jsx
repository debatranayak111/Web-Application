import React, { useState } from 'react';

export default function StudentProfile({
  student,
  onSaveProfile
}) {
  const [formData, setFormData] = useState({
    fullName: student?.fullName || 'Debatra Nayak',
    email: student?.email || '2024091239@gitam.edu',
    phone: student?.phone || '+91 98765 43210',
    college: student?.college || 'GITAM Deemed to be University',
    degree: student?.degree || 'B.Tech in Computer Science & Engineering',
    gradYear: student?.gradYear || 2026,
    cgpa: student?.cgpa || '8.85 / 10.0',
    bio: student?.bio || 'Passionate Full-Stack Developer with hands-on experience in MERN stack, RESTful API design, and responsive web applications.',
    github: student?.github || 'https://github.com/debatranayak111',
    linkedin: student?.linkedin || 'https://linkedin.com/in/debatranayak',
    portfolio: student?.portfolio || 'https://github.com/debatranayak111/Web-Application',
    resumeUrl: student?.resumeUrl || 'https://debatranayak.dev/resume.pdf'
  });

  const [skills, setSkills] = useState(
    student?.skills || ['ReactJS', 'NodeJS', 'ExpressJS', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'Python']
  );
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveProfile({
        ...formData,
        skills
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div className="profile-card">
        {/* Header Banner */}
        <div className="profile-header-group">
          <div className="profile-avatar">
            {formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'DN'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 className="profile-name">{formData.fullName}</h2>
                <div className="profile-tagline">
                  🎓 {formData.degree} • {formData.college} (Batch of {formData.gradYear})
                </div>
              </div>

              <button
                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Editing' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content / Form */}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr' : '2fr 1fr', gap: 24 }}>
            {/* Left Column: Academics & Experience */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
                Academic & Contact Information
              </h3>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">University Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CGPA / GPA</label>
                  <input
                    type="text"
                    name="cgpa"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.cgpa}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    name="college"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.college}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degree & Branch</label>
                  <input
                    type="text"
                    name="degree"
                    className="form-input"
                    disabled={!isEditing}
                    value={formData.degree}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Summary & Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  className="form-textarea"
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>

              {/* Skills Section */}
              <div className="form-group">
                <label className="form-label">Technical Skills & Expertise</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="skill-badge"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#eef2ff',
                        color: '#4338ca',
                        borderColor: '#c7d2fe'
                      }}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: 800,
                            fontSize: '0.9rem'
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Add a new skill (e.g. Next.js, Redux, Docker)..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Portfolio & Links */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 20,
              height: 'fit-content'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
                Links & Profiles
              </h3>

              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  name="github"
                  className="form-input"
                  disabled={!isEditing}
                  value={formData.github}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  className="form-input"
                  disabled={!isEditing}
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio / Project Link</label>
                <input
                  type="url"
                  name="portfolio"
                  className="form-input"
                  disabled={!isEditing}
                  value={formData.portfolio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resume Document URL</label>
                <input
                  type="url"
                  name="resumeUrl"
                  className="form-input"
                  disabled={!isEditing}
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                />
              </div>

              {/* Status Pill */}
              <div style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 8,
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span>✓</span> Profile 100% complete and ready for 1-click applications!
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving Profile...' : 'Save Profile Changes 💾'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
