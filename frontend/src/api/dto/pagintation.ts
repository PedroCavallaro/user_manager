export interface PaginationDTO<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export interface PaginationQuery {
  query?: string;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  sortBy?: string;
}
