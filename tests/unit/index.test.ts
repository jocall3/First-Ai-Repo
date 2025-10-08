```typescript
import { cli } from '../../src/index';

// Mock external modules that `cli` might depend on.
// Assuming 'src/utils/arg-parser.ts' exports `parseArguments`
// and 'src/core/project-creator.ts' exports `createProject`.
jest.mock('../../src/utils/arg-parser', () => ({
  parseArguments: jest.fn(),
}));
jest.mock('../../src/core/project-creator', () => ({
  createProject: jest.fn(),
}));

// Mock console.log, console.error, and process.exit to prevent side effects during tests.
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  // Throw an error to stop test execution flow, mimicking process termination.
  throw new Error(`process.exit called with code: ${code}`);
});

// Import the mocked functions for easier access to their mock instances.
import { parseArguments } from '../../src/utils/arg-parser';
import { createProject } from '../../src/core/project-creator';

describe('cli', () => {
  // Clear all mock calls and reset mock implementations before each test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse arguments and create a project successfully', async () => {
    const mockArgs = ['--output', 'my-project', '--prompt', 'web-app'];
    const mockParsedOptions = { output: 'my-project', prompt: 'web-app', verbose: false };

    // Configure mocks for a successful run.
    (parseArguments as jest.Mock).mockReturnValue(mockParsedOptions);
    (createProject as jest.Mock).mockResolvedValue(undefined); // createProject typically returns void

    await cli(mockArgs);

    // Assertions for successful execution.
    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).toHaveBeenCalledTimes(1);
    expect(createProject).toHaveBeenCalledWith(mockParsedOptions);
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveBeenCalledWith('Project generated successfully!');
    expect(mockConsoleError).not.toHaveBeenCalled();
    expect(mockProcessExit).not.toHaveBeenCalled();
  });

  it('should handle errors during argument parsing and exit with code 1', async () => {
    const mockArgs = ['--invalid-arg'];
    const errorMessage = 'Invalid argument provided: --invalid-arg';

    // Configure mock to throw an error during parsing.
    (parseArguments as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // We expect cli to handle the error internally and call process.exit.
    // The mock process.exit throws, so we wrap in a try/catch or expect it not to throw directly
    // and instead check for process.exit being called.
    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).not.toHaveBeenCalled(); // Project creation should not happen.
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockConsoleLog).not.toHaveBeenCalled(); // Success message should not be logged.
  });

  it('should handle errors during project creation and exit with code 1', async () => {
    const mockArgs = ['--name', 'my-repo'];
    const mockParsedOptions = { name: 'my-repo', verbose: false };
    const errorMessage = 'Failed to create project directory: Permission denied.';

    // Configure mocks for parsing success but creation failure.
    (parseArguments as jest.Mock).mockReturnValue(mockParsedOptions);
    (createProject as jest.Mock).mockRejectedValue(new Error(errorMessage)); // Project creation fails.

    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).toHaveBeenCalledTimes(1);
    expect(createProject).toHaveBeenCalledWith(mockParsedOptions);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockConsoleLog).not.toHaveBeenCalled(); // Success message should not be logged.
  });

  it('should handle general unhandled errors and exit with code 1', async () => {
    const mockArgs = ['--valid'];
    const errorMessage = 'An unexpected internal error occurred.';

    // Simulate an error from a function that isn't explicitly mocked,
    // or a logic error within `cli` itself after initial setup.
    (parseArguments as jest.Mock).mockReturnValue({}); // Parse successfully
    (createProject as jest.Mock).mockImplementation(() => {
      // Simulate an error that might not be caught by explicit try/catch blocks within cli logic
      // For this test, let's assume `createProject` rejects but `cli` somehow fails to log it specifically
      // or a different internal error is thrown later.
      // A more realistic scenario for "general unhandled errors" would be an error *inside* cli itself
      // that is not related to mocked dependencies. Let's force an error by overriding a mock
      // in a way that an internal error handler would catch.
      throw new Error(errorMessage);
    });

    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});
```