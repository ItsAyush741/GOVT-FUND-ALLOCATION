const mongoose = require('mongoose');

const FundRecordSchema = new mongoose.Schema({
  recordId: { type: Number, required: true, unique: true },
  projectId: { type: String, required: true, index: true },
  eventName: String,
  contractorName: String,
  projectEstimate: Number,
  fundAllocated: { type: Number, required: true },
  totalFundTillNow: Number,
  timestamp: Date,
  recordedBy: String,
  remarks: String,

  // Extra off-chain fields
  invoiceIpfsHash: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'completed'], 
    default: 'approved' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FundRecord', FundRecordSchema);