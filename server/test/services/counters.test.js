const assert = require('assert');
const app = require('../../src/app');

describe('\'counters\' service', () => {
  it('registered the service', () => {
    const service = app.service('counters');

    assert.ok(service, 'Registered the service');
  });
});
