const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { userService } = require('../services');
const { getUsers, updateUser, deleteUser } = userService;

const { isAuthenticated, isAuthorized, getCached, queryParser } = require('../middlewares');

router.use(queryParser);

router.get(
  '/search',
  (req, res, next) => getCached(res, next)('user', req.query),
  (req, res) => controller(res)(getUsers)(req.query)
);

router.get(
  '/me',
  isAuthenticated,
  (req, res, next) => getCached(res, next)('user', { _id: req.session.user.id }),
  (req, res) => controller(res)(getUsers)({ _id: req.session.user.id })
);

router.get(
  '/:id',
  (req, res, next) => getCached(res, next)('user', { _id: req.params.id }),
  (req, res) => controller(res)(getUsers)({ _id: req.params.id })
);

// The following routes needs authentication.
router.use(isAuthenticated);

router.put('/me', (req, res) => controller(res)(updateUser)(req.session.user.id, req.body));

router.delete('/me', (req, res) => controller(res)(deleteUser)(req.session.user.id));

router.delete('/:id', isAuthorized('admin'), (req, res) =>
  controller(res)(deleteUser)(req.params.id)
);

router.post('/confirm-signup', (req, res) => controller(res)(confirmSignup)(req.body));

module.exports = router;
