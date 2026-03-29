const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected to govchain database'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Model (will create next)
const FundRecord = require('./models/FundRecord');

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '✅ GovChain Backend is Running with MongoDB!' });
});

// Get Project History from Database (Fast)
app.get('/api/projects/:projectId/history', async (req, res) => {
  try {
    const records = await FundRecord.find({ projectId: req.params.projectId })
                                   .sort({ recordId: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});