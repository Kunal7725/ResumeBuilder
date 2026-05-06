const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  template: { type: String, enum: ['minimal', 'modern', 'professional'], default: 'minimal' },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
