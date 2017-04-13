var events = require('events'),
    util = require('util'),
    Transport = require('./transport').Transport;

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var RabbitMQ = exports.RabbitMQ = function (options) {
  Transport.call(this, options);
  options = options || {};
};

//
// Inherit from `winston.Transport`.
//
util.inherits(RabbitMQ, Transport);

//
// Expose the name of this Transport on the prototype
//
RabbitMQ.prototype.name = 'RabbitMQ';


RabbitMQ.prototype.publish = function(msg, callback) {
    var self = this;

    console.log('RabbitMQ: ' + msg);

    self.emit('logged');

    if (callback) callback(null, true);
}