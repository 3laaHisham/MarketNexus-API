const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { reviewService } = require('../services');
const { getReviews, createNewReview, updateReview, deleteReview } =
  reviewService;

const { isAuthenticated, isResourceOwner } = require('../middlewares');
const { Review } = require('../models');

router.use(isAuthenticated);

router.get('/:id', (req, res) =>
  controller(res)(getReviews)({ _id: req.params.id })
);

router.post('/:productId', (req, res) =>
  controller(res)(createNewReview)(
    req.session.user.id,
    req.params.productId,
    req.body.review
  )
);

router.use((req, res) =>
  isResourceOwner(Review, req.params.id, req.session.user.id)
);

router.put(':/id', (req, res) =>
  controller(res)(updateReview)(req.params.id, req.body.review)
);

router.delete('/:id', (req, res) =>
  controller(res)(deleteReview)(req.params.id)
);

module.exports = router;
