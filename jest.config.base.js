const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|tests|test).+(ts|tsx|js)',
  ],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
}
