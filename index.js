const transporter = exports;

transporter.Publisher = require('./lib/publisher').Publisher;
transporter.Redis = require('./lib/redis').Redis;
transporter.Kafka = require('./lib/kafka').Kafka;
transporter.Kinesis = require('./lib/kinesis').Kinesis;
transporter.CloudPubSub = require('./lib/gcc').CloudPubSub;
transporter.RabbitMQ = require('./lib/rabbit').RabbitMQ;

const defaultPublisher = new transporter.Publisher({
  transports: []
});

const methods = [
  'publish',
  'stream',
  'add',
  'remove',
  'handleExceptions',
  'unhandleExceptions'
];

methods.forEach((method) => {
  transporter[method] = function func() {
    return defaultPublisher[method](...arguments);
  };
}, this);
