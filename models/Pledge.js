const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
  backer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Pledge amount is required'],
    min: [1, 'Pledge must be at least $1']
  },
  rewardTier: {
    type: mongoose.Schema.Types.ObjectId,
    default: null  // null = no reward (anonymous backer)
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot exceed 300 characters']
  },
  // Payment info placeholder (integrate Stripe etc.)
  paymentIntentId: String
}, { timestamps: true });

// Prevent duplicate pledge for same backer+project (one pledge per combo)
pledgeSchema.index({ backer: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Pledge', pledgeSchema);
