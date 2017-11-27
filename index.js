const Builder = require('./builder');
const merge = require('lodash.merge');

module.exports = class ChatRouter extends Builder {
  constructor(...config) {
    super();
    this.config = merge(...config);
  }
};
