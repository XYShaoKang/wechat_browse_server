const path = require('path')

/**
 * @param {string} relativePath
 */
const resolve = relativePath => path.resolve(__dirname, relativePath)

const commonConfig = {
  verbose: true,
  roots: ['src'],
  testPathIgnorePatterns: [
    resolve('node_modules/'),
    resolve('src/__tests__/__utils/'),
    resolve('src/__tests__/__mocks/'),
    resolve('src/__tests__/__types.js'),
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setupTests.js'],
}

module.exports = {
  commonConfig,
  resolve,
}
