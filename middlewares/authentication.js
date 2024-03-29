const { verifyToken } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const { getRedis } = require('../utils');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.session.token;

    const tokenExist = token ? await getRedis(token) : undefined;
    const decoded = tokenExist ? await verifyToken(token) : undefined;

    if (decoded) {
      req.session.user = decoded;
      return next();
    }

    // console.log(token ? true : false);
    // console.log(tokenExist ? true : false);
    // console.log(decoded ? true : false);
    // console.log('----------------------------');

    res.status(StatusCodes.UNAUTHORIZED).send('Unauthenticated');
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
  }
};

module.exports = { isAuthenticated };
