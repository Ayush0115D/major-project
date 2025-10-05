const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const hardwareRoutes = require('./routes/hardwareRoutes');
const roomRoutes = require('./routes/roomRoutes');
const alertRoutes = require('./routes/alertRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/hardware', hardwareRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api', systemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});