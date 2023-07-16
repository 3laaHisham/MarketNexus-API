const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { productService } = require('../services');
const { getProducts, addProduct, updateProduct, deleteProduct } = productService;

const { Product } = require('../models');

const { isAuthenticated, isAuthorized, isResourceOwner, getCached } = require('../middlewares');

router.get('/:id', getCached('product'), (req, res) => controller(res)(getProducts)({ _id: id }));

router.get('/search', getCached('product'), (req, res) => controller(res)(getProducts)(req.query));

router.get('/top10-cheapest', getCached('product'), (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: 'price',
    category: req.query.category
  })
);

router.get('/top10-rated', getCached('product'), (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: '-avgRating',
    category: req.query.category
  })
);

router.get('/most10-sold', getCached('product'), (req, res) =>
  controller(res)(getProducts)({
    limit: 10,
    sort: '-numSold',
    category: req.query.category
  })
);

router.use(isAuthenticated, isAuthorized('seller'));

router.post('/', (req, res) => controller(res)(addProduct)(req.session.user.id, req.body));

router.use((req, res) => isResourceOwner(Product, req.params.id, req.session.user.id));

router.put('/:id', (req, res) => controller(res)(updateProduct)(req.params.id, req.body));

router.delete('/:id', (req, res) => controller(res)(deleteProduct)(req.params.id));

module.exports = router;
