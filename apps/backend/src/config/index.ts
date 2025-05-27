export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  databaseUrl: process.env.DATABASE_URL,
} as const;

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';