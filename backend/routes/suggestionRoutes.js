const express = require('express');
const router = express.Router();
const { submitSuggestion, getMySuggestions, getAllSuggestions, updateSuggestionStatus } = require('../controllers/suggestionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, submitSuggestion);
router.get('/my', protect, getMySuggestions);
router.get('/', protect, adminOnly, getAllSuggestions);
router.put('/:id', protect, adminOnly, updateSuggestionStatus);

module.exports = router;
