module.exports = class AbstractRequest {
  constructor(root) {
    Object.defineProperty(this, 'root', {
      get: () => root,
    });
  }
};