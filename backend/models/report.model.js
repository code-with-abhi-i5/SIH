const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Roads & Infrastructure',
      'Water',
      'Education',
      'Sanitation',
      'Healthcare',
      'Electricity',
      'Environment',
      'Agriculture',
    ],
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  location: {
    address: { type: String, default: '' },
    pincode: { type: String, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  contactDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
  },
  imageUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
