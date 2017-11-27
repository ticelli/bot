module.exports = class Train extends Array {
  constructor(...ctx) {
    super();
    this.hang(...ctx);
  }

  hang(...objects) {
    this.push(...objects);
    return this;
  }

  get proxy() {
    return new Proxy(this, {
      get(targets, name) {
        if (name in targets) {
          return targets[name];
        }
        for (const target of targets) {
          if (name in target) {
            return target[name];
          }
        }
        return undefined;
      },
      set(targets, name, value) {
        for (const target of targets) {
          if (name in target) {
            target[name] = value;
            return true;
          }
        }
        targets[name] = value;
        return true;
      },
    });
  }
};
