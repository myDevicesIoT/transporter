var events = require('events'),
    util = require('util'),
    Transport = require('./transport').Transport;

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var CloudPubSub = exports.CloudPubSub = function (options) {
  Transport.call(this, options);
  options = options || {};
};

//
// Inherit from `winston.Transport`.
//
util.inherits(CloudPubSub, Transport);

//
// Expose the name of this Transport on the prototype
//
CloudPubSub.prototype.name = 'CloudPubSub';


CloudPubSub.prototype.publish = function(msg, callback) {
    var self = this;

    console.log('CloudPubSub: ' + msg);
    
    self.emit('logged');

    if (callback) callback(null, true);
}