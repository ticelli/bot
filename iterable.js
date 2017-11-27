module.exports = class Iterable extends Array {
  use(...params) {
    this.push(...params);
    return this;
  }
  import(...fns) {
    fns.forEach(fn => fn.call(this));
    return this;
  }
};
