module.exports = class AbstractResponse {
  constructor(root) {
    Object.defineProperty(this, 'root', {
      get: () => root,
    });
  }
};
