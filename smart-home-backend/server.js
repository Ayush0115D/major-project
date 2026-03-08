import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alertsRouter from './routes/alerts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============= MIDDLEWARE =============
app.use(cors({
  origin: 'http://localhost:5173',  // ← Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= ROUTES =============
app.use('/api/alerts', alertsRouter);

// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running ✅' });
});

// ============= ERROR HANDLING =============
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: err.message 
  });
});

// ============= START SERVER =============
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📧 Email notifications enabled`);
});