// ============= ALERTS ROUTES WITH MONGODB =============
// Location: smart-home-backend/routes/alerts.js

import express from 'express';
import { sendOverloadAlert } from '../services/emailService.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// ============= SEND OVERLOAD ALERT =============
router.post('/send-overload-alert', async (req, res) => {
  console.log('📨 Received alert request:', req.body);
  
  try {
    const { socketName, socketLocation, power, current, voltage, timestamp, riskLevel, overloadRisk, shortCircuitRisk, recipientEmail, temperature } = req.body;

    // ✅ VALIDATE INPUT
    if (!socketName || power === undefined || current === undefined || voltage === undefined) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required alert data'
      });
    }

    console.log('✅ Validation passed');

    // ✅ DETERMINE ALERT TYPE
    const alertType = power > 1000 && riskLevel >= 75 ? 'CRITICAL' : 'WARNING';
    console.log('📝 Alert Type:', alertType);

    // ✅ CREATE ALERT DOCUMENT
    const newAlert = new Alert({
      alertType,
      socketName,
      socketLocation,
      power: parseFloat(power),
      current: parseFloat(current),
      voltage: parseFloat(voltage),
      temperature: temperature ? parseFloat(temperature) : null,
      riskLevel: parseFloat(riskLevel),
      overloadRisk: parseFloat(overloadRisk) || 0,
      shortCircuitRisk: parseFloat(shortCircuitRisk) || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      recipientEmail: recipientEmail || 'ayush2231100@akgec.ac.in',
      emailSent: false,
      emailStatus: 'pending',
      acknowledged: false
    });

    console.log('💾 Alert object created:', newAlert);

    // ✅ SAVE TO DATABASE
    const savedAlert = await newAlert.save();
    console.log(`✅ Alert saved to MongoDB: ${savedAlert._id}`);

    // ✅ SEND EMAIL
    let emailResult = { success: false };
    try {
      emailResult = await sendOverloadAlert({
        socketName,
        socketLocation,
        power: parseFloat(power),
        current: parseFloat(current),
        voltage: parseFloat(voltage),
        temperature: temperature ? parseFloat(temperature) : null,
        riskLevel: parseFloat(riskLevel),
        timestamp: timestamp || new Date().toISOString(),
        recipientEmail: recipientEmail || 'ayush2231100@akgec.ac.in'
      });

      // Update email status in database
      if (emailResult.success) {
        await Alert.findByIdAndUpdate(savedAlert._id, {
          emailSent: true,
          emailStatus: 'sent'
        });
        console.log(`✅ Email sent successfully for alert ${savedAlert._id}`);
      } else {
        await Alert.findByIdAndUpdate(savedAlert._id, {
          emailStatus: 'failed'
        });
        console.warn(`⚠️ Email failed for alert ${savedAlert._id}`);
      }
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError.message);
      await Alert.findByIdAndUpdate(savedAlert._id, {
        emailStatus: 'failed'
      });
    }

    // ✅ LOG ALERT
    logAlert({
      type: alertType,
      socketName,
      socketLocation,
      power,
      current,
      voltage,
      riskLevel,
      timestamp: timestamp || new Date().toISOString(),
      status: 'recorded',
      dbId: savedAlert._id
    });

    res.json({
      success: true,
      message: 'Alert recorded successfully',
      alertId: savedAlert._id,
      emailStatus: emailResult.success ? 'sent' : 'pending',
      data: savedAlert
    });

  } catch (error) {
    console.error('❌ Error in send-overload-alert:', error);
    console.error('Error details:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record alert',
      error: error.message
    });
  }
});

// ============= GET ALL ALERTS =============
router.get('/history', async (req, res) => {
  try {
    console.log('📊 Fetching alert history...');
    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(100);

    console.log(`✅ Found ${alerts.length} alerts`);

    res.json({
      success: true,
      message: 'Alert history fetched',
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('❌ Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert history',
      error: error.message
    });
  }
});

// ============= GET ALERTS BY TYPE =============
router.get('/history/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['CRITICAL', 'WARNING'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert type'
      });
    }

    const alerts = await Alert.find({ alertType: type.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      success: true,
      message: `${type} alerts fetched`,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('❌ Error fetching alerts by type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
});

// ============= ACKNOWLEDGE ALERT =============
router.put('/acknowledge/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      id,
      {
        acknowledged: true,
        acknowledgedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    console.log(`✅ Alert acknowledged: ${id}`);

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('❌ Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to acknowledge alert',
      error: error.message
    });
  }
});

// ============= LOG ALERT TO CONSOLE =============
const logAlert = (alertData) => {
  console.log('📝 ALERT RECORDED:');
  console.log({
    timestamp: new Date().toISOString(),
    ...alertData
  });
};

export default router;