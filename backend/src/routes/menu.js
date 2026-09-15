const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', requireAdmin, menuController.createMenuItem);
router.put('/:id', requireAdmin, menuController.updateMenuItem);
router.delete('/:id', requireAdmin, menuController.deleteMenuItem);

module.exports = router;
