// API client using native fetch for zero external client dependencies
const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! Status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.workplaceType && params.workplaceType !== 'All') query.append('workplaceType', params.workplaceType);
    if (params.employmentType && params.employmentType !== 'All') query.append('employmentType', params.employmentType);
    if (params.minStipend) query.append('minStipend', params.minStipend);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const endpoint = `/jobs${queryString ? `?${queryString}` : ''}`;
    return request(endpoint);
  },

  async getJobById(id) {
    return request(`/jobs/${id}`);
  },

  async createJob(jobData) {
    return request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  async updateJob(id, updates) {
    return request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteJob(id) {
    return request(`/jobs/${id}`, {
      method: 'DELETE'
    });
  },

  async getCategories() {
    return request('/jobs/meta/categories');
  },

  // Student Profile
  async getProfile(email = '2024091239@gitam.edu') {
    return request(`/students/profile?email=${encodeURIComponent(email)}`);
  },

  async updateProfile(profileData) {
    return request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Applications
  async getApplications(studentEmail) {
    const endpoint = studentEmail ? `/applications/student/${encodeURIComponent(studentEmail)}` : '/applications';
    return request(endpoint);
  },

  async getApplicationsForJob(jobId) {
    return request(`/applications/job/${jobId}`);
  },

  async apply(applicationData) {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  async updateApplicationStatus(id, status, feedback = '') {
    return request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, feedback })
    });
  },

  async withdrawApplication(id) {
    return request(`/applications/${id}`, {
      method: 'DELETE'
    });
  },

  // Stats & Health
  async getStats() {
    return request('/stats');
  },

  async getHealth() {
    return request('/health');
  }
};
