```javascript
module.exports = {
  // Rationale: Defines the environments in which the code runs.
  // 'browser: true' for frontend code, 'node: true' for backend code.
  // 'es2022: true' enables ECMAScript 2022 global variables and syntax.
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  // Rationale: Specifies the parser to be used.
  // '@typescript-eslint/parser' is required for TypeScript files.
  parser: '@typescript-eslint/parser',
  // Rationale: Configures the parser options.
  parserOptions: {
    ecmaVersion: 2022, // Allows parsing of modern ECMAScript features.
    sourceType: 'module', // Allows for the use of imports.
    // Rationale: Required for type-aware linting rules.
    // Points to the project's tsconfig.json file, assuming it's at the root.
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true, // Enables JSX parsing for React.
    },
  },
  // Rationale: List of ESLint plugins used in this configuration.
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier', // Required for eslint-plugin-prettier.
    'security',
    'jsdoc', // For JSDoc comment enforcement.
  ],
  // Rationale: Extends a set of recommended configurations.
  // Order is important: Prettier-related configs should generally be last to avoid conflicts.
  extends: [
    'eslint:recommended', // ESLint's core recommended rules.
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint's base recommendations.
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // TypeScript ESLint rules that require type information.
    'plugin:react/recommended', // React specific recommendations.
    'plugin:react-hooks/recommended', // React Hooks specific recommendations.
    'plugin:jsx-a11y/recommended', // Accessibility rules for JSX.
    'plugin:import/recommended', // Import linting rules.
    'plugin:import/typescript', // TypeScript specific import rules.
    'plugin:security/recommended', // Basic security checks.
    'plugin:jsdoc/recommended-typescript-flavor', // JSDoc recommendations tailored for TypeScript.
    'prettier', // Rationale: Disables ESLint rules that conflict with Prettier. Must come before plugin:prettier/recommended.
    'plugin:prettier/recommended', // Rationale: Enables eslint-plugin-prettier and eslint-config-prettier. This displays Prettier errors as ESLint errors. Must be the last configuration.
  ],
  // Rationale: Settings for various plugins.
  settings: {
    react: {
      version: 'detect', // Automatically detects the React version installed.
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // Rationale: Allows 'import' plugin to resolve modules using tsconfig.json paths.
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'], // Rationale: Specify file extensions import should resolve.
      },
    },
    jsdoc: {
      tagNamePreference: {
        returns: 'return', // Rationale: Standardize JSDoc return tag.
      },
    },
  },
  // Rationale: Custom rules or overrides for extended rules.
  rules: {
    // Rationale: Enforce no-console/no-debugger in production builds for clean code and security.
    'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // Rationale: Enforce strict equality (=== and !==) for type safety and to prevent common bugs.
    'eqeqeq': ['error', 'always'],

    // Rationale: Disallow unreachable code after return, throw, continue, or break statements.
    'no-unreachable': 'error',

    // Rationale: Require consistent use of await and disallow redundant await.
    'no-return-await': 'error',

    // Rationale: Ensures promises reject with Error objects for better error handling and debugging.
    'prefer-promise-reject-errors': 'error',

    // Rationale: Essential for handling async operations correctly and preventing unhandled promise rejections.
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // Rationale: Enhance code readability and maintainability by enforcing explicit types for public functions/methods.
    '@typescript-eslint/explicit-module-boundary-types': ['warn', { allowArgumentsExplicitlyTypedAsAny: true }],
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true, allowDirectConstAssertionInArrowFunctions: true }],

    // Rationale: Prevent common type-related issues in TypeScript, improving code robustness.
    '@typescript-eslint/no-explicit-any': 'warn', // Consider 'error' for stricter projects.
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true, allowBoolean: true, allowAny: true }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/restrict-plus-operands': ['error', { checkCompoundAssignments: true }],
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],


    // Rationale: Overriding base ESLint rules with their TypeScript-aware counterparts to avoid false positives.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    'no-duplicate-imports': 'off', // Handled by 'import/no-duplicates'
    '@typescript-eslint/no-duplicate-imports': 'error', // TypeScript version for completeness

    // Rationale: React specific rules, adjusting for modern React and TypeScript.
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ and new JSX transform.
    'react/prop-types': 'off', // Not needed when using TypeScript for prop type checking.
    'react/jsx-uses-react': 'off', // Not needed with React 17+ and new JSX transform.

    // Rationale: Enforce consistent import ordering for better readability, easier code reviews, and reduced merge conflicts.
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'pathGroups': [
          {
            'pattern': '{@/shared/**,@/common/**,@/config/**}', // Shared, common utilities, configuration.
            'group': 'internal',
            'position': 'before',
          },
          {
            'pattern': '{@/features/**}', // Feature-specific modules.
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '{@/utils/**,@/helpers/**,@/constants/**,@/hooks/**}', // General utilities, helpers, constants, hooks.
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '{@/components/**,@/ui/**}', // UI components.
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '{@/assets/**,@/styles/**}', // Static assets, styles.
            'group': 'internal',
            'position': 'after',
          },
          {
            'pattern': '@/**', // Catch-all for any other project-specific aliases.
            'group': 'internal',
            'position': 'after',
          }
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always', // Rationale: Add a blank line between import groups.
        'alphabetize': {
          order: 'asc', // Rationale: Sort imports alphabetically within groups.
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error', // Rationale: Report a syntax error when a "Module not found" error occurs.
    'import/named': 'error', // Rationale: Verify named imports exist.
    'import/namespace': 'error', // Rationale: Verify that all named imports are part of the namespace.
    'import/default': 'error', // Rationale: Verify default import exists.
    'import/export': 'error', // Rationale: Report any invalid exports, e.g. multiple default exports.
    'import/no-duplicates': 'error', // Rationale: Report duplicated imports.

    // Rationale: JSDoc for better documentation, especially for public APIs and complex logic.
    'jsdoc/require-returns-description': 'off', // Rationale: Often redundant when TypeScript types provide sufficient detail.
    'jsdoc/require-param-description': 'off', // Rationale: Often redundant when TypeScript types provide sufficient detail.
    'jsdoc/require-jsdoc': [
      'warn',
      {
        publicOnly: true, // Rationale: Only require JSDoc for exported entities.
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: true,
        },
        contexts: [
          'VariableDeclarator[id.type="Identifier"][init.type=/FunctionExpression|ArrowFunctionExpression/]',
          'TSDeclareFunction',
          'TSMethodSignature',
          'TSPropertySignature',
        ],
      },
    ],
    'jsdoc/check-indentation': 'warn',
    'jsdoc/no-bad-blocks': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/empty-block-tag-lines': ['warn', 'always', { tags: ['example'] }],
    'jsdoc/require-description': ['warn', { contexts: ['FunctionDeclaration', 'ClassDeclaration', 'MethodDefinition'] }],
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-param-names': 'warn',

    // Rationale: General code quality and maintainability rules.
    'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreComments: false, ignoreRegExpLiterals: true, ignoreStrings: true, ignoreTemplateLiterals: true }], // Rationale: Enforce a reasonable line length for readability.
    'prefer-const': ['error', { destructuring: 'all' }], // Rationale: Encourage using const for variables that are not reassigned.
    'no-var': 'error', // Rationale: Disallow var; prefer const or let.
    'object-shorthand': ['error', 'always'], // Rationale: Enforce object shorthand syntax.
    'prefer-template': 'error', // Rationale: Prefer template literals over string concatenation.
    'array-callback-return': ['error', { allowImplicit: true }], // Rationale: Enforce return statements in array callbacks.
    'no-lonely-if': 'error', // Rationale: Disallow if statements as the only statement in an else block.
    'no-else-return': ['error', { allowElseIf: false }], // Rationale: Disallow redundant else-if and else return statements.
    'complexity': ['warn', { max: 10 }], // Rationale: Limit cyclomatic complexity for functions to improve testability and readability.
    'max-depth': ['warn', { max: 4 }], // Rationale: Limit the maximum depth of nested blocks.
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }], // Rationale: Limit the number of lines in a file.
    'max-params': ['warn', { max: 4 }], // Rationale: Limit the number of parameters in a function.
    'max-statements': ['warn', { max: 15 }], // Rationale: Limit the number of statements in a function.
    'curly': 'error', // Rationale: Enforce consistent brace style for all control statements (if, else, for, while, do).
    'no-useless-rename': 'error', // Rationale: Disallow renaming import, export, and destructuring assignments to the same name.
    'default-case-last': 'error', // Rationale: Enforce the default clause in a switch statement to be the last.
  },
  // Rationale: Apply different rule sets to specific files or directories.
  overrides: [
    {
      // Rationale: Configuration for plain JavaScript files.
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        // Rationale: Disable TypeScript-specific rules for JavaScript files where they are not applicable.
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-for-in-array': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/unbound-method': 'off',
        // 'jsdoc/require-param-type': 'off', // Can be useful for JS projects.
        // 'jsdoc/require-returns-type': 'off', // Can be useful for JS projects.

        // Rationale: Re-enable original ESLint rules that were turned off for TypeScript.
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
        'no-shadow': 'error',
        'no-redeclare': 'error',
      },
    },
    {
      // Rationale: Configuration for backend (Node.js) TypeScript files.
      files: ['src/server/**/*.ts', 'src/api/**/*.ts', 'scripts/**/*.ts', 'test/server/**/*.ts'],
      env: {
        browser: false,
        node: true,
      },
      rules: {
        // Rationale: Disable frontend-specific React/JSX rules for backend files.
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'off',
        'jsx-a11y/alt-text': 'off',
        'jsx-a11y/anchor-has-content': 'off',
        'jsx-a11y/aria-role': 'off',
        'jsx-a11y/img-redundant-alt': 'off',
        // Add more backend-specific rules or disable frontend ones as needed.
      },
    },
    {
      // Rationale: Configuration for frontend (React) TypeScript files.
      files: ['src/client/**/*.ts', 'src/client/**/*.tsx'],
      env: {
        browser: true,
        node: false,
      },
      rules: {
        // Add any additional frontend-specific rules here.
        // For example, if using Next.js, you might add 'next/no-img-element'
      },
    },
    {
      // Rationale: Configuration for test files to relax certain rules.
      files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx', '**/*.spec.tsx'],
      env: {
        jest: true, // Rationale: Enables Jest global variables.
        node: true,
        browser: true, // For client-side tests.
      },
      rules: {
        'no-console': 'off', // Rationale: Allow console.log in tests for debugging.
        '@typescript-eslint/explicit-function-return-type': 'off', // Rationale: Allow implicit return types in tests.
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off', // Rationale: More flexibility with 'any' in tests.
        'jsdoc/require-jsdoc': 'off', // Rationale: No need for JSDoc in tests.
      },
    },
  ],
  // Rationale: Specifies files and folders to ignore from linting.
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.vscode/',
    '.idea/',
    'tmp/',
    'logs/',
    'generated/', // Rationale: Ignore auto-generated code.
    'coverage/', // Rationale: Ignore test coverage reports.
    'public/', // Rationale: Ignore static assets in root.
    'src/client/public/', // Rationale: Ignore client-specific static assets.
  ],
};
```