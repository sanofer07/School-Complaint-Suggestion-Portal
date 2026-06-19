const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, deleteUser, getDashboardStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/toggle-status', protect, adminOnly, toggleUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
