const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repliedByName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Infrastructure', 'Academics', 'Transport', 'Safety', 'Discipline', 'Hostel', 'Others']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submitterName: {
    type: String,
    default: 'Anonymous Student'
  },
  replies: [replySchema],
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Auto-generate ticket ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Complaint').countDocuments();
    this.ticketId = `CMP-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
