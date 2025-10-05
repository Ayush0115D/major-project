const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['lighting', 'appliance', 'electronics', 'hvac', 'outlet'], required: true },
  status: { type: String, enum: ['on', 'off', 'in-use', 'short-circuit'], default: 'off' },
  power: { type: Number, default: 0 },
  current: { type: Number, default: 0 },
  location: String,
  room: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Component', componentSchema);