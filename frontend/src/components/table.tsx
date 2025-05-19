import React, { type ReactNode } from 'react';
import { Pagination, type PaginationProps } from './pagination';

export interface TableSortByHeader {
  name: string;
  sortBy: string;
}

interface TableProps {
  children: ReactNode;
  className?: string;
  pagination?: PaginationProps;
}

const Table = ({ children, className, pagination }: TableProps) => {
  return (
    <div className="bg-rich-black-100 py-2 px-4 flex-col items-center justify-center flex rounded-2xl border border-white/20">
      <div className="w-full overflow-x-auto">
        <div className={`min-w-full ${className ?? ''}`}>
          <table className="min-w-full border-collapse bg-rich-black-100">
            {children}
          </table>
        </div>
      </div>
      {pagination && (
        <Pagination
          total={pagination.total}
          totalPages={pagination.totalPages}
          handleQuery={pagination.handleQuery}
          page={pagination.page}
          limit={pagination.limit}
          title={pagination.title}
          query={pagination.query}
        />
      )}
    </div>
  );
};

const Header = ({ children }: { children: ReactNode }) => (
  <thead className="bg-rich-black-100 h-16 border-b border-white/40">
    {children}
  </thead>
);

const Body = ({ children }: { children: ReactNode }) => (
  <tbody>{children}</tbody>
);

const Row = ({ children }: { children: ReactNode }) => (
  <tr className="hover:bg-zinc-900/20 transition-all">{children}</tr>
);

const Head = ({
  children,
  onTap,
}: {
  children: ReactNode;
  onTap?: () => void;
}) => (
  <th
    onClick={onTap}
    className="text-left lg:px-10 px-2 py-2 font-caption text-white/40"
  >
    {children}
  </th>
);

const Cell = ({ children }: { children: ReactNode }) => (
  <td className="lg:px-10 px-2 py-5 text-white/80">{children}</td>
);

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;

export { Table };
