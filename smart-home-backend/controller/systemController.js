const Component = require('../models/Component');
const Alert = require('../models/Alert');

exports.getSystemStatus = async (req, res) => {
  try {
    const totalComponents = await Component.countDocuments();
    const activeComponents = await Component.countDocuments({ status: { $ne: 'off' } });
    const activeAlerts = await Alert.countDocuments({ status: 'active' });
    
    const components = await Component.find();
    const totalPower = components.reduce((sum, c) => sum + c.power, 0);

    res.json({
      online: true,
      totalComponents,
      activeComponents,
      activeAlerts,
      totalPower,
      lastUpdate: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

