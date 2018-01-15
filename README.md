# transporter

Basic support for multiple transport between services for pushing data.


Example

```javascript
var dispatcher = require('./dispatcher');

var gcc = require('./gcc');

dispatcher.add(gcc.CloudPubSub, { host: 'localhost' });

dispatcher.add(require('./rabbit').RabbitMQ, { host: 'localhost' });

// will publish to GCC and Rabbit 
dispatcher.publish('message 1', function(){
    //callback
});

```
