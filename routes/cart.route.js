const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { cartService } = require('../services');
const { getCart, addToCart, emptyCart, changeCountOfProduct, deleteFromCart } = cartService;

const { isAuthenticated } = require('../middlewares');

router.use(isAuthenticated);

router.get('/', (req, res) => controller(res)(getCart)(req.session.user.id));

router.post('/products', (req, res) => controller(res)(addToCart)(req.session.user.id, req.body));

router.put('/products/:id/increase', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, 1, req.session.user.id)
);

router.put('/products/:id/reduce', (req, res) =>
  controller(res)(changeCountOfProduct)(req.params.id, -1, req.session.user.id)
);

router.delete('/products/:id', (req, res) =>
  controller(res)(deleteFromCart)(req.params.id, req.session.user.id)
);

router.delete('/', (req, res) => controller(res)(emptyCart)(req.session.user.id));

module.exports = router;
