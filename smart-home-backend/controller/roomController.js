const Component = require('../models/Component');
const Alert = require('../models/Alert');

exports.getRoomData = async (req, res) => {
  try {
    const components = await Component.find({ room: req.params.roomId });
    const alerts = await Alert.find({ 
      location: { $regex: req.params.roomId, $options: 'i' },
      status: 'active'
    });

    res.json({
      room: {
        id: req.params.roomId,
        name: req.params.roomId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        components
      },
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllComponents = async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.controlComponent = async (req, res) => {
  try {
    const { status } = req.body;
    const component = await Component.findOneAndUpdate(
      { id: req.params.id },
      { status, lastUpdated: new Date() },
      { new: true }
    );
    
    res.json(component);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
