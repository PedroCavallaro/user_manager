import type { PaginationQuery } from "../pagintation";
import type { Role } from "./user.dto";

export interface GetUserListQueryDTO extends PaginationQuery {
	sortBy?: string;
	role?: Role;
	order?: "asc" | "desc";
}

export interface GetUsersListReponseDTO {
	id: number;
	role: Role;
	isActive: boolean;
	email: string;
	name: string;
	profileImage?: string;
}
