require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const onboardingRoutes = require('./routes/onboarding.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Health check: tests the server AND the database
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      message: 'MyVidyon API is running',
      database: 'connected',
    });
  } catch (error) {
    console.error('Database check failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});