var dispatcher = require('./dispatcher');

var gcc = require('./gcc');

dispatcher.add(gcc.CloudPubSub, { host: 'localhost' });

dispatcher.add(require('./rabbit').RabbitMQ, { host: 'localhost' });


dispatcher.publish('message 1', function(){
    
});