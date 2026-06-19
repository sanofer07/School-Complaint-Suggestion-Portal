const Complaint = require('../models/Complaint');

// @desc Submit complaint (student)
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, isAnonymous } = req.body;
    const complaint = await Complaint.create({
      title, description, category, priority,
      isAnonymous: isAnonymous || false,
      submittedBy: req.user._id,
      submitterName: isAnonymous ? 'Anonymous Student' : req.user.name
    });
    res.status(201).json({ success: true, complaint, message: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my complaints (student)
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 10 } = req.query;
    const query = { submittedBy: req.user._id };
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ticketId: { $regex: search, $options: 'i' } }
    ];
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('replies.repliedBy', 'name role');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    // Students can only view their own complaints
    if (req.user.role === 'student' && complaint.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ticketId: { $regex: search, $options: 'i' } },
      { submitterName: { $regex: search, $options: 'i' } }
    ];
    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email studentId class')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update complaint status (admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, complaint, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reply to complaint (admin)
exports.replyToComplaint = async (req, res) => {
  try {
    const { message } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    complaint.replies.push({ message, repliedBy: req.user._id, repliedByName: req.user.name });
    await complaint.save();
    res.json({ success: true, complaint, message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get complaint stats (admin)
exports.getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'Submitted' });
    const underReview = await Complaint.countDocuments({ status: 'Under Review' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    const highPriority = await Complaint.countDocuments({ priority: 'High' });
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats: { total, submitted, underReview, inProgress, resolved, rejected, highPriority, categoryStats } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
