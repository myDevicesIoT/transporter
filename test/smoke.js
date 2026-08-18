'use strict';

//
// Smoke test for the Redis transport publish path.
//
// Requires a reachable Redis (REDIS_HOST/REDIS_PORT, default localhost:6379).
// Run with: npm run test:smoke
//
// Stages:
//   1. Raw redis subscriber on `bus.test.smoke`; wait for the 'subscribe'
//      confirmation event before publishing anything (publishing earlier
//      silently misses the message).
//   2. Attach the Redis transport via Transporter.add and assert it is
//      actually attached (async.forEach([]) on a transportless Publisher
//      calls back immediately, so later assertions would pass vacuously).
//   3. Transporter.publish({bus, ...}, cb): cb fires with no error and the
//      subscriber receives the exact JSON string.
//   4. Transporter.publish({foo}, cb) with no bus: cb fires and the
//      subscriber receives nothing new.
//
// Exits non-zero on any failure or on a 5s timeout in any stage.
//

const redis = require('redis');

const HOST = process.env.REDIS_HOST || 'localhost';
const PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const CHANNEL = 'bus.test.smoke';
const STAGE_TIMEOUT_MS = 5000;
const DELIVERY_WAIT_MS = 200;

let stageTimer = null;

function fail(msg) {
  console.error(`[smoke] FAIL: ${msg}`);
  process.exit(1);
}

function assert(cond, msg) {
  if (!cond) {
    fail(msg);
  }
}

function stage(name) {
  console.log(`[smoke] stage: ${name}`);
  clearTimeout(stageTimer);
  stageTimer = setTimeout(() => {
    fail(`timed out after ${STAGE_TIMEOUT_MS}ms in stage: ${name}`);
  }, STAGE_TIMEOUT_MS);
}

function pass() {
  clearTimeout(stageTimer);
  console.log('[smoke] PASS: all stages completed');
  process.exit(0);
}

const received = [];

stage('subscriber connect + subscribe confirmation');
const subscriber = redis.createClient({ host: HOST, port: PORT });
subscriber.on('error', (err) => fail(`subscriber error: ${err}`));
subscriber.on('message', (channel, message) => {
  received.push({ channel, message });
});
subscriber.on('subscribe', (channel) => {
  assert(channel === CHANNEL, `subscribed to unexpected channel: ${channel}`);
  runPublishWithBus();
});
subscriber.subscribe(CHANNEL);

function runPublishWithBus() {
  stage('attach Redis transport');
  const Transporter = require('..');
  const publisher = Transporter.add(Transporter.Redis, { host: HOST, port: PORT });
  assert(
    publisher && publisher.transports && publisher.transports.Redis,
    'Redis transport is not attached to the publisher'
  );
  assert(
    publisher._names.indexOf('Redis') !== -1,
    'Redis transport is not in the publisher target list'
  );

  stage('publish with bus');
  const msg = { bus: CHANNEL, foo: 'bar' };
  const expected = JSON.stringify(msg);
  Transporter.publish(msg, (err) => {
    if (err) {
      fail(`publish callback got error: ${err}`);
    }
    setTimeout(() => {
      assert(received.length === 1, `expected 1 received message, got ${received.length}`);
      assert(
        received[0].channel === CHANNEL,
        `message arrived on unexpected channel: ${received[0].channel}`
      );
      assert(
        received[0].message === expected,
        `payload mismatch: expected ${expected}, got ${received[0].message}`
      );
      console.log(`[smoke] ok: subscriber received exact JSON ${received[0].message}`);
      runPublishNilBus();
    }, DELIVERY_WAIT_MS);
  });
}

function runPublishNilBus() {
  stage('publish with nil bus');
  const Transporter = require('..');
  Transporter.publish({ foo: 'bar' }, (err) => {
    if (err) {
      fail(`nil-bus publish callback got error: ${err}`);
    }
    setTimeout(() => {
      assert(
        received.length === 1,
        `nil-bus publish must not reach the subscriber, got ${received.length} messages`
      );
      console.log('[smoke] ok: nil-bus publish called back without publishing');
      pass();
    }, DELIVERY_WAIT_MS);
  });
}
