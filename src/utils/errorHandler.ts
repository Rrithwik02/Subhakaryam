import { toast } from '@/hooks/use-toast';

export type ErrorType = 'auth' | 'network' | 'validation' | 'general';

interface ErrorContext {
  operation?: string;
  userId?: string;
  timestamp?: string;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly context?: ErrorContext;
  public readonly userMessage: string;

  constructor(
    message: string,
    type: ErrorType = 'general',
    userMessage?: string,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.userMessage = userMessage || this.getDefaultUserMessage(type);
    this.context = context;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    switch (type) {
      case 'auth':
        return 'Authentication failed. Please try logging in again.';
      case 'network':
        return 'Network error. Please check your connection and try again.';
      case 'validation':
        return 'Please check your input and try again.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}

export const handleError = (error: unknown, context?: ErrorContext) => {
  // In production, you would send this to an error reporting service

  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    // Determine error type based on error message or other properties
    let type: ErrorType = 'general';
    
    if (error.message.includes('auth') || error.message.includes('login')) {
      type = 'auth';
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      type = 'network';
    }

    appError = new AppError(error.message, type, undefined, context);
  } else {
    appError = new AppError('Unknown error occurred', 'general', undefined, context);
  }

  // Show user-friendly message
  toast({
    title: "Error",
    description: appError.userMessage,
    variant: "destructive",
  });

  return appError;
};

export const handleAsyncError = (operation: string) => {
  return (error: unknown) => {
    return handleError(error, { operation, timestamp: new Date().toISOString() });
  };
};