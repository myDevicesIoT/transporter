const events = require('events');
const util = require('util');

//
// ### function Transport (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Tranport object responsible
// base functionality for all winston transports.
//
const Transport = function func() {
  events.EventEmitter.call(this);
};

exports.Transport = Transport;

//
// Inherit from `events.EventEmitter`.
//
util.inherits(Transport, events.EventEmitter);
