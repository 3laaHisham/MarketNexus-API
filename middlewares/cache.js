const { StatusCodes } = require('http-status-codes');
const { getRedis, keyGenerator } = require('../utils');

const getCached = (res, next) => async (route, query) => {
  const reqKey = { route, ...query };
  const sortedKey = keyGenerator(reqKey);

  const cachedResults = await getRedis(sortedKey);
  if (cachedResults)
    return res.send({
      status: StatusCodes.NOT_MODIFIED,
      message: 'Retrieved data from cache',
      result: JSON.parse(cachedResults)
    });
  else return next();
};

module.exports = { getCached };
