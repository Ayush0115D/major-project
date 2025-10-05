const Alert = require('../models/Alert');

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { id: req.params.id },
      { status: 'resolved' },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
