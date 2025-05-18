import { z } from "zod";
import { zExt } from "../../../utils";

export const CreateAccountSchema = z.object({
	name: zExt.string({ min: 3 }),
	email: zExt.string().email("Formato inválido"),
	password: zExt.string({ min: 8 }),
});

export type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;
