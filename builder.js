const Runnable = require('./runnable');
const Break = require('./break.js');

module.exports = class Builder extends Runnable {
  constructor(parent) {
    super();
    this.parent = parent;
  }

  get root() {
    if (this.parent) {
      return this.parent.root;
    }
    return this;
  }

  stop() {
    this.push(() => { throw Break.all; });
    return this;
  }

  throw(...data) {
    this.push(() => { throw new Error(...data); });
    return this;
  }

  assert(middleware) {
    this.push(async (train) => { if (!(await middleware(train))) { throw Break.once; } });
    return this;
  }

  intent(name, value) {
    return this.assert(({ intents }) => !!(intents && intents[name] && (!value || intents[name].includes(value))));
  }
};
