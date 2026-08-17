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

  const bus = msg.bus;
  if (_.isNil(bus)) {
    console.error('Transporter: No bus specified');
    return callback();
  }

  //
  // Publish unconditionally. This used to be gated on GETBIT <clientId> 0, a
  // presence flag owned by the Cayenne-Streaming service. That service was
  // retired and nothing set the bit any more, so publishes were silently
  // dropped for most clients. A PUBLISH to a channel with no subscribers is
  // cheap, and the higher volume data-changed stream has always been ungated.
  //
  return self.redisClient.publish(bus, str, () => callback());
};

exports.Redis = Redis;
