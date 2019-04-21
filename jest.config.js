const path = require('path')

/**
 * @param {string} relativePath
 */
const resolve = relativePath => path.resolve(__dirname, relativePath)

module.exports = {
  verbose: true,
  roots: ['src'],
  testMatch: [path.join(__dirname, './src/__tests__/**/*.[jt]s?(x)')],
  testPathIgnorePatterns: [
    resolve('node_modules/'),
    resolve('src/__tests__/__utils/'),
    resolve('src/__tests__/__mocks/'),
    resolve('src/__tests__/unit/__types.js'),
  ],
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
}
