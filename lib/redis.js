const _ = require('lodash');
const util = require('util');
const redis = require('redis');
const { Transport } = require('./transport');

const Redis = function func(options) {
  Transport.call(this, options);

  this.options = options || {
    host: 'localhost',
    port: 6379,
    password: null,
    channel: 'data-change'
  };

  this.redisClient = redis.createClient(_.pick(this.options, ['host', 'port', 'password']));
};

util.inherits(Redis, Transport);

//
// Expose the name of this Transport on the prototype
//
Redis.prototype.name = 'Redis';
Redis.prototype.publish = function func(msg, callback) {
  const self = this;
  const str = JSON.stringify(msg);
  let eventType = self.options.eventType;

  if (msg.eventType) {
    eventType = msg.eventType;
  }

  const bus = msg.bus;
  if (_.isNil(bus)) {
    console.error('Transporter: No bus specified');
    return callback();
  }

  return self.redisClient.GETBIT(msg.clientId, 0, (err, result) => {
    if (result === 0) {
      console.info('Transporter: No clients connected, not publishing message');
      return callback();
    }
    console.log(`Transporter: Pub to ${eventType} stream ${self.name} - ${str}`);
    return self.redisClient.publish(bus, str, () => callback());
  });
};

exports.Redis = Redis;
