const { expect } = require('code');

let Transporter = require('./../index');

class TestExtension extends Transporter.Transport {
  constructor(options) {
    super(options);

    this.name = options.name
      ? options.name
      : this.constructor.name;
    this.options = options;

    if (this.options.fail) {
      throw new Error('Failed to instantiate');
    }
  }

  publish(msg, callback) {
    console.log(`${this.name} publishing`);
    return callback();
  }
}

class PromiseExtension extends Transporter.Transport {
  constructor(options) {
    super(options);

    this.name = options.name
      ? options.name
      : this.constructor.name;
    this.options = options;
    this.failed = false;

    const self = this;
    new Promise(function(resolve, reject) {
      return setTimeout(function() {
        if (self.options.fail) {
          return reject('Forced promise fail');
        }
        return resolve('passed');
      }, 500)
    }).then(() => Promise.resolve())
      .catch((err) => {
        self.emit('error', err);
        self.failed = true;
      });
  }

  publish(msg, callback) {
    if (this.failed) {
      this.emit('error', new Error(`${this.name} failed to instantiate`));
      return callback();
    }
    console.log(`${this.name} publishing`);
    return callback();
  }
}

describe('Transporter Tests', () => {
  afterEach(() => {
    delete require.cache[require.resolve('./../index')];
    Transporter = require('./../index');
  });

  it('Should add a new transport', async () => {
    Transporter.add(TestExtension, { opt: 'first', emitErrs: true });
    Transporter.publish({});
  });

  it('Should chain transport additions', async () => {
    Transporter
      .add(TestExtension, { emitErrs: true })
      .add(TestExtension, { name: 'AnotherExtension', opt: 'some opt', emitErrs: true });
  });

  it('Should throw an error on instantiate', async () => {
    expect(() => Transporter.add(TestExtension, { fail: true, emitErrs: true })).to.throw(Error, 'Invalid transport');
  });

  it('Should catch failed promise extensions', async () => {
    Transporter.on('error', (err, transport) => {
      console.log(`error from ${transport.name}: ${err}`);
    });
    Transporter.add(PromiseExtension, { fail: true, emitErrs: true });

    await new Promise(resolve => setTimeout(resolve, 1000));
    Transporter.publish({});
  });
});
