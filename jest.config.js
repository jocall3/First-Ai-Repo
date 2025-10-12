```javascript
module.exports = {
  // The test environment that will be used for testing.
  // 'node' is suitable for backend services (Node.js applications).
  testEnvironment: 'node',

  // The root directories that Jest should scan for tests and modules within.
  // '<rootDir>' is a special token Jest replaces with the project's root directory.
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test.
  // This is useful for global mocks, extending Jest matchers, or setting up environment variables.
  // For a backend project, this might include setting up database connections or mocking external APIs.
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],

  // An array of glob patterns indicating a set of files for which coverage information should be collected.
  // This helps ensure that coverage is collected for all relevant source files, even if they don't have explicit tests yet.
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/index.ts', // Often the main entry point doesn't contain logic that needs coverage
    '!src/types/**/*', // Exclude type definition files
    '!src/config/**/*', // Exclude configuration files
    '!src/database/migrations/**/*', // Exclude database migration files (infrastructure)
    '!src/**/__tests__/**', // Exclude test files themselves
    '!src/**/__mocks__/**', // Exclude mock implementation files
    '!src/server.ts', // Entry point for starting the server, typically no testable logic
  ],

  // The directory where Jest should output its coverage files.
  coverageDirectory: 'coverage',

  // A list of reporter names that Jest uses to format coverage reports.
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],

  // Automatically clear mock calls, instances, and results between every test.
  // This prevents test pollution and ensures each test starts with a clean state.
  clearMocks: true,

  // Indicates whether each individual test should be reported during the run.
  // Setting this to true provides more detailed output in CI/CD environments.
  verbose: true,

  // The pattern Jest uses to detect test files.
  // This regex matches files ending with .test.ts/js or .spec.ts/js, or files directly inside an __tests__ directory.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)$',

  // An array of file extensions your modules use. Jest will try to resolve these in order.
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // A map from regular expressions to module names or to arrays of module names that allow you to stub out resources with a single module.
  // This is crucial for handling path aliases defined in tsconfig.json (e.g., '@src/services' instead of '../../src/services').
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Alias for the source directory
    '^@tests/(.*)$': '<rootDir>/tests/$1', // Alias for the tests directory
    // For a backend project, typically no need to mock CSS/image assets unless specifically testing frontend-like components within Node.
  },

  // A map from regular expressions to paths to transformers.
  // This configures Jest to use `ts-jest` for TypeScript files, allowing seamless testing of TypeScript code.
  // Ensure 'ts-jest' is installed. For a pure TypeScript backend, 'babel-jest' might not be strictly necessary
  // if all JavaScript is transpiled from TypeScript, but it's kept here for broader compatibility or mixed projects.
  transform: {
    '^.+\\.(ts)$': 'ts-jest', // Use ts-jest for TypeScript files
    '^.+\\.(js)$': 'babel-jest', // Use babel-jest for JavaScript files (if any are not transpiled from TS or need specific Babel transforms)
  },

  // Configuration for 'ts-jest'. This tells 'ts-jest' to use your project's tsconfig.json.
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Path to your TypeScript configuration file
      // isolatedModules: true, // Can improve performance by running transpilation in isolation, but might hide type errors
    },
  },

  // Optional: Set a timeout for individual tests. Default is 5000ms.
  // Increasing this might be necessary for integration tests involving I/O or external services.
  // testTimeout: 10000,
};
```