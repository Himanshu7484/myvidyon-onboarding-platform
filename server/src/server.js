require('dotenv').config();
const express = require('express');
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

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