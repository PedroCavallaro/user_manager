import { jwtDecode } from "jwt-decode";

export function safeDecode<T>(token: string) {
	try {
		const parsed = jwtDecode<T>(token);

		return parsed;
	} catch (e) {
		return null;
	}
}
