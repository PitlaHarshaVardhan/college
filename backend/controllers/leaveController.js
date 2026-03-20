const Leave = require('../models/Leave');
const catchAsync = require('../utils/catchAsync');

exports.applyLeave = catchAsync(async (req, res, next) => {
  const newLeave = await Leave.create({
    employee: req.user.id,
    type: req.body.type,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason
  });

  res.status(201).json({
    status: 'success',
    data: { leave: newLeave }
  });
});

exports.getMyLeaves = catchAsync(async (req, res, next) => {
  const leaves = await Leave.find({ employee: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: leaves.length,
    data: { leaves }
  });
});

exports.getAllLeaves = catchAsync(async (req, res, next) => {
  // Employer only
  const leaves = await Leave.find().populate('employee', 'name email').sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: leaves.length,
    data: { leaves }
  });
});

exports.updateLeaveStatus = catchAsync(async (req, res, next) => {
  // Employer only
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid status' });
  }

  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!leave) {
    return res.status(404).json({ status: 'fail', message: 'No leave found with that ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { leave }
  });
});
