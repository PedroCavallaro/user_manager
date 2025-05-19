import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import type { GetUserListQueryDTO } from "../../api/dto/user/get-users-list.dto";
import { Input } from "../../components/input/input";
import { UsersListFilters } from "./components/users-list-filters";
import { UsersTable } from "./components/users-table";

export function UsersList() {
	const [query, setQuery] = useState<GetUserListQueryDTO>({
		page: 1,
		limit: 10,
	});

	const {
		data: users,
		isLoading,
		refetch: fetchUsers,
	} = useQuery({
		queryKey: ["users-list"],
		queryFn: () => api.user.getUsersList(query),
	});

	const queryUsers = useMemo(
		() =>
			debounce((q: string) => setQuery((prev) => ({ ...prev, query: q })), 300),
		[],
	);

	const handleQuery = (query: Partial<GetUserListQueryDTO>) => {
		setQuery((prev) => ({ ...prev, ...query }));
	};

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers, query]);

	//Aquie o query e o handleQuery poderiam virar um outro hook
	//por exemploi useUsersList, pra diminuir um pouco o prop drilling
	return (
		<div className="px-4 desktop-layout flex flex-col gap-4">
			<h2 className="font-body1">Usuários</h2>
			<Input>
				<Input.Field
					onChange={(e) => queryUsers(e.target.value)}
					placeholder="Pesquisar usuário"
				></Input.Field>
				<span className="text-white/40">
					<Search />
				</span>
			</Input>
			<UsersListFilters query={query} handleQuery={handleQuery} />
			<UsersTable users={users?.data} query={query} handleQuery={setQuery} />
		</div>
	);
}
