module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  testTimeout: 15000, // 15 secondes au lieu de 5
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/server.js',
    '!src/index.js'
  ]
};