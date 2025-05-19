import { ChevronDown, ChevronUp, Pencil, Trash } from 'lucide-react';
import { useMemo } from 'react';
import { type PaginationDTO, RoleName } from '../../../api/dto';
import type {
  GetUserListQueryDTO,
  GetUsersListReponseDTO,
} from '../../../api/dto/user/get-users-list.dto';
import { ProfileImage } from '../../../components/profile-image';
import { Table, type TableSortByHeader } from '../../../components/table';

interface UsersTableProps {
  users?: PaginationDTO<GetUsersListReponseDTO>;
  query: GetUserListQueryDTO;
  handleQuery: (query: Partial<GetUserListQueryDTO>) => void;
}

export function UsersTable({ users, query, handleQuery }: UsersTableProps) {
  const headers: TableSortByHeader[] = useMemo(() => {
    return [
      {
        name: 'Nome',
        sortBy: 'name',
      },
      {
        name: 'Email',
        sortBy: 'email',
      },
      {
        name: 'Função',
        sortBy: 'role',
      },
      {
        name: 'Status',
        sortBy: '',
      },
    ];
  }, []);

  return (
    <Table
      pagination={{
        ...query,
        total: users?.data?.length ?? 0,
        totalPages: users?.totalPages ?? 0,
        handleQuery: handleQuery,
        title: 'usuários',
      }}
    >
      <Table.Header>
        <Table.Row>
          {headers.map((e, i) => (
            <Table.Head
              onTap={() => {
                if (!e.sortBy) return;

                handleQuery({
                  order: query.order === 'asc' ? 'desc' : 'asc',
                  sortBy: e.sortBy,
                });
              }}
              key={i}
            >
              <div className="flex gap-2">
                <p>{e.name}</p>
                <span className="text-white/30">
                  {query.sortBy === e.sortBy ? (
                    query.order === 'asc' ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )
                  ) : null}
                </span>
              </div>
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users?.data?.map((e) => {
          return (
            <Table.Row key={e.id}>
              <Table.Cell>
                <ProfileImage name={e.name!} image={e.profileImage} />
              </Table.Cell>
              <Table.Cell>{e.email}</Table.Cell>
              <Table.Cell>{RoleName[e.role]}</Table.Cell>
              <Table.Cell>{e.isActive ? 'Ativo' : 'Inativo'}</Table.Cell>
              <Table.Cell>
                <div className="flex gap-4 items-center">
                  <button className="text-white/40">
                    <Pencil size={18} />
                  </button>
                  <button className="text-white/40 hover:text-red-500">
                    <Trash size={18} />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
