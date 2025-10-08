interface AppConfig {
  /**
   * The name of the application.
   * Defaults to 'PromptToProject'.
   */
  appName: string;

  /**
   * The current environment the application is running in.
   * Defaults to 'development'.
   */
  env: string;

  /**
   * The port number on which the server will listen.
   * Defaults to 3000.
   */
  port: number;

  /**
   * The minimum log level to output.
   * Defaults to 'debug' in development, 'info' in production.
   */
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  /**
   * Boolean indicating if the application is running in a production environment.
   */
  isProduction: boolean;

  // --- Example/Placeholder for future config items ---
  /**
   * Database connection URL.
   * Uncomment and configure as needed.
   * // databaseUrl: string;
   */

  /**
   * Secret key for JWTs or other cryptographic operations.
   * Uncomment and configure as needed.
   * // jwtSecret: string;
   */

  /**
   * Configuration for external services, e.g., GitHub OAuth.
   * Uncomment and configure as needed.
   * // github: {
   * //   clientId: string;
   * //   clientSecret: string;
   * // };
   */
  // --- End Example/Placeholder ---
}

const config: AppConfig = {
  appName: process.env.APP_NAME || 'PromptToProject',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  isProduction: process.env.NODE_ENV === 'production',

  // --- Example/Placeholder for future config items ---
  // databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/prompt-to-project-db',
  // jwtSecret: process.env.JWT_SECRET || 'a-very-secret-key-that-should-be-in-env-for-production', // IMPORTANT: Change default in production!
  // github: {
  //   clientId: process.env.GITHUB_CLIENT_ID || '',
  //   clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  // },
  // --- End Example/Placeholder ---
};

// --- Configuration Validation and Warnings ---

// Validate port number
if (isNaN(config.port)) {
  console.warn(`[Config] Invalid PORT environment variable '${process.env.PORT}'. Falling back to default: 3000.`);
  config.port = 3000;
}

// In non-production environments, warn about default/insecure values.
if (!config.isProduction) {
  // if (config.jwtSecret === 'a-very-secret-key-that-should-be-in-env-for-production') {
  //   console.warn('[Config] Using default JWT_SECRET. Please set JWT_SECRET environment variable for better security.');
  // }
} else {
  // --- Production-specific checks ---
  // In production, critical configurations should lead to application exit if not set correctly.
  // Uncomment and adjust these checks as your application matures.
  /*
  if (!config.jwtSecret || config.jwtSecret === 'a-very-secret-key-that-should-be-in-env-for-production') {
    console.error('[Config] ERROR: JWT_SECRET environment variable is not set or is using a default insecure value in production!');
    process.exit(1);
  }
  if (!config.databaseUrl || config.databaseUrl === 'mongodb://localhost:27017/prompt-to-project-db') {
    console.error('[Config] ERROR: DATABASE_URL environment variable is not set or is using a default local value in production!');
    process.exit(1);
  }
  if (!config.github.clientId || !config.github.clientSecret) {
    console.error('[Config] ERROR: GitHub client ID or secret not set in production!');
    process.exit(1);
  }
  */
}

export default config;