const express = require('express');
const router = express.Router();
const { submitComplaint, getMyComplaints, getComplaintById, getAllComplaints, updateComplaintStatus, replyToComplaint, getStats } = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, submitComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
router.post('/:id/reply', protect, adminOnly, replyToComplaint);

module.exports = router;
