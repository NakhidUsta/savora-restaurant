const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { requireAdmin } = require('../middleware/auth');

router.post('/', reservationController.createReservation);
router.get('/', requireAdmin, reservationController.getAllReservations);
router.put('/:id', requireAdmin, reservationController.updateReservationStatus);

module.exports = router;
