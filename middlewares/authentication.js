const { verifyToken } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const { getRedis } = require('../utils');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const tokenExist = token ? await getRedis(token) : undefined;
    const decoded = tokenExist ? await verifyToken(token) : undefined;

    if (decoded) {
      req.user = decoded;
      next();
    }

    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthenticated' });
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
  }
};

module.exports = isAuthenticated;
