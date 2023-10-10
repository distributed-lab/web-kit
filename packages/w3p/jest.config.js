module.exports = {
  ...require('../../jest.config.base.js'),
  transformIgnorePatterns: ['/node_modules\/(?!@walletconnect/modal)(.*)'],
};
