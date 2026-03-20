const express = require('express');
const leaveController = require('../controllers/leaveController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Employee routes
router.post('/', restrictTo('employee'), leaveController.applyLeave);
router.get('/my', restrictTo('employee'), leaveController.getMyLeaves);

// Employer routes
router.get('/', restrictTo('employer'), leaveController.getAllLeaves);
router.patch('/:id/status', restrictTo('employer'), leaveController.updateLeaveStatus);

module.exports = router;
