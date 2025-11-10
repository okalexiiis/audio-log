import { PaginationParams } from "./api";

export interface BaseRepository<T, TCreate = Omit<T, "id">> {
  save(entity: TCreate): Promise<T>;
  findAll(
    filters?: Partial<T>,
    options?: PaginationParams<T> & { includeTotal?: boolean },
  ): Promise<T[] | { data: T[]; total: number }>;
  findOne(filters: Partial<T>): Promise<T | null>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
}
