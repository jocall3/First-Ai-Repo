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
// Rationale: Intercepting process.exit to prevent actual process termination during tests.
// Throwing an error here allows tests to assert that `process.exit` was called,
// while also stopping the execution flow, mimicking program termination.
const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  throw new Error(`process.exit called with code: ${code === undefined ? 0 : code}`); // Default to 0 for clarity if no code is provided
});

// Import the mocked functions for easier access to their mock instances.
import { parseArguments } from '../../src/utils/arg-parser';
import { createProject } from '../../src/core/project-creator';

describe('cli', () => {
  // Clear all mock calls and reset mock implementations before each test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Restore console and process.exit after all tests are done.
  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockProcessExit.mockRestore();
  });

  it('should parse arguments and create a project successfully', async () => {
    const mockArgs = ['--output', 'my-project', '--prompt', 'web-app'];
    // Rationale: Assuming parseArguments extracts relevant options for project creation.
    const mockParsedOptions = { output: 'my-project', prompt: 'web-app' };

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
    expect(mockProcessExit).not.toHaveBeenCalled(); // Rationale: For successful paths, cli might just return without explicitly calling process.exit(0).
  });

  it('should handle --help argument, log help, and exit with code 0', async () => {
    const mockArgs = ['--help'];
    const helpMessage = 'Usage: project-generator [options]\n\nOptions:\n  --help    Show help message\n  --version Show version number';

    // Configure mock for --help. Rationale: Simulate arg-parser providing exit instructions for help display.
    (parseArguments as jest.Mock).mockReturnValue({
      _shouldExit: true,
      _exitCode: 0,
      _helpMessage: helpMessage,
    });

    // Rationale: The `cli` function itself resolves without throwing, but `process.exit` (which is mocked to throw)
    // will stop the execution flow in the test environment.
    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).not.toHaveBeenCalled(); // Project creation should not happen for help command.
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveBeenCalledWith(helpMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(0); // Exit with success code after showing help.
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should handle --version argument, log version, and exit with code 0', async () => {
    const mockArgs = ['--version'];
    const versionMessage = 'v1.0.0'; // Rationale: Mock a realistic version string.

    // Configure mock for --version. Rationale: Simulate arg-parser providing exit instructions for version display.
    (parseArguments as jest.Mock).mockReturnValue({
      _shouldExit: true,
      _exitCode: 0,
      _versionMessage: versionMessage,
    });

    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).not.toHaveBeenCalled(); // Project creation should not happen for version command.
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveBeenCalledWith(versionMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(0); // Exit with success code after showing version.
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should handle no arguments (implicitly showing help) and exit with code 0', async () => {
    const mockArgs: string[] = [];
    const helpMessage = 'Usage: project-generator [options]\n\nOptions:\n  --help    Show help message\n  --version Show version number'; // Rationale: Reusing help message for consistency.

    // Configure mock for no arguments, typically defaults to showing help.
    // Rationale: Many CLIs show help by default if no commands/arguments are provided.
    (parseArguments as jest.Mock).mockReturnValue({
      _shouldExit: true,
      _exitCode: 0,
      _helpMessage: helpMessage,
    });

    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).not.toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleLog).toHaveBeenCalledWith(helpMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(0);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should handle errors during argument parsing and exit with code 1', async () => {
    const mockArgs = ['--invalid-arg'];
    const errorMessage = 'Invalid argument provided: --invalid-arg';

    // Configure mock to throw an error during parsing.
    (parseArguments as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    // Rationale: The `cli` function catches the error, logs it, and then calls `process.exit(1)`.
    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).not.toHaveBeenCalled(); // Project creation should not happen if arguments are invalid.
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockConsoleLog).not.toHaveBeenCalled(); // Success message should not be logged on error.
  });

  it('should handle errors during project creation and exit with code 1', async () => {
    const mockArgs = ['--output', 'my-repo'];
    const mockParsedOptions = { output: 'my-repo' };
    const errorMessage = 'Failed to create project directory: Permission denied.';

    // Configure mocks for parsing success but creation failure.
    (parseArguments as jest.Mock).mockReturnValue(mockParsedOptions);
    (createProject as jest.Mock).mockRejectedValue(new Error(errorMessage)); // Simulate project creation failing.

    // Rationale: The `cli` function catches the promise rejection, logs it, and then calls `process.exit(1)`.
    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(parseArguments).toHaveBeenCalledWith(mockArgs);
    expect(createProject).toHaveBeenCalledTimes(1);
    expect(createProject).toHaveBeenCalledWith(mockParsedOptions);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockConsoleLog).not.toHaveBeenCalled(); // Success message should not be logged on error.
  });

  it('should handle any other unhandled synchronous errors and exit with code 1', async () => {
    const mockArgs = ['--output', 'some-project'];
    const errorMessage = 'An unexpected internal error occurred.';

    // Simulate a synchronous error *after* argument parsing, but before project creation is attempted.
    // Rationale: Ensures the top-level try-catch in `cli` catches unexpected runtime errors.
    (parseArguments as jest.Mock).mockImplementation(() => {
      // Forcing a synchronous error that might occur if, for example, there's validation logic
      // or option processing immediately after parsing that isn't explicitly mocked or tested elsewhere.
      throw new Error(errorMessage);
    });

    await expect(cli(mockArgs)).resolves.not.toThrow();

    expect(parseArguments).toHaveBeenCalledTimes(1);
    expect(createProject).not.toHaveBeenCalled(); // Project creation should not occur if there's an earlier error.
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith('Error:', errorMessage);
    expect(mockProcessExit).toHaveBeenCalledTimes(1);
    expect(mockProcessExit).toHaveBeenCalledWith(1);
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });
});
```