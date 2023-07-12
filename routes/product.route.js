const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { productService } = require('../services');
const { getProducts, addProduct, updateProduct, deleteProduct } =
  productService;

const { Product } = require('../models');

const {
  isAuthenticated,
  isAuthorized,
  isResourceOwner
} = require('../middlewares');

router.get('/:id', (req, res) => controller(res)(getProducts)({ _id: id }));

router.get('/', (req, res) => controller(res)(getProducts)(req.query));

router.get('/top10-cheapest', (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: { price: 1 },
    category: req.query.category
  })
);

router.get('/top10-rated', (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: { avgRating: -1 },
    category: req.query.category
  })
);

router.get('/most10-sold', (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: { numSold: -1 },
    category: req.query.category
  })
);

router.use(isAuthenticated, isAuthorized('seller'));

router.post('/', (req, res) =>
  controller(res)(addProduct)(req.user.id, req.body.product)
);

router.use((req, res) => isResourceOwner(Product, req.params.id, req.user.id));

router.put('/:id', (req, res) =>
  controller(res)(updateProduct)(req.params.id, req.body.product)
);

router.delete('/:id', (req, res) =>
  controller(res)(deleteProduct)(req.params.id)
);

module.exports = router;
