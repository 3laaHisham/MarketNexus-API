const { StatusCodes } = require('http-status-codes');
const { setRedis, getRedis } = require('../utils');

const cache = async (key, data) => {
  await setRedis(key, data);
};

const getCached = (route) => async (req, res, next) => {
  const key = Object.assign(route, req.query);

  const cachedResults = await getRedis(key);
  if (cachedResults)
    res.send({
      status: StatusCodes.OK,
      message: 'Retrieved data from cache',
      result: JSON.parse(cachedResults)
    });
  else next();
};

module.exports = { cache, getCached };
