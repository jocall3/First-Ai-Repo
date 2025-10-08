module.exports = {
  // The test environment that will be used for testing.
  // 'node' for backend tests, 'jsdom' for browser-like environment (e.g., React components).
  // For a general project, 'node' is a safe default, and 'jsdom' can be specified per-test or via projects if needed.
  testEnvironment: 'node',

  // The root directory that Jest should scan for tests and modules within.
  // <rootDir> is a special token that Jest replaces with the project's root directory.
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test.
  // For example, to set up @testing-library/jest-dom for extended matchers or global mocks.
  // If you have a file like 'jest.setup.js' in your root, you'd put: ['<rootDir>/jest.setup.js']
  setupFilesAfterEnv: [],

  // An array of glob patterns indicating a set of files for which coverage information should be collected.
  // This ensures that coverage is collected for all relevant source files, even if they don't have tests.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/index.ts', // Often the main entry point doesn't need coverage itself
    '!src/types/**/*', // Type definition files
    '!src/config/**/*', // Configuration files
    '!src/database/migrations/**/*', // Database migration files
    '!src/**/__tests__/**', // Exclude test files themselves
    '!src/**/__mocks__/**', // Exclude mock files
  ],

  // The directory where Jest should output its coverage files.
  coverageDirectory: 'coverage',

  // A list of reporter names that Jest uses to format coverage reports.
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],

  // Automatically clear mock calls and instances between every test.
  // This prevents 'pollution' between tests and ensures each test starts with a clean state.
  clearMocks: true,

  // Indicates whether each individual test should be reported during the run.
  verbose: true,

  // The pattern Jest uses to detect test files.
  // This regex matches files ending with .test.js/ts/jsx/tsx or .spec.js/ts/jsx/tsx,
  // or files directly inside an __tests__ directory.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',

  // An array of file extensions your modules use. Jest will try to resolve these in order.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // A map from regular expressions to module names or to arrays of module names that allow you to stub out resources with a single module.
  // This is useful for handling path aliases (e.g., '@src/components' instead of '../../src/components')
  // or for mocking static assets like CSS/images in tests.
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    // Mock CSS/Sass/Less imports for frontend components
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock static asset imports (images, fonts)
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // A map from regular expressions to paths to transformers.
  // This configures Jest to use `ts-jest` for TypeScript files and `babel-jest` for JavaScript files.
  // Ensure 'ts-jest' and 'babel-jest' (and their respective dependencies like 'typescript', '@babel/core', '@babel/preset-env')
  // are installed in your project.
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JS/JSX files
  },

  // Configuration for 'ts-jest'. This tells 'ts-jest' to use your project's tsconfig.json.
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Path to your TypeScript configuration file
      // isolatedModules: true, // Can improve performance for some setups
    },
  },

  // If you're using watch mode, Jest can suggest test files based on changed files.
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],

  // Optional: Set a timeout for individual tests. Default is 5000ms.
  // testTimeout: 10000,
};