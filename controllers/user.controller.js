const express = require('express');
const { sendConfirmSignupEmail } = require('../utils/mailer');

const confirmSignup = (req, res) => {
  const { email } = req.body;

  // Generate the confirmation link. The actual implementation may vary depending on the application's requirements.
  const confirmationLink = `https://example.com/confirm-signup?email=${encodeURIComponent(email)}`;

  // Send the confirm signup email.
  sendConfirmSignupEmail(email, confirmationLink)
    .then(() => {
      res.status(200).json({ message: 'Confirmation email sent.' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Failed to send confirmation email.', error });
    });
};

module.exports = {
  confirmSignup,
};
