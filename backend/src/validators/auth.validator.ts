import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['CITIZEN', 'UNIVERSITY', 'INDUSTRY']),
  organizationName: z.string().max(200).optional(),
  district: z.string().min(1, 'District is required'),
  preferredLanguage: z.enum(['en', 'hi']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
