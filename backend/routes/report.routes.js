const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createReport,
  getMyReports,
  getReportById,
  getMyStats,
} = require('../controllers/report.controller');

router.post('/', protect, createReport);
router.get('/my', protect, getMyReports);
router.get('/stats', protect, getMyStats);
router.get('/:id', protect, getReportById);

module.exports = router;
