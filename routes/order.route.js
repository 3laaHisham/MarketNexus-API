const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { orderService } = require('../services');
const { createNewOrder, getAllOrders, updateOrder } = orderService;

const {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  queryParser,
  getCached
} = require('../middlewares');

const { Order } = require('../models');

router.use(queryParser, isAuthenticated);

router.post('/', (req, res) => controller(res)(createNewOrder)(req.session.user.id, req.body));

router.get(
  '/search',
  (req, res, next) => getCached(res, next)('order', req.query),
  (req, res) => controller(res)(getAllOrders)(req.query)
);

router.get('/:id', (req, res) => controller(res)(getAllOrders)({ _id: req.params.id }));

router.put('/:id/status', isAuthorized('admin'), (req, res) =>
  controller(res)(updateOrder)(req.params.id, req.body)
);

router.put(
  '/:id/cancel',
  (req, res, next) => isResourceOwner(res, next)(Order, req.params.id, req.session.user.id),
  (req, res) => controller(res)(updateOrder)(req.params.id, { status: 'Cancelled' })
);

router.post('/confirm-order', (req, res) => controller(res)(confirmOrder)(req.body));

module.exports = router;
