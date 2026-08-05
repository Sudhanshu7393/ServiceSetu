const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Root
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'ServiceSetu - Doorstep Vehicle Servicing API',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files if running in combined mode
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` 🛠️  ServiceSetu Backend API running on port ${PORT}`);
    console.log(` 🌐 Health endpoint: http://localhost:${PORT}/health`);
    console.log(`==================================================`);
  });
}

module.exports = app;
