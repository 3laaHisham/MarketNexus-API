const express = require('express');
const router = express.Router();

const controller = require('../controllers');

const { authService } = require('../services');
const { register, login, logout, changePassword } = authService;

const { isAuthenticated } = require('../middlewares');

const { sendEmail } = require('../utils/mailer');

router.post('/register', async (req, res) => {
  const result = await controller(res)(register)(req.body);
  if (result) {
    sendEmail(req.body.email, "Welcome to MarketNexus!", "Thank you for signing up to MarketNexus! We're glad to have you here.");
  }
});

router.post('/login', (req, res) =>
  controller(res, req.session)(login)((token = req.session.token), req.body)
);

router.use(isAuthenticated);

router.post('/logout', (req, res) => controller(res)(logout)(req.session));

router.put('/change-password', (req, res) =>
  controller(res)(changePassword)(req.session.user.id, req.body)
);

module.exports = router;
