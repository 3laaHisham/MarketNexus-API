const { createClient } = require("redis");

// self invoked
let redisClient;
async () => {
  redisClient = createClient({
    password: "iLiUvBPms3YF0iPLmIjBW25zx3YZIt5G",
    socket: {
      host: "redis-15759.c135.eu-central-1-1.ec2.cloud.redislabs.com",
      port: 15759,
    },
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
};

const setRedis = async (key, data) =>
  await redisClient.set(key, JSON.stringify(data), {
    EX: 36000,
    NX: true,
  });

const getRedis = async (key) => redisClient.get(key);

const delRedis = async (key) => redisClient.del(key);

module.exports = { setRedis, getRedis, delRedis };
