import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import type { PaginationQuery } from '../api/dto';
import { Button } from './button/button';

export interface PaginationProps extends PaginationQuery {
  total: number;
  totalPages: number;
  title: string;
  handleQuery: (query: Partial<PaginationQuery>) => void;
}

export function Pagination({
  title,
  page = 1,
  total,
  limit = 10,
  totalPages,
  handleQuery,
}: PaginationProps) {
  const [open, setOpen] = useState(false);
  const options = [10, 20, 30, 50];

  const onLeft = useCallback(() => {
    handleQuery({ page: page - 1 });
  }, [handleQuery, page]);

  const onRight = useCallback(() => {
    handleQuery({ page: page + 1 });
  }, [handleQuery, page]);

  return (
    <div className="bg-black border-t flex items-center justify-between border-white/20 h-12 w-full px-4 py-8 relative">
      <p className="text-white">
        Mostrando <span className="font-caption text-white">{total}</span>{' '}
        {title}
      </p>

      <div className="flex items-center gap-4">
        <div className="relative w-20">
          <Button className=" mt-2" onClick={() => setOpen(!open)}>
            <Button.Title>
              <span>{limit}</span>
            </Button.Title>
            {open ? (
              <ChevronUp size={16} color="#FFF" />
            ) : (
              <ChevronDown size={16} color="#FFF" />
            )}
          </Button>

          {open && (
            <div className="absolute bottom-10 right-0 w-32 bg-zinc-900 border border-white/10 rounded shadow-lg z-10">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    handleQuery({ limit: opt });
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-zinc-800 ${
                    opt === limit ? 'bg-zinc-800' : ''
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            data-disabled={page <= 1}
            className="text-white data-[disabled=true]:text-white/20"
            onClick={onLeft}
            disabled={page <= 1}
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-caption text-white">{page}</p>
          <button
            data-disabled={page >= totalPages}
            disabled={page >= totalPages}
            onClick={onRight}
            className="text-white data-[disabled=true]:text-white/20"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
