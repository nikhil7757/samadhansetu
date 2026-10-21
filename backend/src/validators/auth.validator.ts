import { z } from 'zod';

export const sessionSchema = z.object({
  idToken: z.string().min(10, 'Valid Firebase ID token required'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum([
    'DEPARTMENT_USER',
    'STARTUP',
    'INNOVATION_SOCIETY_ADMIN',
    'EVALUATOR',
    'VALIDATOR',
  ]),
  organizationName: z.string().max(200).optional(),
  department: z.string().max(200).optional(),
  district: z.string().min(1, 'District is required').max(100),
  preferredLanguage: z.enum(['en', 'hi', 'mr']).default('en'),
});

export const assignRoleSchema = z.object({
  targetUid: z.string().min(1, 'Target UID is required'),
  role: z.enum([
    'DEPARTMENT_USER',
    'STARTUP',
    'INNOVATION_SOCIETY_ADMIN',
    'EVALUATOR',
    'VALIDATOR',
  ]),
});

// Legacy schemas retained for compatibility
export const signupSchema = profileSchema.extend({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(1, 'Password is required').optional(),
  idToken: z.string().optional(),
});
