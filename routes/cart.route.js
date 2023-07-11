const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { cartService } = require('../services');
const {
  getCurrentCart,
  addProduct,
  deleteCurrentCart,
  changeCountOfProduct,
  deleteProduct
} = cartService;

const { isAuthenticated, isResourceOwner } = require('../middlewares');
const { Cart } = require('../models');

router.use(isAuthenticated);

router.get('/', (req, res) => controller(res)(getCurrentCart)(req.user.id));

router.post('/products', (req, res) =>
  controller(res)(addProduct)(req.user.id, req.body.product)
);

router.put('/products/:id/increase', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, 1, req.user.id)
);

router.put('/products/:id/reduce', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, -1, req.user.id)
);

router.delete('/products/:id', (req, res) =>
  controller(res)(deleteProduct)(req.params.id, req.user.id)
);

router.delete('/:id', (req, res) =>
  controller(res)(deleteCurrentCart)(req.params.id)
);

module.exports = router;
