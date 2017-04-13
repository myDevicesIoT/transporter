var dispatcher = exports;

dispatcher.Publisher  = require('./publisher').Publisher;

var defaultPublisher = new dispatcher.Publisher({
  transports: []
});

var methods = [
  'publish',
  'stream',
  'add',
  'remove',
  'handleExceptions',
  'unhandleExceptions',
];
methods.forEach(function (method) {
  dispatcher[method] = function () {
    return defaultPublisher[method].apply(defaultPublisher, arguments);
  };
});