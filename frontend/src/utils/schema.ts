import { z } from "zod";

export const zExt = {
	string(
		opt: {
			max?: number;
			min?: number | null;
		} = {},
	) {
		let result = z.string({ required_error: `Esse campo é obrigatório` });

		if (opt.max) {
			result = result.max(opt.max, {
				message: `Deve ter no máximo ${opt.max} caracteres`,
			});
		}

		if (opt.min || opt.min === undefined) {
			result = result.min(opt.min ?? 1, {
				message: `Deve ter no mínimo ${opt.min ?? 1} caracteres`,
			});
		}

		return result;
	},
};
