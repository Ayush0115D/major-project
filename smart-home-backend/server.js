import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import alertsRouter from './routes/alerts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============= MONGODB CONNECTION =============
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shield-alerts';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️ Running without database - alerts will not persist');
  }
};

connectDB();

// ============= CORS CONFIGURATION (BULLETPROOF) =============
app.use(cors());

// ============= MIDDLEWARE =============
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============= ROUTES =============
app.use('/api/alerts', alertsRouter);

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️ Disconnected';
  res.json({ 
    status: '✅ Backend server is running',
    mongodb: mongoStatus,
    timestamp: new Date().toISOString(),
    cors: 'Enabled (All origins)',
    port: PORT
  });
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: err.message 
  });
});

// ============= 404 HANDLER =============
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path 
  });
});

// ============= START SERVER =============
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🛡️  SHIELD Smart Home Monitor Backend v2.1.0          ║
╚════════════════════════════════════════════════════════════════╝

✅ Backend running on: http://localhost:${PORT}
📡 CORS: Enabled for all origins
🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️ Connecting...'}
🔒 Allowed methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
📧 Email notifications: Enabled

Ready to accept requests! 🚀
  `);
});