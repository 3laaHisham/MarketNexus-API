const { StatusCodes } = require('http-status-codes');
const { setRedis, getRedis } = require('../utils');

const cache = async (key, data) => {
  await setRedis(key, data);
};

const getCached = async (req, res, next) => {
  // How to concat two json files in one json?
  const key = Object.assign(req.params, req.query);

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
