var events = require('events');
var util = require('util');
var async = require('async');

var Publisher = exports.Publisher = function (options) {
  events.EventEmitter.call(this);

  this.configure(options);
}

//
// Inherit from `events.EventEmitter`.
//
util.inherits(Publisher, events.EventEmitter);


Publisher.prototype.configure = function (options) {
    var self = this;
    this.transports = {};

    this._names     = [];

    if (options.transports) {
        options.transports.forEach(function (transport) {
            self.add(transport, null, true);
        });
    }
}


Publisher.prototype.publish = function (msg, callback) {
    var self = this;
    console.log('calling publish from publisher');

  //
  // Respond to the callback.
  //
  function finish(err) {
    if (callback) {
      if (err) return callback(err);
      callback(null, msg);
    }

    callback = null;
    if (!err) {
      self.emit('logged',msg);
    }
  }
    //
  // Log for each transport and emit 'logging' event
  //
  function transportLog(name, next) {
    var transport = self.transports[name];
    transport.publish(msg, function (err) {
      if (err) {
        err.transport = transport;
        finish(err);
        return next();
      }

      self.emit('logging', transport, msg);
      next();
    });
  }

  var targets = this._names;

  async.forEach(targets, transportLog, finish);
}

Publisher.prototype.add = function (transport, options, created) {
    console.log(transport);
    var instance = created ? transport : (new (transport)(options));
    
    if (!instance.name && !instance.log) {
        throw new Error('Unknown transport with no log() method');
    }
    else if (this.transports[instance.name]) {
        throw new Error('Transport already attached: ' + instance.name + ", assign a different name");
    }

    this.transports[instance.name] = instance;
    this._names = Object.keys(this.transports);

    //
    // Listen for the `error` event on the new Transport
    //
    instance._onError = this._onError.bind(this, instance)
    if (!created) {
        instance.on('error', instance._onError);
    }

    //
    // If this transport has `handleExceptions` set to `true`
    // and we are not already handling exceptions, do so.
    //
    if (instance.handleExceptions && !this.catchExceptions) {
        this.handleExceptions();
    }

    return this;
}

Publisher.prototype._onError = function (transport, err) {
  if (this.emitErrs) {
    this.emit('error', err, transport);
  }
};
