const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { authService } = require('../services');
const { register, login, logout, changePassword } = authService;

const { isAuthenticated } = require('../middlewares');

router.post('/register', (req, res) => controller(res)(register)(req.body));

router.post('/login', (req, res) =>
  controller(res, req.session)(login)((token = req.session.token), req.body)
);

router.post('/forgot-password', (req, res) => controller(res)(forgotPassword)(req.body.email));

router.post('/confirm-signup', (req, res) => controller(res)(confirmSignup)(req.body.email));

router.use(isAuthenticated);

router.post('/logout', (req, res) => controller(res)(logout)(req.session));

router.put('/change-password', (req, res) =>
  controller(res)(changePassword)(req.session.user.id, req.body)
);

module.exports = router;
