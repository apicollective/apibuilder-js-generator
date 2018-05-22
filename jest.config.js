module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
  ],
  coverageReporters: [
    'html',
    'text-summary',
  ],
  testMatch: [
    '<rootDir>/test/specs/**/*.js',
  ],
};
