var events = require('events'),
    util = require('util');

//
// ### function Transport (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Tranport object responsible
// base functionality for all winston transports.
//
var Transport = exports.Transport = function (options) {
  events.EventEmitter.call(this);
};

//
// Inherit from `events.EventEmitter`.
//
util.inherits(Transport, events.EventEmitter);
