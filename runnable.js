const Iterable = require('./iterable');

const catchSymbol = Symbol('catch');
const logSymbol = Symbol('log');

module.exports = class Runnable extends Iterable {
  async run(train, error) {
    try {
      for (const rails of this) {
        if (typeof rails === 'function') {
          await rails(train, error);
        } else {
          await rails.run(train, error);
        }
      }
    } catch (e) {
      if (!(e.isBreakInstance)) {
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

  log(...params) {
    const fns = params.filter(param => typeof param === 'function');
    const [name, level = 'info'] = params.filter(param => typeof param !== 'function').reverse();
    if (fns.length) {
      this.push(...fns.map(fn => fn.bind(fn, level, name)));
    } else if (this.constructor[logSymbol]) {
      this.push(...this.constructor[logSymbol].map(fn => fn.bind(fn, level, name)));
    }
    return this;
  }

  static addLogCallback(fn) {
    this[logSymbol] = (this[logSymbol] || []).concat(fn);
    return this;
  }

  get onError() {
    if (this.parent) {
      this.parent[catchSymbol] = new this.constructor(this.parent);
      return this.parent[catchSymbol];
    }
    this[catchSymbol] = new this.constructor(this);
    return this[catchSymbol];
  }

  dump() {
    const dump = super.dump();
    if (this[catchSymbol]) {
      dump.catchedBy = (this[catchSymbol].constructor || this[catchSymbol]).name;
    }
    return dump;
  }
};
