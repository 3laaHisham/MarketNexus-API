const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { authService } = require('../services');
const { register, login, logout, changePassword } = authService;

const { isAuthenticated } = require('../middlewares');

const { nodemailerFunction1, nodemailerFunction2 } = require('../utils/mailer');

router.post('/register', (req, res) => {
  // Call nodemailerFunction1 to send confirmation email
  nodemailerFunction1();
  controller(res)(register)(req.body);
});

router.post('/login', (req, res) => {
  controller(res, req.session)(login)((token = req.session.token), req.body);
});

router.use(isAuthenticated);

router.post('/logout', (req, res) => {
  controller(res)(logout)(req.session);
});

router.put('/change-password', (req, res) => {
  // Call nodemailerFunction2 to send forgot password email
  nodemailerFunction2();
  controller(res)(changePassword)(req.session.user.id, req.body);
});

module.exports = router;
