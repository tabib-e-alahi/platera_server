# Global Error Handler Documentation

## Overview
This is a comprehensive error handling system with support for:
- ✅ Zod validation errors
- ✅ Custom application errors
- ✅ Cookie errors
- ✅ CORS errors
- ✅ Prisma errors (validation, request, initialization, runtime)
- ✅ Generic JavaScript errors (TypeError, SyntaxError, ReferenceError, etc.)
- ✅ Slack error logging for production

## File Structure
```
src/
├── errors/
│   └── AppError.ts           # Custom error classes
├── middlewares/
│   ├── globalErrorHandler.ts # Main error handler middleware
│   └── notFoundHandler.ts    # 404 handler
├── utils/
│   ├── errorFormatter.ts     # Error formatting utilities
│   └── errorLogger.ts        # Slack & console logging
└── app.ts                    # Express app with integrated handlers
```

## Error Classes

### AppError (Base custom error)
All custom errors extend this base class.

```typescript
import { AppError } from './errors/AppError.js';

throw new AppError('Something went wrong', 400);
```

### Predefined Error Classes

```typescript
// Validation Error (400)
import { ValidationError } from './errors/AppError.js';
throw new ValidationError('Invalid input');

// Not Found Error (404)
import { NotFoundError } from './errors/AppError.js';
throw new NotFoundError('User not found');

// Unauthorized Error (401)
import { UnauthorizedError } from './errors/AppError.js';
throw new UnauthorizedError('Authentication required');

// Forbidden Error (403)
import { ForbiddenError } from './errors/AppError.js';
throw new ForbiddenError('Access denied');

// Conflict Error (409)
import { ConflictError } from './errors/AppError.js';
throw new ConflictError('Email already exists');

// Cookie Error (400)
import { CookieError } from './errors/AppError.js';
throw new CookieError('Invalid cookie');

// CORS Error (403)
import { CORSError } from './errors/AppError.js';
throw new CORSError('CORS policy violation');
```

## Usage Examples

### Example 1: Throwing Custom Errors in Routes

```typescript
import express, { Router, Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      throw new ValidationError('Email and name are required');
    }
    
    res.status(201).json({ success: true, data: { email, name } });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

export default router;
```

### Example 2: Using Zod for Validation

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const router = Router();

// Define schema
const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.number().int().positive('Age must be positive'),
});

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
  try {
    // This will throw ZodError if validation fails
    const validatedData = createUserSchema.parse(req.body);
    
    res.status(201).json({ success: true, data: validatedData });
  } catch (error) {
    next(error); // Zod errors are automatically caught and formatted
  }
});

export default router;
```

### Example 3: Handling Prisma Errors

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ValidationError, NotFoundError } from '../errors/AppError.js';

const router = Router();

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    // Prisma errors are automatically caught and formatted
    next(error);
  }
});

router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Example 4: Using Async Wrapper

For cleaner code, create an async wrapper:

```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
import { asyncHandler } from '../utils/asyncHandler.js';

router.get(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    
    res.status(200).json({ success: true, data: user });
  }),
);
```

## Error Response Format

All errors return this standardized format:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSource": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string"
    }
  ],
  "slack": {
    "timestamp": "2024-04-06T10:30:00.000Z",
    "errorType": "ZodError",
    "statusCode": 400
  }
}
```

In development mode, `err` field is included with full error details.

## Supported Prisma Error Codes

The error handler includes human-readable messages for all common Prisma error codes:

- **P2000**: Value too long for column
- **P2001**: Record not found in where condition
- **P2002**: Unique constraint failed (returns 409 Conflict)
- **P2003**: Foreign key constraint failed
- **P2004**: Constraint violation
- **P2005**: Invalid value for field type
- **P2006**: Invalid value provided
- **P2007**: Data validation error
- **P2008**: Query parsing failed
- **P2009**: Query validation failed
- **P2010**: Raw query failed
- **P2011**: Null constraint violation
- **P2012**: Missing required value
- **P2013**: Missing argument for field
- **P2014**: Would violate relation requirement
- **P2015**: Related record not found
- **P2016**: Query interpretation error
- **P2017**: Records not connected
- **P2018**: Required records not found
- **P2019**: Input error
- **P2020**: Value out of range
- **P2021**: Table does not exist
- **P2022**: Column does not exist
- **P2023**: Inconsistent column data
- **P2024**: Connection pool timeout
- **P2025**: Operation failed - record required (returns 404 Not Found)
- **P2026**: Invalid database string
- **P2027**: Multiple errors
- **P2028**: Transaction API error
- **P2030**: Fulltext index not found
- **P2031**: Prisma transaction needed
- **P2033**: Type mismatch in filter
- **P2034**: Transaction conflict
- **P2035**: Assertion violation

## Slack Integration

To enable Slack error logging for production, set the environment variable:

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Slack messages are only sent for 5xx errors in production mode and include:
- Error type
- Status code
- Error message
- Request details (method, URL)
- Stack trace

## Environment Variables

```bash
# .env
NODE_ENV=development
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## Setup Steps

1. **Error classes and middleware are already created** ✅
2. **Update app.ts** ✅
3. **Install Zod (if not already installed)**:
   ```bash
   pnpm add zod
   ```
4. **Create routes and use error handling** (see examples above)

## Best Practices

1. **Always use try-catch in async route handlers**
2. **Pass errors to next() function for global handler**
3. **Use specific error classes for better error identification**
4. **Validate input with Zod schemas**
5. **Let Prisma errors propagate for automatic handling**
6. **Use asyncHandler wrapper for cleaner async routes**
7. **Monitor Slack notifications in production**

## Middleware Order (Important!)

```typescript
// 1. Body parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// 2. Routes
app.use('/api/v1', routes);

// 3. 404 Handler (before error handler)
app.use(notFoundHandler);

// 4. Error Handler (must be last)
app.use(globalErrorHandler);
```

## Testing Error Handling

Create a test route to verify all error types:

```typescript
router.get('/test-error/:type', (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.params;
  
  try {
    switch (type) {
      case 'zod':
        throw z.string().parse(123); // Zod error
      case 'custom':
        throw new ValidationError('Test validation error');
      case 'prisma':
        throw new Error('Prisma error simulation');
      case 'generic':
        throw new TypeError('Test type error');
      default:
        throw new Error('Unknown error type');
    }
  } catch (error) {
    next(error);
  }
});
```

## Notes

- Error handler automatically detects error type and formats accordingly
- Stack traces are included in development mode only
- Slack sends sensitive details only in production (5xx errors)
- All errors logged to console in development mode
- Response always includes proper HTTP status codes
