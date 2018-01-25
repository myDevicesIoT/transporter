const dispatcher = require('./../index');

dispatcher.add(dispatcher.CloudPubSub, { host: 'localhost' });
dispatcher.add(dispatcher.RabbitMQ, { host: 'localhost' });

dispatcher.publish('message 1', () => {
  // Code blcok
});
