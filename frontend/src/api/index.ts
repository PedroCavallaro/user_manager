import { HttpFactory } from "./http";
import { AuthRepository, UserRepository } from "./repositoris";

export interface Api {
	auth: AuthRepository;
	user: UserRepository;
}

const factory = new HttpFactory(process.env.REACT_APP_API_URL as string, [
	//@ts-ignore
	AuthRepository,
	//@ts-ignore
	UserRepository,
]);

export const api = factory.createAxiosClient();
