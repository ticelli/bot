const Iterable = require('./iterable');
const Break = require('./break');

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
        throw e;
      }
      if (e.shouldBreak) {
        throw e.decreased;
      }
    }
  }
};
