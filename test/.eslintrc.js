const merge = require('lodash.merge');
const parent = require('../.eslintrc.js');

module.exports = merge({
  env: {
    mocha: true,
  },
  rules: {
    'global-require': 0,
    'no-unused-expressions': 0, // chai use expect format
  },
}, parent);
