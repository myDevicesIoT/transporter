const events = require('events');
const util = require('util');
const async = require('async');

const Publisher = function func(options) {
  events.EventEmitter.call(this);
  this.configure(options);
};

exports.Publisher = Publisher;

//
// Inherit from `events.EventEmitter`.
//
util.inherits(Publisher, events.EventEmitter);

Publisher.prototype.configure = function func(options) {
  const self = this;
  this.transports = {};
  this._names = [];

  if (options.transports) {
    options.transports.forEach((transport) => {
      self.add(transport, null, true);
    }, this);
  }
};

Publisher.prototype.publish = function func(msg, callback) {
  const self = this;
  //
  // Respond to the callback.
  //
  function finish(err) {
    if (callback) {
      if (err) {
        return callback(err);
      }
      return callback(null, msg);
    }

    callback = null;
    if (!err) {
      self.emit('published', msg);
    }
  }

  //
  // Log for each transport and emit 'logging' event
  //
  function transportLog(name, next) {
    const transport = self.transports[name];
    transport.publish(msg, (err) => {
      if (err) {
        err.transport = transport;
        finish(err);
        return next();
      }

      self.emit('publishing', transport, msg);
      return next();
    });
  }

  const targets = this._names;

  async.forEach(targets, transportLog, finish);
};

Publisher.prototype.add = function func(transport, options, created) {
  let instance;
  if (created) {
    instance = transport;
  } else {
    try {
      instance = new (transport)(options);
    } catch(err) {
      throw new Error('Invalid transport');
    }
  }

  if (!instance.name && !instance.log) {
    throw new Error('Unknown transport with no publish() method');
  } else if (this.transports[instance.name]) {
    throw new Error(`Transport already attached: ${instance.name}, assign a different name`);
  }

  this.transports[instance.name] = instance;
  this._names = Object.keys(this.transports);

  //
  // Listen for the `error` event on the new Transport
  //
  instance._onError = this._onError.bind(this, instance);
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
};

Publisher.prototype._onError = function func(transport, err) {
  if (this.emitErrs) {
    this.emit('error', err, transport);
  }
};
