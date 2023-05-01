const redis = require("redis");
const { asyncWrapper } = require("../utils/asyncWrapper");

// self invoked
let redisClient;
async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
};

const cache = async (id, data) => {
  await redisClient.setex(id, 36000, JSON.stringify(data));
};

const cachedData = async (req, res, next) => {
  const id = req.params.id;

  const cachedResults = await redisClient.get(id);
  if (cachedResults)
    res.send({
      fromCache: true,
      data: JSON.parse(cachedResults),
    });
  else next();
};

module.exports = { redisClient, cache, cachedData };
