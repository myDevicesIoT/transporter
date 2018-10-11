const transporter = exports;


transporter.Transport = require('./lib/transport').Transport;
transporter.Publisher = require('./lib/publisher').Publisher;
transporter.Redis = require('./lib/redis').Redis;
transporter.Kafka = require('./lib/kafka').Kafka;
transporter.Kinesis = require('./lib/kinesis').Kinesis;
transporter.EventHubs = require('./lib/event-hubs').EventHubs;

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
