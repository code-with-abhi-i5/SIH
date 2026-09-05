const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/reports', require('./routes/report.routes'));

app.get('/', (req, res) => {
  res.send('JanSamadhan API is running');
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
} else {
  console.log('No MONGO_URI provided. Running server without database connection.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
