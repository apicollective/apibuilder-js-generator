module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/src/**/__tests__/**',
  ],
  coverageReporters: [
    'html',
    'text-summary',
  ],
  testMatch: [
    '**/src/**/__tests__/*.js',
  ],
};
