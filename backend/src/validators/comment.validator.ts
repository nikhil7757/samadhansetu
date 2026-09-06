import { z } from 'zod';

export const createCommentSchema = z.object({
  commentText: z.string().min(1, 'Comment cannot be empty').max(2000),
});

export const expressInterestSchema = z.object({
  pitchMessage: z.string().min(10, 'Pitch must be at least 10 characters').max(2000),
});
