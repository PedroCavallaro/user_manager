import { SetStateAction } from "react";
import { Role } from "../../../api/dto";
import type { GetUserListQueryDTO } from "../../../api/dto/user/get-users-list.dto";
import { Button } from "../../../components/button";

interface UsersListFiltersProps {
	query: GetUserListQueryDTO;
	handleQuery: (query: Partial<GetUserListQueryDTO>) => void;
}

export function UsersListFilters({
	query,
	handleQuery,
}: UsersListFiltersProps) {
	return (
		<div className="flex flex-row  gap-4">
			<Button
				onClick={() => handleQuery({ role: undefined })}
				className="w-fit px-2 h-10"
				variant={query?.role == null ? "secondary" : "primary"}
			>
				<Button.Title>Todos</Button.Title>
			</Button>
			<Button
				onClick={() => handleQuery({ role: Role.ADMIN })}
				className="w-fit px-2 h-10"
				variant={query?.role === Role.ADMIN ? "secondary" : "primary"}
			>
				<Button.Title>Admin</Button.Title>
			</Button>
			<Button
				onClick={() => handleQuery({ role: Role.USER })}
				className="w-fit px-2 h-10"
				variant={query?.role === Role.USER ? "secondary" : "primary"}
			>
				<Button.Title>Usuários</Button.Title>
			</Button>
		</div>
	);
}
