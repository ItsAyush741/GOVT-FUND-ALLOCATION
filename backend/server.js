const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Web3 = require('web3');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GANACHE_URL = process.env.GANACHE_URL || "http://127.0.0.1:7545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const web3 = new Web3(GANACHE_URL);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const FundRecord = require('./models/FundRecord');

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: '✅ GovChain Backend Running with MongoDB + Blockchain Sync!' });
});

// Get Project History from MongoDB (Fast)
app.get('/api/projects/:projectId/history', async (req, res) => {
  try {
    const records = await FundRecord.find({ projectId: req.params.projectId })
                                   .sort({ recordId: 1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== BLOCKCHAIN EVENT LISTENER ======================

const ABI = [ /* We will use minimal ABI for events */ 
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "recordId", "type": "uint256" },
      { "indexed": true, "name": "projectId", "type": "string" },
      { "indexed": false, "name": "eventName", "type": "string" },
      { "indexed": false, "name": "contractorName", "type": "string" },
      { "indexed": false, "name": "projectEstimate", "type": "uint256" },
      { "indexed": false, "name": "fundAllocated", "type": "uint256" },
      { "indexed": false, "name": "totalFundTillNow", "type": "uint256" },
      { "indexed": false, "name": "timestamp", "type": "uint256" },
      { "indexed": false, "name": "recordedBy", "type": "address" }
    ],
    "name": "FundAllocated",
    "type": "event"
  }
];

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

console.log("👀 Listening for FundAllocated events from smart contract...");

contract.events.FundAllocated({
  fromBlock: 'latest'
})
.on('data', async (event) => {
  try {
    const { recordId, projectId, eventName, contractorName, projectEstimate, 
            fundAllocated, totalFundTillNow, timestamp, recordedBy } = event.returnValues;

    const newRecord = new FundRecord({
      recordId: Number(recordId),
      projectId,
      eventName,
      contractorName,
      projectEstimate: Number(projectEstimate),
      fundAllocated: Number(fundAllocated),
      totalFundTillNow: Number(totalFundTillNow),
      timestamp: new Date(Number(timestamp) * 1000),
      recordedBy,
      remarks: "",           // You can extend this later
      status: "approved"
    });

    await newRecord.save();
    console.log(`✅ Synced Record #${recordId} for project ${projectId} to MongoDB`);
  } catch (err) {
    console.error("Error saving to MongoDB:", err.message);
  }
})
.on('error', (error) => {
  console.error("Event listener error:", error);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});