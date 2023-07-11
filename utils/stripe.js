require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPayment = (token, amount) =>
  stripe.paymentIntents.create(
    {
      source: token,
      amount: amount,
      currency: 'usd'
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
