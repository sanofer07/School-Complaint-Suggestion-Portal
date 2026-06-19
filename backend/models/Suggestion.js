const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['Pending', 'Acknowledged', 'Implemented', 'Dismissed'],
    default: 'Pending'
  },
  adminResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Suggestion', suggestionSchema);
