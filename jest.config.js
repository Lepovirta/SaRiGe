module.exports = {
  collectCoverage: true,
  transform: {
    '\\.m?jsx?$': 'jest-esm-transformer',
  },
  testMatch: ['**/*.test.js'],
  coverageReporters: ['text', 'lcov', 'cobertura'],
  reporters: ['default', 'jest-junit'],
  testResultsProcessor: 'jest-sonar-reporter',
};
