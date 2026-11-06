import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { initialJobs, initialStudent, initialApplications } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'db-store.json');

let isConnectedToMongo = false;
let mongoMode = 'fallback'; // 'mongodb' or 'fallback'

// In-memory / file persistent store
let memoryStore = {
  jobs: [],
  students: [],
  applications: []
};

// Load or initialize fallback storage
function initFallbackStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryStore = {
        jobs: parsed.jobs && parsed.jobs.length ? parsed.jobs : JSON.parse(JSON.stringify(initialJobs)),
        students: parsed.students && parsed.students.length ? parsed.students : [JSON.parse(JSON.stringify(initialStudent))],
        applications: parsed.applications && parsed.applications.length ? parsed.applications : JSON.parse(JSON.stringify(initialApplications))
      };
    } else {
      memoryStore = {
        jobs: JSON.parse(JSON.stringify(initialJobs)),
        students: [JSON.parse(JSON.stringify(initialStudent))],
        applications: JSON.parse(JSON.stringify(initialApplications))
      };
      saveFallbackStore();
    }
  } catch (err) {
    console.warn('[DB Engine] Could not load db-store.json, using defaults:', err.message);
    memoryStore = {
      jobs: JSON.parse(JSON.stringify(initialJobs)),
      students: [JSON.parse(JSON.stringify(initialStudent))],
      applications: JSON.parse(JSON.stringify(initialApplications))
    };
  }
}

function saveFallbackStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    // If running in read-only environment like some serverless lambdas, memoryStore still persists in-memory
    console.warn('[DB Engine] Notice: Could not write to db-store.json, using in-memory state:', err.message);
  }
}

// Initialize fallback immediately so it is ready
initFallbackStore();

// Attempt MongoDB Connection if URI provided
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[DB Engine] No MONGODB_URI set. Running in resilient MongoDB-compatible JSON fallback mode.');
    mongoMode = 'fallback';
    return { mode: mongoMode, connected: false };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnectedToMongo = true;
    mongoMode = 'mongodb';
    console.log('[DB Engine] Successfully connected to MongoDB Atlas / Server!');
    return { mode: mongoMode, connected: true };
  } catch (err) {
    console.warn(`[DB Engine] MongoDB connection failed (${err.message}). Using resilient local store.`);
    isConnectedToMongo = false;
    mongoMode = 'fallback';
    return { mode: mongoMode, connected: false, error: err.message };
  }
}

export function getDbStatus() {
  return {
    mode: mongoMode,
    isConnectedToMongo,
    totalJobs: memoryStore.jobs.length,
    totalStudents: memoryStore.students.length,
    totalApplications: memoryStore.applications.length
  };
}

// Generic MongoDB-like interface for Fallback Store
export const dbService = {
  // JOBS
  async getJobs(query = {}) {
    let result = [...memoryStore.jobs];

    // Search query: title, company, skills
    if (query.q) {
      const q = query.q.toLowerCase().trim();
      result = result.filter(j =>
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q)) ||
        (j.category && j.category.toLowerCase().includes(q)) ||
        (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (query.category && query.category !== 'All') {
      result = result.filter(j => j.category && j.category.toLowerCase() === query.category.toLowerCase());
    }

    // Workplace type: Remote, Hybrid, On-site
    if (query.workplaceType && query.workplaceType !== 'All') {
      result = result.filter(j => j.workplaceType && j.workplaceType.toLowerCase() === query.workplaceType.toLowerCase());
    }

    // Employment type
    if (query.employmentType && query.employmentType !== 'All') {
      result = result.filter(j => j.employmentType && j.employmentType.toLowerCase() === query.employmentType.toLowerCase());
    }

    // Min Stipend
    if (query.minStipend) {
      const min = parseInt(query.minStipend, 10);
      if (!isNaN(min)) {
        result = result.filter(j => (j.stipendNumeric || 0) >= min);
      }
    }

    // Sort
    if (query.sortBy === 'stipend') {
      result.sort((a, b) => (b.stipendNumeric || 0) - (a.stipendNumeric || 0));
    } else if (query.sortBy === 'applicants') {
      result.sort((a, b) => {
        const countA = memoryStore.applications.filter(app => app.jobId === a._id).length;
        const countB = memoryStore.applications.filter(app => app.jobId === b._id).length;
        return countB - countA;
      });
    } else {
      // Default: newest first
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Attach applicantCount to each job
    return result.map(j => ({
      ...j,
      applicantCount: memoryStore.applications.filter(app => app.jobId === j._id).length
    }));
  },

  async getJobById(id) {
    const job = memoryStore.jobs.find(j => j._id === id);
    if (!job) return null;
    const applicantCount = memoryStore.applications.filter(app => app.jobId === id).length;
    return { ...job, applicantCount };
  },

  async createJob(jobData) {
    const id = `job-${Date.now()}`;
    const newJob = {
      _id: id,
      title: jobData.title,
      company: jobData.company,
      companyLogo: jobData.companyLogo || '',
      companyInitials: (jobData.company || 'CO').substring(0, 2).toUpperCase(),
      location: jobData.location || 'Remote',
      workplaceType: jobData.workplaceType || 'Remote',
      employmentType: jobData.employmentType || 'Internship',
      category: jobData.category || 'Software Engineering',
      stipend: jobData.stipend || 'Unpaid / Certificate',
      stipendNumeric: parseInt(jobData.stipendNumeric || (jobData.stipend ? jobData.stipend.replace(/[^0-9]/g, '') : 0), 10) || 0,
      duration: jobData.duration || '3 Months',
      openings: parseInt(jobData.openings, 10) || 1,
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      description: jobData.description || '',
      responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : (jobData.responsibilities ? [jobData.responsibilities] : []),
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : (jobData.requirements ? [jobData.requirements] : []),
      perks: Array.isArray(jobData.perks) ? jobData.perks : (jobData.perks ? [jobData.perks] : ['Certificate of Completion', 'Letter of Recommendation']),
      postedBy: jobData.postedBy || 'recruiter@company.com',
      deadline: jobData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.jobs.unshift(newJob);
    saveFallbackStore();
    return { ...newJob, applicantCount: 0 };
  },

  async updateJob(id, updates) {
    const index = memoryStore.jobs.findIndex(j => j._id === id);
    if (index === -1) return null;
    const existing = memoryStore.jobs[index];
    const updated = {
      ...existing,
      ...updates,
      skills: Array.isArray(updates.skills) ? updates.skills : (updates.skills ? updates.skills.split(',').map(s => s.trim()).filter(Boolean) : existing.skills),
      stipendNumeric: updates.stipendNumeric ? parseInt(updates.stipendNumeric, 10) : (updates.stipend ? parseInt(updates.stipend.replace(/[^0-9]/g, '') || 0, 10) : existing.stipendNumeric),
      updatedAt: new Date().toISOString()
    };
    memoryStore.jobs[index] = updated;
    saveFallbackStore();
    return updated;
  },

  async deleteJob(id) {
    const initialLen = memoryStore.jobs.length;
    memoryStore.jobs = memoryStore.jobs.filter(j => j._id !== id);
    // Also remove applications associated with this job
    memoryStore.applications = memoryStore.applications.filter(a => a.jobId !== id);
    saveFallbackStore();
    return memoryStore.jobs.length < initialLen;
  },

  // STUDENTS
  async getStudentProfile(email = '2024091239@gitam.edu') {
    let student = memoryStore.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (!student) {
      student = memoryStore.students[0] || initialStudent;
    }
    return student;
  },

  async updateStudentProfile(profileData) {
    const email = profileData.email || '2024091239@gitam.edu';
    let index = memoryStore.students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
    const skills = Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(Boolean) : []);
    
    if (index === -1) {
      const newStudent = {
        _id: `student-${Date.now()}`,
        ...profileData,
        skills,
        updatedAt: new Date().toISOString()
      };
      memoryStore.students.push(newStudent);
      saveFallbackStore();
      return newStudent;
    } else {
      const existing = memoryStore.students[index];
      const updated = {
        ...existing,
        ...profileData,
        skills: skills.length ? skills : existing.skills,
        updatedAt: new Date().toISOString()
      };
      memoryStore.students[index] = updated;
      saveFallbackStore();
      return updated;
    }
  },

  // APPLICATIONS
  async getApplications(filter = {}) {
    let result = [...memoryStore.applications];
    if (filter.studentEmail) {
      result = result.filter(a => a.studentEmail && a.studentEmail.toLowerCase() === filter.studentEmail.toLowerCase());
    }
    if (filter.jobId) {
      result = result.filter(a => a.jobId === filter.jobId);
    }
    // Sort newest application first
    result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    return result;
  },

  async getApplicationById(id) {
    return memoryStore.applications.find(a => a._id === id) || null;
  },

  async createApplication(appData) {
    // Check if duplicate application exists
    const duplicate = memoryStore.applications.find(
      a => a.jobId === appData.jobId && a.studentEmail.toLowerCase() === appData.studentEmail.toLowerCase()
    );
    if (duplicate) {
      const err = new Error('You have already applied for this position.');
      err.status = 400;
      throw err;
    }

    const job = memoryStore.jobs.find(j => j._id === appData.jobId);
    const newApp = {
      _id: `app-${Date.now()}`,
      jobId: appData.jobId,
      jobTitle: job ? job.title : (appData.jobTitle || 'Internship Role'),
      companyName: job ? job.company : (appData.companyName || 'Company'),
      studentId: appData.studentId || 'student-1',
      studentName: appData.studentName || 'Student Applicant',
      studentEmail: appData.studentEmail,
      studentPhone: appData.studentPhone || '',
      studentCollege: appData.studentCollege || '',
      studentDegree: appData.studentDegree || '',
      studentSkills: Array.isArray(appData.studentSkills) ? appData.studentSkills : [],
      coverLetter: appData.coverLetter || 'I am excited to apply for this opportunity.',
      status: 'Applied',
      feedback: 'Application received and pending review.',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.applications.unshift(newApp);
    saveFallbackStore();
    return newApp;
  },

  async updateApplicationStatus(id, status, feedback) {
    const index = memoryStore.applications.findIndex(a => a._id === id);
    if (index === -1) return null;
    const existing = memoryStore.applications[index];
    existing.status = status;
    if (feedback !== undefined) {
      existing.feedback = feedback;
    }
    existing.updatedAt = new Date().toISOString();
    memoryStore.applications[index] = existing;
    saveFallbackStore();
    return existing;
  },

  async deleteApplication(id) {
    const initialLen = memoryStore.applications.length;
    memoryStore.applications = memoryStore.applications.filter(a => a._id !== id);
    saveFallbackStore();
    return memoryStore.applications.length < initialLen;
  },

  // STATS
  async getStats() {
    const totalJobs = memoryStore.jobs.length;
    const totalApplications = memoryStore.applications.length;
    const acceptedCount = memoryStore.applications.filter(a => a.status === 'Accepted').length;
    const shortlistedCount = memoryStore.applications.filter(a => a.status === 'Shortlisted').length;
    const interviewingCount = memoryStore.applications.filter(a => a.status === 'Interview Scheduled').length;
    
    // Distinct companies
    const companies = new Set(memoryStore.jobs.map(j => j.company));
    
    // Categories count
    const categoriesMap = {};
    memoryStore.jobs.forEach(j => {
      categoriesMap[j.category] = (categoriesMap[j.category] || 0) + 1;
    });

    return {
      totalJobs,
      totalApplications,
      acceptedCount,
      shortlistedCount,
      interviewingCount,
      companiesCount: companies.size,
      categories: categoriesMap
    };
  }
};
