export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
}

export enum RoleName {
	ADMIN = "Admisitrador",
	USER = "Usuário",
}

export interface User {
	sub: number;
	email: string;
	name: string;
	role: Role;
	profileImage?: string;
}
