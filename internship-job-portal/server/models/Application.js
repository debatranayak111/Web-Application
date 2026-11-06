import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      ref: 'Job'
    },
    jobTitle: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      default: ''
    },
    studentName: {
      type: String,
      required: true
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true
    },
    studentPhone: {
      type: String,
      default: ''
    },
    studentCollege: {
      type: String,
      default: ''
    },
    studentDegree: {
      type: String,
      default: ''
    },
    studentSkills: {
      type: [String],
      default: []
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'],
      default: 'Applied'
    },
    feedback: {
      type: String,
      default: 'Application under review.'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

ApplicationSchema.index({ jobId: 1, studentEmail: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
