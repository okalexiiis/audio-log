import { and, eq, gte, inArray, like, lte, SQL } from "drizzle-orm";

type IapplyFilters<Entity, EntityFilters extends Record<string, any>> = {
  query: any;
  entity: Entity;
  filters: EntityFilters;
};

export function applyFilters({
  entity,
  filters,
  query,
}: IapplyFilters<any, any>) {
  if (!filters) return query;

  return Object.entries(filters).reduce((q, [key, value]) => {
    const column = entity[key];
    if (!column || value === undefined || value === null) return q;

    if (Array.isArray(value)) {
      return q.where(inArray(column as SQL, value));
    }

    if (typeof value === "number") {
      if (isNaN(value)) return q;
      return q.where(eq(column as SQL, value));
    }

    if (typeof value === "boolean") {
      return q.where(eq(column as SQL, value));
    }

    if (typeof value === "string") {
      // si parece fecha (ej: "2025-11-09"), tratamos como fecha
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        query.where(eq(column, new Date(value)));
      } else {
        // búsqueda parcial (usa % para el LIKE)
        query.where(like(column, `%${value}%`));
      }
    }

    if (value instanceof Date) {
      query.where(eq(column, value));
    }

    if (typeof value === "object" && "from" in value && "to" in value) {
      const from = new Date(value.from as string);
      const to = new Date(value.to as string);
      query.where(and(gte(column, from), lte(column, to)));
    }

    return q;
  }, query);
}
