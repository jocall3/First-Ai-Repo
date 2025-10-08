```javascript
module.exports = {
  env: {
    node: true, // Enables Node.js global variables and Node.js scoping.
    es2022: true, // Adds all ECMAScript 2022 globals and automatically sets the `ecmaVersion` parser option to 13.
  },
  extends: [
    'eslint:recommended', // Uses the recommended rules from ESLint
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display Prettier errors as ESLint errors. Make sure this is always the last configuration in the `extends` array.
  ],
  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // Custom rules can be added or overridden here
    // Example: Disallow console.log in production environments
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Example: Disallow debugger statements in production environments
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Example: Enforce strict equality (=== and !==)
    'eqeqeq': ['error', 'always'],
    // Example: Require JSDoc comments for functions (optional, but good practice)
    // 'valid-jsdoc': ['warn', {
    //   'requireReturn': false,
    //   'requireParamDescription': false,
    //   'requireReturnDescription': false
    // }],
  },
  // Files and folders to ignore from linting
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.vscode/',
    '.idea/',
    'tmp/',
    'logs/',
  ],
};
```