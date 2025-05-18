import { z } from "zod";

export const UpdateUserInfoSchema = z.object({
	name: z.string().optional(),
	password: z.string().nullish(),
});

export type UpdateUserInfoDTO = z.infer<typeof UpdateUserInfoSchema>;
