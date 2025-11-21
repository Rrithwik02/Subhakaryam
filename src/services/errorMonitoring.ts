import * as Sentry from '@sentry/react';

// Configuration for error monitoring
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_ERROR_LOGGING !== 'false';

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

interface ErrorContext {
  [key: string]: any;
}

/**
 * Initialize error monitoring service (Sentry)
 */
export const initErrorMonitoring = () => {
  if (!ENABLE_LOGGING || !SENTRY_DSN) {
    console.log('Error monitoring disabled or DSN not configured');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    release: APP_VERSION,
    
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    
    // Filter out sensitive data
    beforeSend(event) {
      // Remove sensitive information
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['Cookie'];
        }
      }
      return event;
    },
    
    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
    ],
  });

  console.log(`✅ Error monitoring initialized (${ENVIRONMENT})`);
};

/**
 * Log an error to the monitoring service
 */
export const logError = (
  error: Error | string,
  context?: ErrorContext,
  severity: ErrorSeverity = 'error'
) => {
  if (!ENABLE_LOGGING) return;

  const errorToLog = typeof error === 'string' ? new Error(error) : error;

  // Add context
  if (context) {
    Sentry.setContext('additional', context);
  }

  // Set severity level
  Sentry.captureException(errorToLog, {
    level: severity,
  });

  // Also log to console in development
  if (ENVIRONMENT !== 'production') {
    console.error('📊 Error logged to monitoring:', errorToLog, context);
  }
};

/**
 * Log a warning
 */
export const logWarning = (message: string, context?: ErrorContext) => {
  if (!ENABLE_LOGGING) return;

  Sentry.captureMessage(message, {
    level: 'warning',
    contexts: context ? { additional: context } : undefined,
  });

  if (ENVIRONMENT !== 'production') {
    console.warn('⚠️ Warning logged:', message, context);
  }
};

/**
 * Log informational message
 */
export const logInfo = (message: string, context?: ErrorContext) => {
  if (!ENABLE_LOGGING) return;

  Sentry.captureMessage(message, {
    level: 'info',
    contexts: context ? { additional: context } : undefined,
  });
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (user: {
  id: string;
  email?: string;
  username?: string;
  [key: string]: any;
}) => {
  if (!ENABLE_LOGGING) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  if (!ENABLE_LOGGING) return;
  Sentry.setUser(null);
};

/**
 * Add a breadcrumb for debugging
 */
export const addBreadcrumb = (
  message: string,
  category: string = 'custom',
  level: ErrorSeverity = 'info',
  data?: ErrorContext
) => {
  if (!ENABLE_LOGGING) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
};

/**
 * Manually capture an exception
 */
export const captureException = (
  error: Error,
  context?: ErrorContext,
  tags?: Record<string, string>
) => {
  if (!ENABLE_LOGGING) return;

  Sentry.captureException(error, {
    contexts: context ? { additional: context } : undefined,
    tags,
  });
};

/**
 * Set custom tags for error context
 */
export const setTags = (tags: Record<string, string>) => {
  if (!ENABLE_LOGGING) return;

  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
};

/**
 * Check if error monitoring is enabled
 */
export const isErrorMonitoringEnabled = (): boolean => {
  return ENABLE_LOGGING && !!SENTRY_DSN;
};
