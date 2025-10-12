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

  /**
   * Database connection configuration.
   */
  database: {
    url: string;
  };

  /**
   * JSON Web Token (JWT) configuration for authentication.
   */
  jwt: {
    secret: string;
    expiresIn: string; // e.g., '1d', '7h', '30m'
  };

  /**
   * OAuth configuration for external providers like GitHub.
   * Rationale: Supports external authentication flows, which are common in modern applications.
   */
  oauth: {
    github: {
      clientId: string;
      clientSecret: string;
      callbackUrl: string;
    };
    // Future expansion: Add other OAuth providers here (e.g., google, microsoft, linkedin)
  };

  /**
   * Google Gemini AI integration configuration.
   * Rationale: Central to the "Gemini at every endpoint" requirement for semantic processing.
   */
  gemini: {
    apiKey: string;
    apiUrl: string; // Base URL for the Gemini API
    model: string; // e.g., 'gemini-pro', 'gemini-1.5-pro'
    maxOutputTokens?: number; // Optional: Maximum tokens to generate in a response.
    temperature?: number; // Optional: Controls randomness of output (0.0-1.0)
    topP?: number; // Optional: Controls diversity of output
    topK?: number; // Optional: Controls diversity of output
  };

  /**
   * Redis cache configuration.
   * Rationale: Provides a fast, distributed cache for improved performance and rate limiting.
   */
  redis: {
    url: string;
  };

  /**
   * RabbitMQ message queue configuration.
   * Rationale: Enables event-driven architecture and asynchronous processing, crucial for scalability.
   */
  rabbitmq: {
    url: string;
  };

  /**
   * Cloud asset storage configuration (e.g., S3, GCS, Azure Blob).
   * Rationale: Secure and scalable storage for user-generated content and static assets.
   */
  assetStorage: {
    provider: 's3' | 'gcs' | 'azure' | 'local';
    bucket: string;
    region?: string; // Specific to S3, GCS.
    endpoint?: string; // For S3-compatible storage like MinIO or custom endpoints.
    accessKeyId?: string; // Optional: If using explicit keys instead of IAM roles.
    secretAccessKey?: string; // Optional: If using explicit keys instead of IAM roles.
  };

  /**
   * Security-related configurations.
   */
  security: {
    passwordSaltRounds: number; // For bcrypt hashing.
  };

  /**
   * Observability configuration (tracing, metrics).
   * Rationale: Essential for monitoring, debugging, and understanding application behavior in production.
   */
  observability: {
    tracingEndpoint?: string; // OpenTelemetry collector gRPC endpoint.
    metricsExporterPort?: number; // Port for Prometheus scraping of metrics.
  };

  /**
   * Global API rate limiting configuration.
   * Rationale: Protects the API from abuse and ensures fair usage.
   */
  rateLimit: {
    windowMs: number; // Time window in milliseconds.
    maxRequests: number; // Max requests per window per IP.
  };

  /**
   * Cross-Origin Resource Sharing (CORS) configuration.
   * Rationale: Allows controlled access from web browsers on different domains (e.g., frontend).
   */
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
}

const isProductionEnv = process.env.NODE_ENV === 'production';

const config: AppConfig = {
  appName: process.env.APP_NAME || 'PromptToProject',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) || (isProductionEnv ? 'info' : 'debug'),
  isProduction: isProductionEnv,

  database: {
    // Rationale: PostgreSQL is a robust choice for production applications. Default for dev.
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/prompt-to-project-db',
  },

  jwt: {
    // Rationale: JWT secret must be a strong, unique value in production. Dev default is for convenience only.
    secret: process.env.JWT_SECRET || 'super-secret-dev-key-please-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      // Rationale: Callback URL must be explicitly configured for security and environment specific routing.
      callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
    },
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.GEMINI_MODEL || 'gemini-pro', // Rationale: 'gemini-pro' is a versatile model for general tasks.
    maxOutputTokens: process.env.GEMINI_MAX_OUTPUT_TOKENS ? parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS, 10) : undefined,
    temperature: process.env.GEMINI_TEMPERATURE ? parseFloat(process.env.GEMINI_TEMPERATURE) : undefined,
    topP: process.env.GEMINI_TOP_P ? parseFloat(process.env.GEMINI_TOP_P) : undefined,
    topK: process.env.GEMINI_TOP_K ? parseInt(process.env.GEMINI_TOP_K, 10) : undefined,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  },

  assetStorage: {
    // Rationale: 'local' for development, cloud provider in production for scalability and reliability.
    provider: (process.env.ASSET_STORAGE_PROVIDER as AppConfig['assetStorage']['provider']) || 'local',
    bucket: process.env.ASSET_STORAGE_BUCKET || 'prompt-to-project-assets-dev',
    region: process.env.ASSET_STORAGE_REGION || 'us-east-1', // Default region for S3-compatible services
    endpoint: process.env.ASSET_STORAGE_ENDPOINT,
    accessKeyId: process.env.ASSET_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.ASSET_STORAGE_SECRET_ACCESS_KEY,
  },

  security: {
    // Rationale: 10 rounds for bcrypt is a good balance between security and performance.
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10),
  },

  observability: {
    // Rationale: OpenTelemetry endpoint for distributed tracing, critical for microservices.
    tracingEndpoint: process.env.TRACING_ENDPOINT,
    // Rationale: Standard port for Prometheus to scrape metrics from applications.
    metricsExporterPort: process.env.METRICS_EXPORTER_PORT ? parseInt(process.env.METRICS_EXPORTER_PORT, 10) : 9464,
  },

  rateLimit: {
    // Rationale: More lenient rate limits in development for easier testing, stricter in production.
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || (isProductionEnv ? '60000' : '15000'), 10), // 1 minute in prod, 15 seconds in dev
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || (isProductionEnv ? '100' : '1000'), 10), // 100 requests/min in prod, 1000/15s in dev
  },

  cors: {
    // Rationale: Allow specific origins for frontend applications. In production, this should be the actual frontend domain.
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : (isProductionEnv ? ['https://your-frontend-domain.com'] : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173']),
    methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS ? process.env.CORS_ALLOWED_HEADERS.split(',') : ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
    credentials: process.env.CORS_CREDENTIALS === 'true' || true, // Rationale: Allow sending cookies and authorization headers.
  },
};

// --- Configuration Validation and Warnings ---

// Validate port number
if (isNaN(config.port)) {
  console.warn(`[Config] Invalid PORT environment variable '${process.env.PORT}'. Falling back to default: 3000.`);
  config.port = 3000;
}

// Validate passwordSaltRounds
if (isNaN(config.security.passwordSaltRounds) || config.security.passwordSaltRounds < 8) {
  console.warn(`[Config] Invalid or weak PASSWORD_SALT_ROUNDS environment variable '${process.env.PASSWORD_SALT_ROUNDS}'. Falling back to default: 10.`);
  config.security.passwordSaltRounds = 10;
}

// In non-production environments, warn about default/insecure values.
if (!config.isProduction) {
  if (config.database.url.includes('localhost') || config.database.url.includes('user:password')) {
    console.warn('[Config] Using default or local DATABASE_URL. Please set DATABASE_URL environment variable for production readiness.');
  }
  if (config.jwt.secret === 'super-secret-dev-key-please-change-in-prod') {
    console.warn('[Config] Using default JWT_SECRET. Please set JWT_SECRET environment variable for better security.');
  }
  if (!config.gemini.apiKey) {
    console.warn('[Config] GEMINI_API_KEY is not set. Gemini features might not work without it.');
  }
  if (config.redis.url.includes('localhost')) {
    console.warn('[Config] Using default or local REDIS_URL. Please set REDIS_URL environment variable for production readiness.');
  }
  if (config.rabbitmq.url.includes('localhost')) {
    console.warn('[Config] Using default or local RABBITMQ_URL. Please set RABBITMQ_URL environment variable for production readiness.');
  }
  if (config.assetStorage.provider === 'local') {
    console.warn('[Config] Using local ASSET_STORAGE_PROVIDER. Consider a cloud provider for production readiness.');
  }
  if (config.oauth.github.clientId && !config.oauth.github.clientSecret) {
    console.warn('[Config] GITHUB_CLIENT_ID is set but GITHUB_CLIENT_SECRET is missing. GitHub OAuth may not work.');
  }
  if (config.oauth.github.clientSecret && !config.oauth.github.clientId) {
    console.warn('[Config] GITHUB_CLIENT_SECRET is set but GITHUB_CLIENT_ID is missing. GitHub OAuth may not work.');
  }
} else {
  // --- Production-specific checks ---
  // Rationale: In production, critical configurations *must* be set securely and correctly.
  // Missing or insecure values should halt the application to prevent deployment issues or security vulnerabilities.

  if (!config.database.url || config.database.url.includes('localhost') || config.database.url.includes('user:password')) {
    console.error('[Config] ERROR: DATABASE_URL environment variable is not set or is using a default local/insecure value in production!');
    process.exit(1);
  }
  if (!config.jwt.secret || config.jwt.secret === 'super-secret-dev-key-please-change-in-prod') {
    console.error('[Config] ERROR: JWT_SECRET environment variable is not set or is using a default insecure value in production!');
    process.exit(1);
  }
  if (!config.gemini.apiKey) {
    console.error('[Config] ERROR: GEMINI_API_KEY environment variable is not set in production!');
    process.exit(1);
  }
  if (!config.redis.url || config.redis.url.includes('localhost')) {
    console.error('[Config] ERROR: REDIS_URL environment variable is not set or is using a default local value in production!');
    process.exit(1);
  }
  if (!config.rabbitmq.url || config.rabbitmq.url.includes('localhost')) {
    console.error('[Config] ERROR: RABBITMQ_URL environment variable is not set or is using a default local value in production!');
    process.exit(1);
  }
  if (!config.assetStorage.bucket) {
    console.error('[Config] ERROR: ASSET_STORAGE_BUCKET environment variable is not set in production!');
    process.exit(1);
  }
  if (config.assetStorage.provider !== 'local' && !config.assetStorage.region && config.assetStorage.provider === 's3') {
    console.error(`[Config] ERROR: ASSET_STORAGE_REGION environment variable is not set for ${config.assetStorage.provider} provider in production!`);
    process.exit(1);
  }
  // Rationale: If GitHub OAuth is enabled (by setting client ID), both client ID and secret are mandatory.
  if (config.oauth.github.clientId && !config.oauth.github.clientSecret) {
    console.error('[Config] ERROR: GITHUB_CLIENT_SECRET environment variable is not set in production while GITHUB_CLIENT_ID is provided!');
    process.exit(1);
  }
  if (config.oauth.github.clientSecret && !config.oauth.github.clientId) {
    console.error('[Config] ERROR: GITHUB_CLIENT_ID environment variable is not set in production while GITHUB_CLIENT_SECRET is provided!');
    process.exit(1);
  }
  // Rationale: CORS origin must be explicitly set to the production frontend domain(s) and not include localhost.
  if (!config.cors.origin || config.cors.origin.length === 0 || config.cors.origin.some(o => o.includes('localhost'))) {
    console.error('[Config] ERROR: CORS_ORIGIN is not properly configured for production. Must contain valid production frontend domain(s) and not include localhost.');
    process.exit(1);
  }
}

export default config;