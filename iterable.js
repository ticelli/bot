module.exports = class Iterable extends Array {
  add(...params) {
    this.push(...params);
    return this;
  }
  use(...middlewares) {
    middlewares.forEach(fn => fn.call(this, this));
    return this;
  }
  dump() {
    return {
      [this.constructor.name]: [...this].map(e => (e.dump ? e.dump() : (e.constructor || e).name)),
    };
  }
};
