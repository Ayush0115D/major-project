const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['power-limit', 'short-circuit', 'offline', 'warning'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);