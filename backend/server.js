const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/reports', require('./routes/report.routes'));

app.get('/', (req, res) => {
  res.send('JanSamadhan API is running');
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB Connected successfully');
    })
    .catch(err => {
      console.error('❌ MongoDB connection error: Check your MongoDB Atlas Network Access IP Whitelist (0.0.0.0/0).');
      console.error('Error detail:', err.message);
    });
} else {
  console.log('⚠️ No MONGO_URI provided. Running server without database connection.');
}
