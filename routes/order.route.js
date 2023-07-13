const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { orderService } = require('../services');
const { createNewOrder, getAllOrders, updateOrder } = orderService;

const {
  isAuthenticated,
  isAuthorized,
  isResourceOwner
} = require('../middlewares');

const { Order } = require('../models');

router.use(isAuthenticated);

router.post('/', (req, res) =>
  controller(res)(createNewOrder)(req.session.user.id, req.body.order)
);

router.get('/:id', (req, res) =>
  controller(res)(getAllOrders)({ _id: req.params.id })
);

router.get('/search', (req, res) => controller(res)(getAllOrders)(req.query));

router.use((req, res) =>
  isResourceOwner(Order, req.params.id, req.session.user.id)
);

router.put('/:id/cancel', (req, res) =>
  controller(res)(updateOrder)(req.params.id, { status: 'Cancelled' })
);

router.put('/:id/status', isAuthorized('admin'), (req, res) =>
  controller(res)(updateOrder)(req.params.id, { status: req.body.status })
);

module.exports = router;
