import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    companyInitials: {
      type: String,
      default: 'CO'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'Remote'
    },
    workplaceType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote'
    },
    employmentType: {
      type: String,
      enum: ['Internship', 'Full-time', 'Part-time'],
      default: 'Internship'
    },
    category: {
      type: String,
      required: true,
      default: 'Software Engineering'
    },
    stipend: {
      type: String,
      required: true,
      default: 'Unpaid / Certificate'
    },
    stipendNumeric: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      default: '3 Months'
    },
    openings: {
      type: Number,
      default: 1
    },
    skills: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    perks: {
      type: [String],
      default: ['Certificate of Completion']
    },
    postedBy: {
      type: String,
      required: true,
      default: 'recruiter@company.com'
    },
    deadline: {
      type: String
    },
    status: {
      type: String,
      enum: ['Active', 'Closed'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

JobSchema.index({ title: 'text', company: 'text', skills: 'text' });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
