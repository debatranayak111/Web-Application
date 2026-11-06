import React from 'react';

export default function Hero({ stats }) {
  return (
    <section className="hero-section">
      <div className="hero-pill">
        <span>🚀</span> Next-Gen Tech Internships & Placements
      </div>
      <h1 className="hero-title">
        Discover Verified Internships & Fast-Track Your Tech Career
      </h1>
      <p className="hero-subtitle">
        Connect directly with leading tech companies, fast-growing startups, and top engineering teams.
        Apply with one click, track your status live, and land your dream internship.
      </p>

      <div className="hero-stats-row">
        <div className="hero-stat-card">
          <div style={{ fontSize: '1.4rem' }}>💼</div>
          <div>
            <div className="hero-stat-num">{stats.totalJobs || 8}+</div>
            <div className="hero-stat-label">Active Internships</div>
          </div>
        </div>

        <div className="hero-stat-card">
          <div style={{ fontSize: '1.4rem' }}>🏢</div>
          <div>
            <div className="hero-stat-num">{stats.companiesCount || 6}+</div>
            <div className="hero-stat-label">Hiring Companies</div>
          </div>
        </div>

        <div className="hero-stat-card">
          <div style={{ fontSize: '1.4rem' }}>📑</div>
          <div>
            <div className="hero-stat-num">{stats.totalApplications || 12}+</div>
            <div className="hero-stat-label">Applications Submitted</div>
          </div>
        </div>

        <div className="hero-stat-card">
          <div style={{ fontSize: '1.4rem' }}>✨</div>
          <div>
            <div className="hero-stat-num">{stats.shortlistedCount + stats.interviewingCount || 5}</div>
            <div className="hero-stat-label">Interviews in Progress</div>
          </div>
        </div>
      </div>
    </section>
  );
}

