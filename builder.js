module.exports = class Builder {
  constructor(router) {
    this.router = router;
    this.stack = [];
  }
  get build() {
    return this.stack;
  }
  intent(key, value) {
    this.stack.push(({ intent }) => !!(intent[key]));
    if (value) {
      this.stack.push(({ intent }) => intent[key].value === value);
    }
    return this;
  }
  do(...params) {
    this.stack.push(...params);
    return this;
  }
  reply(...params) {
    this.stack.push((_, { slack }) => slack.postBackMessage(...params));
    return this;
  }
  have(...tests) {
    this.stack.push(...tests);
    return this;
  }
  trap() {
    this.do(() => 'end');
    return this;
  }
  get when() {
    return this.router.when;
  }
};