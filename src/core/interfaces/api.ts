export type PaginationParams<T> = {
  page?: number | 1;
  limit?: number | 10;
  orderBy?: keyof T;
  sort?: "asc" | "desc";
};
