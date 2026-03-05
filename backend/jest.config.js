// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'], // charge les variables avant les tests
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/server.js',
    '!src/index.js'
  ]
};