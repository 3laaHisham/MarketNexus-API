const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { isAuthenticated, isResourceOwner } = require('../middlewares');
const { Review } = require('../models');

router.get('/:id', (req, res) =>
  controller(res)(getReviews)({ _id: req.params.id })
);

router.get('/product/:productID', (req, res) =>
  controller(res)(getReviews)({ userId: req.params.productID })
);

router.use(isAuthenticated);

router.post('/', (req, res) =>
  controller(res)(createNewReview)(req.body.review)
);

router.use((req, res) => isResourceOwner(Review, req.params.id, req.user.id));

router.put(':/id', (req, res) =>
  controller(res)(updateReview)(req.params.id, req.body.review)
);

router.delete('/:id', (req, res) =>
  controller(res)(deleteReview)(req.params.id)
);

module.exports = router;
