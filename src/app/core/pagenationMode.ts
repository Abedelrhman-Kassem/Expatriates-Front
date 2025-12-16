export interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}
