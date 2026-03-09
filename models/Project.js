const mongoose = require('mongoose');

const rewardTierSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  minimumPledge: { type: Number, required: true, min: 1 },
  estimatedDelivery: Date,
  limitedQuantity: { type: Number, default: null },
  claimedCount: { type: Number, default: 0 }
});

const updateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  postedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Full description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Art', 'Music', 'Film', 'Games', 'Design', 'Food', 'Fashion', 'Publishing', 'Theater', 'Other']
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: [1, 'Funding goal must be greater than 0']
  },
  amountRaised: {
    type: Number,
    default: 0
  },
  backerCount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: [true, 'Project deadline is required']
  },
  image: {
    type: String,
    default: '/images/default-project.png'
  },
  videoUrl: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rewardTiers: [rewardTierSchema],
  updates: [updateSchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'failed', 'cancelled'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, { timestamps: true });

// Virtual: percentage funded
projectSchema.virtual('percentFunded').get(function () {
  return Math.min(Math.round((this.amountRaised / this.fundingGoal) * 100), 100);
});

// Virtual: days remaining
projectSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const diff = this.deadline - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual: is expired
projectSchema.virtual('isExpired').get(function () {
  return new Date() > this.deadline;
});

// Auto-generate slug from title
projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now();
  }
  next();
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
