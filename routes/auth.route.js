const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { authService } = require('../services');
const { register, login, logout, changePassword } = authService;

const { isAuthenticated } = require('../middlewares');

router.post('/register', (req, res) => {
  controller(res)(register)(req.body);
  const { email } = req.body;
  const confirmToken = authService.generateConfirmToken(email);
  const confirmLink = `http://localhost:3000/confirm-email?token=${confirmToken}`;
  mailer.sendEmail(email, 'Confirm Email', `Click this link to confirm your email: ${confirmLink}`);
});

router.post('/login', (req, res) =>
  controller(res, req.session)(login)((token = req.session.token), req.body)
);

router.use(isAuthenticated);

router.post('/logout', (req, res) => controller(res)(logout)(req.session));

router.put('/change-password', (req, res) =>
  controller(res)(changePassword)(req.session.user.id, req.body)
);

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const resetToken = authService.generateResetToken(email);
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  mailer.sendEmail(email, 'Password Reset', `Click this link to reset your password: ${resetLink}`);
});

module.exports = router;
