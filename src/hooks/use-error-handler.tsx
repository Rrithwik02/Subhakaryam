import { useCallback } from 'react';
import { handleError, handleAsyncError, AppError, ErrorType } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const handleErrorWithContext = useCallback((error: unknown, operation?: string) => {
    return handleError(error, { operation, timestamp: new Date().toISOString() });
  }, []);

  const handleAsyncErrorWithContext = useCallback((operation: string) => {
    return handleAsyncError(operation);
  }, []);

  const createError = useCallback((
    message: string,
    type: ErrorType = 'general',
    userMessage?: string
  ) => {
    return new AppError(message, type, userMessage);
  }, []);

  return {
    handleError: handleErrorWithContext,
    handleAsyncError: handleAsyncErrorWithContext,
    createError,
  };
};