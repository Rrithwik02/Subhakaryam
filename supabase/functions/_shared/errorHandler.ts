/**
 * Centralized error handling for Supabase Edge Functions
 * Prevents information leakage by returning generic errors to clients
 * while logging detailed errors server-side
 */

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Operation errors
  OPERATION_FAILED = 'OPERATION_FAILED',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Generic
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: 'Authentication required. Please log in and try again.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorCode.INVALID_INPUT]: 'The provided input is invalid. Please check your data and try again.',
  [ErrorCode.MISSING_PARAMETER]: 'Required information is missing. Please provide all required fields.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.ALREADY_EXISTS]: 'This resource already exists.',
  [ErrorCode.OPERATION_FAILED]: 'The operation could not be completed. Please try again.',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service error occurred. Please try again later.',
  [ErrorCode.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again later.',
};

/**
 * Creates a standardized error response
 * @param code - The error code enum
 * @param detailedError - Detailed error for server-side logging (not sent to client)
 * @param customMessage - Optional custom user-facing message
 */
export function createErrorResponse(
  code: ErrorCode,
  detailedError?: unknown,
  customMessage?: string
): { response: ErrorResponse; status: number } {
  // Log detailed error server-side
  if (detailedError) {
    console.error(`[${code}]`, detailedError);
  }

  // Determine HTTP status code
  const statusMap: Record<ErrorCode, number> = {
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.FORBIDDEN]: 403,
    [ErrorCode.NOT_FOUND]: 404,
    [ErrorCode.ALREADY_EXISTS]: 409,
    [ErrorCode.INVALID_INPUT]: 400,
    [ErrorCode.MISSING_PARAMETER]: 400,
    [ErrorCode.OPERATION_FAILED]: 500,
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
    [ErrorCode.INTERNAL_ERROR]: 500,
  };

  return {
    response: {
      success: false,
      error: {
        code,
        message: customMessage || ERROR_MESSAGES[code],
      },
    },
    status: statusMap[code] || 500,
  };
}

/**
 * Validates required parameters exist
 * @param params - Object containing parameters to validate
 * @param requiredFields - Array of required field names
 * @returns Error response if validation fails, null otherwise
 */
export function validateRequiredParams(
  params: Record<string, unknown>,
  requiredFields: string[]
): { response: ErrorResponse; status: number } | null {
  const missing = requiredFields.filter((field) => !params[field]);
  
  if (missing.length > 0) {
    console.error('Missing required parameters:', missing);
    return createErrorResponse(
      ErrorCode.MISSING_PARAMETER,
      `Missing fields: ${missing.join(', ')}`
    );
  }
  
  return null;
}

/**
 * Validates UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates numeric value
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
