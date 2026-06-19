const Suggestion = require('../models/Suggestion');

// @desc Submit suggestion (student)
exports.submitSuggestion = async (req, res) => {
  try {
    const { title, description, category, isAnonymous } = req.body;
    const suggestion = await Suggestion.create({
      title, description, category,
      isAnonymous: isAnonymous || false,
      submittedBy: req.user._id,
      submitterName: isAnonymous ? 'Anonymous Student' : req.user.name
    });
    res.status(201).json({ success: true, suggestion, message: 'Suggestion submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my suggestions (student)
exports.getMySuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all suggestions (admin)
exports.getAllSuggestions = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { submitterName: { $regex: search, $options: 'i' } }
    ];
    const total = await Suggestion.countDocuments(query);
    const suggestions = await Suggestion.find(query)
      .populate('submittedBy', 'name email studentId class')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, suggestions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update suggestion status (admin)
exports.updateSuggestionStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const suggestion = await Suggestion.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    if (!suggestion) return res.status(404).json({ success: false, message: 'Suggestion not found' });
    res.json({ success: true, suggestion, message: 'Suggestion updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
