module.exports = class AbstractRouter {
  constructor(config) {
    this.config = config;
    this.stack = [];
  }

  async run(req, res) {
    stackLoop:
    for(const middlewares of this.stack) {
      for (const middleware of [].concat(middlewares)) {
        const result = await (middleware.run ? middleware.run(req, res) : middleware(req, res));
        if (result === 'end') {
          break stackLoop;
        }
        if (result === false) {
          break;
        }
      }
    }
  }
  on(...params) {
    this.stack.push(params);
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
};