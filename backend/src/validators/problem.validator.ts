import { z } from 'zod';

export const createProblemSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  category: z.enum(['WATER_SANITATION', 'AGRICULTURE', 'HEALTHCARE', 'EDUCATION', 'INFRASTRUCTURE', 'ENVIRONMENT', 'SKILL_DEVELOPMENT', 'OTHER']),
  district: z.string().min(1, 'District is required'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export const updateStatusSchema = z.object({
  newStatus: z.enum(['PENDING_APPROVAL', 'REJECTED', 'OPEN', 'TEAM_FORMED', 'IN_PROGRESS', 'PILOTED', 'SOLVED']),
  note: z.string().max(500).optional(),
});

export const problemQuerySchema = z.object({
  category: z.string().optional(),
  district: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('12'),
});
