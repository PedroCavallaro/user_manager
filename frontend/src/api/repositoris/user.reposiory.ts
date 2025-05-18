import type { Api } from "..";
import type { PaginationDTO, UpdateUserInfoDTO } from "../dto";
import type {
	GetUserListQueryDTO,
	GetUsersListReponseDTO,
} from "../dto/user/get-users-list.dto";
import type { HttpClient } from "../http";
import { Repository } from "./repository";

export class UserRepository extends Repository {
	constructor(api: HttpClient) {
		super("user", api);
	}

	static build(api: HttpClient): Partial<Api> {
		return { user: new UserRepository(api) };
	}

	async getUsersList(query: GetUserListQueryDTO) {
		try {
			const res = await this.api.get<PaginationDTO<GetUsersListReponseDTO>>(
				"/user",
				{
					query: { ...query },
				},
			);
			console.log(res);

			return res;
		} catch (e) {
			console.log(e);
		}
	}

	async updateUserInfo(data: UpdateUserInfoDTO) {
		const res = await this.api.patch("/user", {
			body: data,
		});

		return res;
	}
}
