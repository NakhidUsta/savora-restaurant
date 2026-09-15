const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/auth');

router.post('/', orderController.createOrder);
router.get('/', requireAdmin, orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', requireAdmin, orderController.updateOrderStatus);

module.exports = router;
