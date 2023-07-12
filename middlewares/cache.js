const { StatusCodes } = require('http-status-codes');
const { setRedis, getRedis } = require('../utils');

const cache = async (id, data) => {
  await setRedis(id, data);
};

const getCached = async (req, res, next) => {
  const id = req.user.id;

  const cachedResults = await getRedis(id);
  if (cachedResults)
    res.send({
      status: StatusCodes.OK,
      message: 'Retrieved data from cache',
      result: JSON.parse(cachedResults)
    });
  else next();
};

module.exports = { cache, getCached };
