import React from 'react';

const CATEGORIES = [
  'All',
  'Software Engineering',
  'Frontend',
  'Backend',
  'Data Science & AI',
  'UI/UX Design'
];

export default function SearchFilters({
  filters,
  setFilters,
  categories = CATEGORIES
}) {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="search-filter-card">
      <div className="search-inputs-grid">
        {/* Keyword Search */}
        <div className="search-field">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="input-control"
            placeholder="Search by role, company, or skills (e.g. React, Node, Python)..."
            value={filters.q}
            onChange={(e) => handleChange('q', e.target.value)}
          />
        </div>

        {/* Workplace Type */}
        <div>
          <select
            className="select-control"
            value={filters.workplaceType}
            onChange={(e) => handleChange('workplaceType', e.target.value)}
          >
            <option value="All">All Workplace Types</option>
            <option value="Remote">🌐 Remote</option>
            <option value="Hybrid">🏢 Hybrid</option>
            <option value="On-site">📍 On-site</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            className="select-control"
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="newest">🕒 Newest First</option>
            <option value="stipend">💰 Highest Stipend</option>
            <option value="applicants">🔥 Most Popular</option>
          </select>
        </div>

        {/* Reset */}
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => setFilters({ q: '', category: 'All', workplaceType: 'All', sortBy: 'newest' })}
            title="Reset Filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="filter-pills-row">
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>
          Categories:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${filters.category === cat ? 'active' : ''}`}
            onClick={() => handleChange('category', cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

