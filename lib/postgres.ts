import { Pool, type PoolClient, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var monarchisPostgresPool: Pool | undefined;
}

export type DatabaseColumn = {
  column_name: string;
  data_type: string;
  is_nullable: "YES" | "NO";
  column_default: string | null;
};

export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function logDatabaseFailure(operation: string, error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "schema_or_storage_error";
  console.error(`[database] ${operation} failed (${code})`);
}

export function getPostgresPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.monarchisPostgresPool) {
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      application_name: "monarchis-financial",
    });
    pool.on("error", (error) => logDatabaseFailure("idle pool connection", error));
    globalThis.monarchisPostgresPool = pool;
  }

  return globalThis.monarchisPostgresPool;
}

export async function withDatabaseTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPostgresPool().connect();
  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function getTableColumns(
  tableName: string,
  queryable: Pick<PoolClient, "query"> = getPostgresPool(),
): Promise<DatabaseColumn[]> {
  const result = await queryable.query<DatabaseColumn>(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = current_schema() AND table_name = $1
     ORDER BY ordinal_position`,
    [tableName],
  );
  return result.rows;
}

export async function databaseIsReachable() {
  const result = await getPostgresPool().query<QueryResultRow>("SELECT 1 AS connected");
  return result.rows[0]?.connected === 1;
}
