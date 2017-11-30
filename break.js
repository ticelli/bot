const forever = Symbol('∞');

module.exports = class Break {
  constructor(value) {
    this.state = value;
  }

  get decreased() {
    if (this.state !== forever) {
      this.state -= 1;
    }
    return this;
  }

  get shouldBreak() {
    return this.state === forever || this.state > 0;
  }

  static get all() {
    return new this(forever);
  }

  static get once() {
    return new this(0);
  }

  get isBreakInstance() {
    return true
  }
};
