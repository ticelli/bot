const { readdirSync } = require('fs');
const { join } = require('path');

describe('Unit', () => {
  readdirSync(join(__dirname))
    .filter(f => !f.match(/^index\.js$/))
    .forEach(f => require(join(__dirname, f)));
});
