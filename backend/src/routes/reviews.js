const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', reviewController.getApprovedReviews);
router.get('/admin', requireAdmin, reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.put('/:id', requireAdmin, reviewController.updateReviewStatus);
router.delete('/:id', requireAdmin, reviewController.deleteReview);

module.exports = router;
