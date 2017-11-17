const Builder = require('./builder');

module.exports = class AbstractRouter {
  constructor(config) {
    this.config = config;
    this.stack = [];
  }

  async run(req, res) {
    stackLoop:
    for(const middlewares of this.stack) {
      for (const middleware of [].concat(middlewares instanceof Builder ? middlewares.build : middlewares)) {
        const result = await (middleware.run ? middleware.run(req, res) : middleware(req, res));
        if (result === 'end') {
          break stackLoop;
        }
        if (result === false) {
          break;
        }
      }
    }
    return this;
  }

  trap(...params) {
    return this.on(...params, () => 'end');
  }

  on(...params) {
    this.stack.push(params);
    return this;
  }

  onBuild(builder) {
    this.stack.push(builder);
    return this;
  }

  use(extend) {
    switch (typeof extend) {
      case 'function':
        extend.call(this, this);
        break;
      case 'object':
        this.stack.push(extend);
        break;
      default:
        throw new Error('extend type');
    }
    return this;
  }

  get when() {
    const builder = new Builder(this);
    this.onBuild(builder);
    return builder;
  }
};