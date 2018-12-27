# transporter

Basic support for multiple transport between services for pushing data.


### Example

```javascript
const Transporter = require('transporter');

Transporter.add(Transporter.Redis, { host: 'localhost' });
Transporter.add(Transporter.Kinesis, { host: 'localhost' });

// will publish to Kinesis and Redis 
Transporter.publish('message 1', function(){
    //callback
});

```

### Adapters

- [Google PubSub](https://github.com/myDevicesIoT/pubsub-transporter)
- [RabbitMQ](https://github.com/myDevicesIoT/rabbit-transporter)

### Testing

Install all dependencies and use `npm test`
