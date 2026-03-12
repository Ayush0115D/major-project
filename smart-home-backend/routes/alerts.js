// ============= ALERTS ROUTES =============
// Location: smart-home-backend/routes/alerts.js

import express from 'express';
import { sendOverloadAlert } from '../services/emailService.js';

const router = express.Router();

// ============= SEND OVERLOAD ALERT =============
router.post('/send-overload-alert', async (req, res) => {
  try {
    const { socketName, socketLocation, power, current, voltage, timestamp, riskLevel, recipientEmail } = req.body;

    // ✅ VALIDATE INPUT
    if (!socketName || power === undefined || current === undefined || voltage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required alert data'
      });
    }

    // ✅ SEND EMAIL
    const emailResult = await sendOverloadAlert({
      socketName,
      socketLocation,
      power: parseFloat(power),
      current: parseFloat(current),
      voltage: parseFloat(voltage),
      riskLevel: parseFloat(riskLevel),
      timestamp: timestamp || new Date().toISOString(),
      recipientEmail: recipientEmail || 'ayush2231100@akgec.ac.in'
    });

    // ✅ LOG ALERT
    logAlert({
      type: 'overload',
      socketName,
      socketLocation,
      power,
      current,
      voltage,
      riskLevel,
      timestamp: timestamp || new Date().toISOString(),
      status: 'sent'
    });

    res.json({
      success: true,
      message: 'Overload alert sent successfully',
      data: emailResult
    });

  } catch (error) {
    console.error('❌ Error in send-overload-alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send alert',
      error: error.message
    });
  }
});

// ============= LOG ALERT TO CONSOLE/FILE =============
const logAlert = (alertData) => {
  console.log('📝 ALERT LOGGED:');
  console.log({
    timestamp: new Date().toISOString(),
    ...alertData
  });
  
  // TODO: Save to database or file for history
};

// ============= GET ALERT HISTORY =============
router.get('/history', (req, res) => {
  // TODO: Fetch alert history from database
  res.json({
    success: true,
    message: 'Alert history endpoint',
    data: []
  });
});

export default router;