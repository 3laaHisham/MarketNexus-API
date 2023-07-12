const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { authService } = require('../services');
const { register, login, logout, changePassword } = authService;

const { isAuthenticated } = require('../middlewares');

router.post('/register', (req, res) =>
  controller(res)(register)(req.body.user)
);

router.post('/login', (req, res) =>
  controller(res)(login)((token = req.headers.authorization), req.body.user)
);

router.use(isAuthenticated);

router.post('/logout', (req, res) => controller(res)(logout)(req.user.id));

router.put('/change-password', (req, res) =>
  controller(res)(changePassword)(req.user.id, req.body.user)
);

module.exports = router;
