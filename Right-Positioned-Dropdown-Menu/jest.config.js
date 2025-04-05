// jest.config.js
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: [
    '**/dropdown.js',   // <- adjust to match the file you're testing
    '!**/node_modules/**',
    '!**/tests/**',
  ],
};