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

const { sendEmail } = require('../utils/mailer');

router.use(queryParser, isAuthenticated);

router.post('/', (req, res) => controller(res)(createNewOrder)(req.session.user.id, req.body));

router.get(
  '/search',
  async (req, res, next) => {
    const result = await getCached(res, next)('order', req.query);
    if (result) {
      sendEmail(result.user.email, "Order Confirmation", "Your order has been confirmed. Thank you for shopping with us!");
    }
  },
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

module.exports = router;
