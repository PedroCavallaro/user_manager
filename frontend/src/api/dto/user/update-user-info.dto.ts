import { z } from 'zod';

export const UpdateUserInfoSchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
});

export type UpdateUserInfoDTO = z.infer<typeof UpdateUserInfoSchema>;
