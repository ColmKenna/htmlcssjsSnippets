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
    '**/*.js',   // <- adjust to match the file you're testing
    '!**/coverage/**', // Exclude coverage directory,
    '!**/node_modules/**',
    '!**/tests/**',
  ],
};