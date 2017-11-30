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
        switch (typeof this[catchSymbol]) {
          case 'function':
            await this[catchSymbol](train, e);
            break;
          case 'object':
            await this[catchSymbol].run(train, e);
            break;
          default:
            throw e;
        }
      }
      if (e.shouldBreak) {
        throw e.decreased;
      }
    }
  }

  catch(fn) {
    if (this.parent) {
      this.parent[catchSymbol] = fn;
    } else {
      this[catchSymbol] = fn;
    }
    return this;
  }

  get onError() {
    if (this.parent) {
      this.parent[catchSymbol] = new this.constructor(this);
      return this.parent[catchSymbol];
    }
    this[catchSymbol] = new this.constructor(this);
    return this[catchSymbol];
  }
};
