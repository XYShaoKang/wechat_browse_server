const { commonConfig, resolve } = require('./jest.common.config')

module.exports = {
  ...commonConfig,
  testMatch: [resolve('./src/__tests__/unit/**/*.[jt]s?(x)')],
}
