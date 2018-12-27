const util = require('util');
const redis = require('redis');
const { Transport } = require('./transport');

const Redis = function func(options) {
  Transport.call(this, options);

  this.options = Object.assign({
    host: 'localhost',
    port: 6379,
    password: null,
    channel: 'data-change'
  }, options)

  let redisOpts = {
    host: this.options.host,
    port: this.options.port,
    password: this.options.password
  }

  this.redisClient = redis.createClient(redisOpts);
};

util.inherits(Redis, Transport);

//
// Expose the name of this Transport on the prototype
//
Redis.prototype.name = 'Redis';
Redis.prototype.publish = function func(msg, callback) {
  const self = this;
  const str = JSON.stringify(msg);

  const bus = msg.bus;
  if (!bus) {
    this.emit('error', new Error('No bus specified'));
    return callback();
  }

  return self.redisClient.GETBIT(msg.clientId, 0, (err, result) => {
    if (result === 0) {
      return callback();
    }
    return self.redisClient.publish(bus, str, () => callback());
  });
};

exports.Redis = Redis;
