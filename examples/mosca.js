const dispatcher = require('./../index');

dispatcher.add(dispatcher.Redis, { host: 'localhost' });
dispatcher.add(dispatcher.Kafka, { host: 'localhost' });

dispatcher.publish('message 1', () => {
  // Code blcok
});
