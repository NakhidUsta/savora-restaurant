const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.get('/stats', requireAdmin, adminController.getStats);

module.exports = router;
