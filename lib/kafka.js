const util = require('util');
const kafka = require('kafka-node');
const Transport = require('./transport').Transport;

const Producer = kafka.HighLevelProducer;

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

    var producerOptions = {
        // Configuration for when to consider a message as acknowledged, default 1
        requireAcks: 1,
        // The amount of time in milliseconds to wait for all acks before considered, default 100ms
        ackTimeoutMs: 100,
        // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 2
        partitionerType: 3
    };

    if (this.options.producer) {
        producerOptions = options.producer;
        this.options.producer = undefined;
    }

    this.producer = new Producer(new kafka.Client(this.options.zkUri), producerOptions);

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