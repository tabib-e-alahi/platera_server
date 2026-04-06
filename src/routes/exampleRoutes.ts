import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/AppError.js';

const router: Router = Router();

// Zod schemas for validation
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
type LoginInput = z.infer<typeof loginSchema>;

// Example route: Create user with Zod validation
router.post(
  '/users',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate input - throws ZodError if invalid, automatically caught by error handler
    const validatedData: CreateUserInput = createUserSchema.parse(req.body);

    // Simulate database operation
    // In real app: const user = await prisma.user.create({ data: validatedData });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: '1',
        email: validatedData.email,
        name: validatedData.name,
      },
    });
  }),
);

// Example route: Get user by ID
router.get(
  '/users/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validation example
    if (!id) {
      throw new ValidationError('User ID is required');
    }

    // Simulate checking if user exists
    if (id === '999') {
      throw new NotFoundError('User not found');
    }

    // Simulate database query
    // In real app: const user = await prisma.user.findUniqueOrThrow({ where: { id } });

    res.status(200).json({
      success: true,
      data: {
        id,
        email: 'user@example.com',
        name: 'John Doe',
      },
    });
  }),
);

// Example route: Login with error handling
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    // Validate input
    const validatedData: LoginInput = loginSchema.parse(req.body);

    // Simulate authentication failure
    if (validatedData.email === 'invalid@example.com') {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Simulate successful login
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'jwt_token_here',
        user: {
          id: '1',
          email: validatedData.email,
        },
      },
    });
  }),
);

// Example route: Demonstrate different error types
router.get(
  '/test-errors/:type',
  asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.params;

    switch (type) {
      case 'validation':
        // Zod validation error
        z.object({
          email: z.string().email(),
          age: z.number().positive(),
        }).parse({ email: 'invalid-email', age: -5 });
        break;

      case 'custom-validation':
        throw new ValidationError('Custom validation failed');

      case 'not-found':
        throw new NotFoundError('Resource does not exist');

      case 'unauthorized':
        throw new UnauthorizedError('Authentication required');

      case 'generic':
        throw new Error('Generic error for testing');

      case 'type-error':
        const obj: any = null;
        obj.method(); // Will throw TypeError
        break;

      default:
        throw new ValidationError('Invalid error type for testing');
    }

    res.status(200).json({ success: true, message: 'No error occurred' });
  }),
);

export default router;
