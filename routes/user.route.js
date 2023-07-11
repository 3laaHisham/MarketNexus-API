const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { userService } = require('../services');
const { getUsers, updateUser, deleteUser } = userService;

const { isAuthenticated, isAuthorized } = require('../middlewares');

router.get('/:id', (req, res) =>
  controller(res)(getUsers)({ _id: req.params.id })
);

router.get('/', (req, res) => controller(res)(getUsers)(req.query));

// The following routes needs authentication.
router.use(isAuthenticated);

router.get('/me', (req, res) =>
  controller(res)(getUsers)({ _id: req.user.id }, res)
);

router.put('/me', (req, res) =>
  controller(res)(updateUser)(req.user.id, req.body.user)
);

router.delete('/me', (req, res) => controller(res)(deleteUser)(req.user.id));

router.delete('/:id', isAuthorized('admin'), (req, res) =>
  controller(res)(deleteUser)(req.params.id)
);

module.exports = router;
