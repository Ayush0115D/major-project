// server.js 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// ESP32 Configuration
const ESP32_IP = process.env.ESP32_IP || '192.168.1.1';
const ESP32_URL = `http://${ESP32_IP}`;

// In-memory storage (simple, no database needed)
let currentData = {
  load1: { status: 'No Fault!', class: 'success', fault: false },
  load2: { status: 'No Fault!', class: 'success', fault: false },
  load3: { status: 'No Fault!', class: 'success', fault: false },
  message: '',
  messageClass: 'hide',
  lastUpdate: new Date(),
  isConnected: false
};

let alertHistory = [];

// Fetch data from ESP32
async function fetchESP32Data() {
  try {
    const response = await axios.get(`${ESP32_URL}/main.json`, {
      timeout: 5000
    });
    
    const data = response.data;
    
    // Update current data
    currentData = {
      load1: {
        status: data.load1,
        class: data.load1_class,
        fault: data.load1_class === 'danger'
      },
      load2: {
        status: data.load2,
        class: data.load2_class,
        fault: data.load2_class === 'danger'
      },
      load3: {
        status: data.load3,
        class: data.load3_class,
        fault: data.load3_class === 'danger'
      },
      message: data.message || '',
      messageClass: data.message === 'Short circuit' ? 'danger' : 'hide',
      lastUpdate: new Date(),
      isConnected: true
    };

    // Add to alert history if there's a fault
    if (data.message === 'Short circuit' || 
        data.load1_class === 'danger' || 
        data.load2_class === 'danger' || 
        data.load3_class === 'danger') {
      
      const alert = {
        id: Date.now(),
        timestamp: new Date(),
        type: data.message === 'Short circuit' ? 'short_circuit' : 'overload',
        severity: data.message === 'Short circuit' ? 'critical' : 'high',
        message: data.message || 'Overload detected',
        loads: {
          load1: data.load1_class === 'danger',
          load2: data.load2_class === 'danger',
          load3: data.load3_class === 'danger'
        },
        status: 'active'
      };
      
      // Add only if it's a new alert (not duplicate)
      const lastAlert = alertHistory[0];
      if (!lastAlert || 
          lastAlert.type !== alert.type || 
          JSON.stringify(lastAlert.loads) !== JSON.stringify(alert.loads)) {
        alertHistory.unshift(alert);
        
        // Keep only last 50 alerts
        if (alertHistory.length > 50) {
          alertHistory = alertHistory.slice(0, 50);
        }
      }
    }

    return currentData;
  } catch (error) {
    console.error('Error fetching ESP32 data:', error.message);
    currentData.isConnected = false;
    return currentData;
  }
}

// API Routes

// Get current status
app.get('/api/status', async (req, res) => {
  const data = await fetchESP32Data();
  res.json(data);
});

// Get living room data (for your frontend)
app.get('/api/room/living-room', async (req, res) => {
  const data = await fetchESP32Data();
  
  // Calculate total current from all loads (assuming equal distribution)
  let totalCurrent = 0;
  if (data.load1.fault) totalCurrent += 15; // Overload current
  if (data.load2.fault) totalCurrent += 12;
  if (data.load3.fault) totalCurrent += 10;
  if (totalCurrent === 0) totalCurrent = 5; // Normal operation
  
  // Calculate power
  const voltage = 220;
  const power = voltage * totalCurrent;
  
  // Format for your frontend
  const roomData = {
    livingRoom: {
      voltage: voltage,
      current: totalCurrent,
      power: Math.round(power),
      temperature: 24 + Math.random() * 5, // Simulated (add actual sensor if available)
      status: data.messageClass === 'danger' ? 'CRITICAL' : 
              (data.load1.fault || data.load2.fault || data.load3.fault) ? 'WARNING' : 'NORMAL',
      loads: {
        load1: data.load1,
        load2: data.load2,
        load3: data.load3
      },
      shortCircuit: data.message === 'Short circuit',
      lastUpdated: data.lastUpdate
    }
  };
  
  res.json(roomData);
});

// Get alerts
app.get('/api/alerts', (req, res) => {
  const { status } = req.query;
  
  let alerts = alertHistory;
  if (status) {
    alerts = alerts.filter(a => a.status === status);
  }
  
  res.json({
    alerts: alerts,
    count: alerts.length
  });
});

// Acknowledge alert
app.put('/api/alerts/:id/acknowledge', (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = alertHistory.find(a => a.id === alertId);
  
  if (alert) {
    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date();
    res.json(alert);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

// Resolve alert
app.put('/api/alerts/:id/resolve', (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = alertHistory.find(a => a.id === alertId);
  
  if (alert) {
    alert.status = 'resolved';
    alert.resolvedAt = new Date();
    res.json(alert);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

// Get system stats
app.get('/api/system/stats', async (req, res) => {
  const data = await fetchESP32Data();
  
  const activeAlerts = alertHistory.filter(a => a.status === 'active').length;
  const totalFaults = alertHistory.length;
  
  res.json({
    status: data.isConnected ? 'online' : 'offline',
    totalPower: 2000, // Simulated
    activeAlerts: activeAlerts,
    totalFaults: totalFaults,
    uptime: process.uptime(),
    loads: {
      load1: data.load1.fault ? 'fault' : 'normal',
      load2: data.load2.fault ? 'fault' : 'normal',
      load3: data.load3.fault ? 'fault' : 'normal'
    },
    shortCircuit: data.message === 'Short circuit'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    esp32Connected: currentData.isConnected,
    timestamp: new Date() 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start polling ESP32
const POLL_INTERVAL = 2000; // 2 seconds
setInterval(() => {
  fetchESP32Data();
}, POLL_INTERVAL);

// Initial fetch
fetchESP32Data();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connecting to ESP32 at ${ESP32_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});