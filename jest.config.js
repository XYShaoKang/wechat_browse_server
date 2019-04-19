const path = require('path')

module.exports = {
  verbose: true,
  roots: ['src'],
  testMatch: [path.join(__dirname, './src/__tests__/**/*.[jt]s?(x)')],
  testPathIgnorePatterns: ['/node_modules/', '/__utils', '/__types'],
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
}
