const { EventHubClient, aadEventHubsAudience, EventPosition } = require('@azure/event-hubs');
const util = require('util');
const Transport = require('./transport').Transport;


var EventHubs = exports.EventHubs = function (options) {
    Transport.call(this, options);
    this.options = options || {
        address: process.env.AZURE_ENDPOINT,
        topic: process.env.AZURE_EVENTHUB_NAME
     };
    const credentials = await msrestAzure.interactiveLogin({ tokenAudience: aadEventHubsAudience });
    this.client = EventHubClient.createFromAadTokenCredentials(options.address, options.topic, credentials);
};

util.inherits(EventHubs, Transport);

//
// Expose the name of this Transport on the prototype
//
EventHubs.prototype.name = 'EventHubs';

EventHubs.prototype.publish = function(msg, callback) {
    var self = this;
    const str = JSON.stringify(msg);
    console.log('Transporter: Pub to %s stream (%s) - %s', self.options.topic, this.name, str);

    //additionally we can add second parameter as partition
    await this.client.send(msg);
}