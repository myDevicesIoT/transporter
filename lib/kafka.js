const events = require('events');
const util = require('util');
const kafka = require('kafka-node');
const Transport = require('./transport').Transport;

const Producer = kafka.Producer;

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Kafka = exports.Kafka = function (options) {
    Transport.call(this, options);
    this.options = options || {
       zkUri: 'localhost:2181',
       topic: 'kafka_transporter_topic'
    };

    this.producer = new Producer(new kafka.Client(this.options.zkUri));

};

util.inherits(Kafka, Transport);

//
// Expose the name of this Transport on the prototype
//
Kafka.prototype.name = 'Kafka';

Kafka.prototype.publish = function(msg, callback) {
    var self = this;
    var str = JSON.stringify(msg);

    console.log('Transporter: Pub to %s stream (%s) - %s', self.options.topic, this.name, str);

    this.producer.send([{ 
        "topic": this.options.topic, 
        "messages":[str]
    }], callback);
}