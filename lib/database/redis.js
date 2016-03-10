var config = require('../../config/config'),
  redis = require('redis');

var redisClient = redis.createClient(config.cache.redis);

module.exports = redisClient;
