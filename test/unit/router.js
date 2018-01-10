const ChatRouter = require('../../index.js');
const { expect } = require('chai');

describe('> Choice', () => {
  it('# Config should be set', async () => {
    const config = {
      foo: true,
      bar: false,
    };
    const router = new ChatRouter({ foo: config.foo }, { bar: config.bar });
    expect(router.config).to.be.deep.equal(config);
  });
});
