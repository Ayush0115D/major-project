// ============= ALERT SCHEMA =============
// Location: smart-home-backend/models/Alert.js

import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  alertType: {
    type: String,
    enum: ['CRITICAL', 'WARNING'],
    required: true
  },
  socketName: {
    type: String,
    default: 'Living Room'
  },
  socketLocation: {
    type: String,
    default: 'Main Monitor'
  },
  power: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  voltage: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    default: null
  },
  riskLevel: {
    type: Number,
    required: true
  },
  overloadRisk: {
    type: Number,
    default: 0
  },
  shortCircuitRisk: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  recipientEmail: {
    type: String,
    default: 'ayush2231100@akgec.ac.in'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
alertSchema.index({ timestamp: -1 });
alertSchema.index({ alertType: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;