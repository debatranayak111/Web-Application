import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    college: {
      type: String,
      default: ''
    },
    degree: {
      type: String,
      default: ''
    },
    gradYear: {
      type: Number,
      default: 2026
    },
    cgpa: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);

