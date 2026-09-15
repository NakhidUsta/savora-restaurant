const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', settingsController.getSettings);
router.put('/images/:sectionKey', requireAdmin, settingsController.updateImage);
router.put('/:key', requireAdmin, settingsController.updateSetting);

module.exports = router;
