const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number
  }],
  skills: [{
    type: String,
    trim: true
  }],
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    links: {
      github: String,
      demo: String,
      other: String
    },
    technologies: [String]
  }],
  work: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
    resume: String
  }
}, {
  timestamps: true
});
profileSchema.index({ name: 'text', email: 'text', skills: 'text' });
module.exports = mongoose.model('Profile', profileSchema);
