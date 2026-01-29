import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z]+$/, 'Username can only contain letters')
    .trim(),
});

export type SignupFormData = z.infer<typeof signupSchema>;

