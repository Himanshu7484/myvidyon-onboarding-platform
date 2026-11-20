const express = require('express');

const app = express();
const PORT = 5001;

// A simple route to check that the server is working
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MyVidyon API is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});