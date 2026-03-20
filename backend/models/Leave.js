const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Leave must belong to an employee']
  },
  type: {
    type: String,
    enum: ['Sick', 'Casual', 'Maternity', 'Paternity', 'Annual', 'Unpaid'],
    required: [true, 'A leave must have a type']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  days: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Pre validate hook to calculate days before validation checks
leaveSchema.pre('validate', function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    // +1 to include both start and end dates
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
