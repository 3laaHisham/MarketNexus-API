const { createClient } = require('redis');
const { StatusCodes } = require('http-status-codes');
const HttpError = require('./HttpError');

// self invoked
let redisClient;
(async () => {
  redisClient = createClient({
    password: 'iLiUvBPms3YF0iPLmIjBW25zx3YZIt5G',
    socket: {
      host: 'redis-15759.c135.eu-central-1-1.ec2.cloud.redislabs.com',
      port: 15759
    }
  });

  redisClient.on('error', (error) => {
    console.log(`Redis error: ${error}`);
    throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Redis Error');
  });

  await redisClient.connect();
  await redisClient.ping();
})();

const setRedis = async (key, data) =>
  redisClient.set(JSON.stringify(key), JSON.stringify(data), {
    EX: 36000
  });

const getRedis = async (key) => redisClient.get(JSON.stringify(key));

const delRedis = async (key) => redisClient.del(JSON.stringify(key));

const clearRedis = async () => await redisClient.sendCommand(['FLUSHALL']);

const keyGenerator = (reqKey) => {
  const sortedKeys = Object.keys(reqKey).sort();
  const sortedKey = {};
  for (const key of sortedKeys) sortedKey[key] = reqKey[key];

  return sortedKey;
};

module.exports = { setRedis, getRedis, delRedis, clearRedis, keyGenerator };
