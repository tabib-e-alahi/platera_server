import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/client.js';

export type ErrorSource = {
  field?: string;
  message: string;
  code?: string;
};

export interface IGenericErrorResponse {
  success: false;
  message: string;
  errorSource: ErrorSource[];
  debug?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

export const formatZodError = (error: ZodError): ErrorSource[] => {
  return error.issues.map((issue) => {
    const formattedIssue: ErrorSource = {
      message: issue.message,
      code: issue.code,
    };

    if (issue.path.length > 0) {
      formattedIssue.field = issue.path.join('.');
    }

    return formattedIssue;
  });
};

export const formatPrismaValidationError = (
  error: Prisma.PrismaClientValidationError,
): ErrorSource[] => {
  return [
    {
      message: error.message,
      code: 'PRISMA_VALIDATION_ERROR',
    },
  ];
};

export const formatPrismaClientRequestError = (
  error: Prisma.PrismaClientKnownRequestError,
): ErrorSource[] => {
  const errorSource: ErrorSource = {
    message: error.message,
    code: error.code,
  };

  if (Array.isArray(error.meta?.target)) {
    errorSource.field = error.meta.target.join('.');
  } else if (typeof error.meta?.target === 'string') {
    errorSource.field = error.meta.target;
  }

  switch (error.code) {
    case 'P2002':
      return [
        {
          ...errorSource,
          message: `Duplicate value for ${errorSource.field || 'unique field'}`,
        },
      ];

    case 'P2025':
      return [
        {
          ...errorSource,
          message: 'Requested record was not found',
        },
      ];

    case 'P2003':
      return [
        {
          ...errorSource,
          message: `Foreign key constraint failed on ${errorSource.field || 'related field'}`,
        },
      ];

    case 'P2000':
      return [
        {
          ...errorSource,
          message: `Value too long for ${errorSource.field || 'field'}`,
        },
      ];

    case 'P2021':
      return [
        {
          ...errorSource,
          message: 'Table does not exist in the database',
        },
      ];

    case 'P2022':
      return [
        {
          ...errorSource,
          message: 'Column does not exist in the database',
        },
      ];

    default:
      return [errorSource];
  }
};

export const formatPrismaClientInitError = (
  error: Prisma.PrismaClientInitializationError,
): ErrorSource[] => {
  return [
    {
      message: error.message,
      code: 'PRISMA_CONNECTION_ERROR',
    },
  ];
};

export const formatPrismaClientRuntimeError = (
  error:
    | Prisma.PrismaClientRustPanicError
    | Prisma.PrismaClientUnknownRequestError,
): ErrorSource[] => {
  return [
    {
      message: error.message,
      code:
        error instanceof Prisma.PrismaClientRustPanicError
          ? 'PRISMA_RUST_PANIC'
          : 'PRISMA_UNKNOWN_REQUEST_ERROR',
    },
  ];
};

export const formatGenericError = (error: Error): ErrorSource[] => {
  return [
    {
      message: error.message || 'Something went wrong',
      code: error.name || 'GENERIC_ERROR',
    },
  ];
};

export const createErrorResponse = (
  message: string,
  errorSource: ErrorSource[],
  err?: Error,
  isDevelopment = false,
): IGenericErrorResponse => {
  const response: IGenericErrorResponse = {
    success: false,
    message,
    errorSource,
  };

  if (isDevelopment && err) {
    const debug: NonNullable<IGenericErrorResponse['debug']> = {
      name: err.name,
      message: err.message,
    };

    if (err.stack) {
      debug.stack = err.stack;
    }

    response.debug = debug;
  }

  return response;
};