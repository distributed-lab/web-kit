const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'))

module.exports = {
  ...require('../../jest.config.base.js'),

  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config, swcrc: false, exclude: [] }],
  },
};
