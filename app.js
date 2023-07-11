const express = require('express');
const { connect } = require('mongoose');
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

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(logger('dev'));
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

connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((err) => console.log(err));
