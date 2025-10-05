const Component = require('../models/Component');
const Alert = require('../models/Alert');

const SAFE_LIMIT = 1500;

exports.updateComponent = async (req, res) => {
  try {
    const { id, power, current, status } = req.body;
    
    const component = await Component.findOneAndUpdate(
      { id },
      { power, current, status, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    // Check power limit
    const roomComponents = await Component.find({ room: component.room });
    const totalPower = roomComponents.reduce((sum, c) => sum + c.power, 0);

    if (totalPower > SAFE_LIMIT) {
      await Alert.findOneAndUpdate(
        { type: 'power-limit', location: component.room, status: 'active' },
        {
          id: `alert-${component.room}-power-${Date.now()}`,
          type: 'power-limit',
          severity: 'critical',
          location: 'Living Room',
          message: `Power consumption exceeds safe limits. Total load: ${totalPower}W`,
          status: 'active',
          timestamp: new Date()
        },
        { upsert: true, new: true }
      );
    }

    // Check short circuit
    if (status === 'short-circuit') {
      await Alert.create({
        id: `alert-${id}-${Date.now()}`,
        type: 'short-circuit',
        severity: 'critical',
        location: 'Living Room',
        message: `Short circuit detected at ${component.name}. Immediate attention required!`,
        status: 'active'
      });
    }

    res.json({ success: true, component });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { components } = req.body;
    const updates = [];

    for (let comp of components) {
      const updated = await Component.findOneAndUpdate(
        { id: comp.id },
        { ...comp, lastUpdated: new Date() },
        { new: true, upsert: true }
      );
      updates.push(updated);
    }

    res.json({ success: true, count: updates.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
