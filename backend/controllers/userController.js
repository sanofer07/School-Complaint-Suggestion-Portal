const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Suggestion = require('../models/Suggestion');

// @desc Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'student' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle user active status (admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get dashboard stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalComplaints = await Complaint.countDocuments();
    const totalSuggestions = await Suggestion.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const highPriority = await Complaint.countDocuments({ priority: 'High', status: { $nin: ['Resolved', 'Rejected'] } });
    const recentComplaints = await Complaint.find()
      .populate('submittedBy', 'name studentId')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      success: true,
      stats: { totalStudents, totalComplaints, totalSuggestions, pendingComplaints, resolvedComplaints, highPriority },
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
