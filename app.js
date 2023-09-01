const express = require('express');
const session = require('express-session');
const { json, urlencoded } = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const {
  authRoute,
  userRoute,
  productRoute,
  reviewRoute,
  cartRoute,
  orderRoute
} = require('./routes');

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
// app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(
  session({
    secret: 'superSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      secure: false
    }
  })
);

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/reviews', reviewRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);

app.use('/', (req, res) => res.send('HELLO WORLD!'));
app.all('*', (req, res) => res.status(404).send('NOT FOUND'));

module.exports = app;
