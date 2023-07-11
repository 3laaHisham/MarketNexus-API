const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { cartService } = require('../services');
const { getCart, addToCart, emptyCart, changeCountOfProduct, deleteFromCart } =
  cartService;

const { isAuthenticated } = require('../middlewares');

router.use(isAuthenticated);

router.get('/', (req, res) => controller(res)(getCart)(req.user.id));

router.post('/products', (req, res) =>
  controller(res)(addToCart)(req.user.id, req.body.product)
);

router.put('/products/:id/increase', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, 1, req.user.id)
);

router.put('/products/:id/reduce', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, -1, req.user.id)
);

router.delete('/products/:id', (req, res) =>
  controller(res)(deleteFromCart)(req.params.id, req.user.id)
);

router.delete('/', (req, res) => controller(res)(emptyCart)(req.user.id));

module.exports = router;
