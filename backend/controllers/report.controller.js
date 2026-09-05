const Report = require('../models/report.model');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { title, description, category, severity, location, imageUrl } = req.body;

    const report = await Report.create({
      title,
      description,
      category,
      severity,
      location,
      imageUrl,
      userId: req.user._id,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged-in user's reports
// @route   GET /api/reports/my
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only allow owner to see their report
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get report stats for dashboard
// @route   GET /api/reports/stats
// @access  Private
exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Report.countDocuments({ userId });
    const pending = await Report.countDocuments({ userId, status: 'Pending' });
    const inProgress = await Report.countDocuments({ userId, status: 'In Progress' });
    const resolved = await Report.countDocuments({ userId, status: 'Resolved' });

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
