const Iterable = require('./iterable');
const Break = require('./break');

const catchSymbol = Symbol('catch');

module.exports = class Runnable extends Iterable {
  async run(train) {
    try {
      for (const rails of this) {
        if (typeof rails === 'function') {
          await rails(train); // eslint-disable-line no-await-in-loop
        } else {
          await rails.run(train); // eslint-disable-line no-await-in-loop
        }
      }
    } catch (e) {
      if (!(e instanceof Break)) {
        if (!this[catchSymbol]) {
          throw e;
        }
        if (typeof this[catchSymbol] === 'function') {
          await this[catchSymbol](train, e);
        } else {
          await this[catchSymbol].run(train, e);
        }
      }
      if (e.shouldBreak) {
        throw e.decreased;
      }
    }
  }
  catch(fn) {
    this[catchSymbol] = fn;
    return this;
  }
};
