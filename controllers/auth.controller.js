const { forgotPasswordEmail } = require('../utils/mailer');
const crypto = require('crypto');

const forgotPassword = async (req, res) => {
  try {
    // Generate a unique token
    const token = crypto.randomBytes(20).toString('hex');

    // Create the reset password link
    const resetPasswordLink = `http://localhost:3000/reset-password/${token}`;

    // Send the forgot password email
    await forgotPasswordEmail(req.body.email, resetPasswordLink);

    // Send a response back to the client
    res.status(200).json({ message: 'Forgot password email sent' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sending the forgot password email' });
  }
};

module.exports = {
  forgotPassword,
};
