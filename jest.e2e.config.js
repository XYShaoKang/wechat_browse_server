const { commonConfig, resolve } = require('./jest.common.config')

module.exports = {
  ...commonConfig,
  testMatch: [resolve('./src/__tests__/e2e/*.js')],
}
