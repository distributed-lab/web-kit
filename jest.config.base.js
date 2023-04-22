const baseConfig = require('./jest.config.base')
const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'))

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config, swcrc: false, exclude: [] }],
  },
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
}
