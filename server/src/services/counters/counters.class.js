/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [1, 2, 3];
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
