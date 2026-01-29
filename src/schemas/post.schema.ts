import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .trim(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .trim(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;

