var events = require('events'),
util = require('util'),
Transport = require('./transport').Transport;
var AWS = require('aws-sdk');

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Kinesis = exports.Kinesis = function (options) {
    Transport.call(this, options);
    this.options = options || {
        apiVersion: '2013-12-02',
        accessKeyId: 'KeyId',
        secretAccessKey: 'Access',
        region: 'us-east-1',
        streamName: 'dev'
    };

    this.kinesisClient = new AWS.Kinesis(options);
    
};

util.inherits(Kinesis, Transport);

//
// Expose the name of this Transport on the prototype
//
Kinesis.prototype.name = 'Kinesis';

Kinesis.prototype.publish = function(msg, callback) {
    var self = this;
    var str = JSON.stringify(msg);

    console.log('Transporter: Pub to %s stream (%s) - %s', self.options.streamName, this.name, str);

    var kinesisParams = {
        Data: str,
        PartitionKey: msg.MachineName,
        StreamName: self.options.streamName
    };
    
    // Publish to Kinesis client
    this.kinesisClient.putRecord(kinesisParams, callback);
}