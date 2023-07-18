const { StatusCodes } = require('http-status-codes');
const { getRedis, keyGenerator } = require('../utils');

const getCached = (route, query) => async (req, res, next) => {
  const reqKey = { route, ...query };
  const sortedKey = keyGenerator(reqKey);

  const cachedResults = await getRedis(sortedKey);
  if (cachedResults)
    res.send({
      status: StatusCodes.OK,
      message: 'Retrieved data from cache',
      result: JSON.parse(cachedResults)
    });
  else next();
};

module.exports = { getCached };
