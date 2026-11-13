import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  getPostgresPool,
  getTableColumns,
  hasDatabaseConfig,
  withDatabaseTransaction,
  type DatabaseColumn,
} from "@/lib/postgres";
import type { PoolClient } from "pg";

export type ProductStatus = "draft" | "active" | "suspended" | "archived";
export type RiskBand = "Conservative" | "Balanced" | "Growth" | "Opportunistic";

export type ProductRecord = {
  id: string;
  name: string;
  summary: string;
  riskBand: RiskBand;
  minAmount: number;
  maxAmount: number;
  feePercent: number;
  durationMonths: number;
  currency: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type KycCaseRecord = {
  id: string;
  applicantEmail: string;
  firstName: string;
  lastName: string;
  country: string;
  documentType: string;
  notes: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  createdAt: string;
};

export type SupportTicketRecord = {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
};

export type PaymentRequestRecord = {
  id: string;
  email: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected" | "processing";
  note: string;
  createdAt: string;
};

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  status: "registered" | "verified" | "restricted" | "suspended";
  createdAt: string;
};

export type AuditLogRecord = {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type DashboardOverview = {
  status: "database-connected" | "local-store";
  userEmail: string | null;
  stats: Array<{ label: string; value: string }>;
  activity: Array<{ title: string; detail: string; meta: string }>;
  portfolio: Array<{ name: string; allocation: string; status: string; }>; 
  notifications: Array<{ title: string; detail: string; time: string }>;
  supportTickets: SupportTicketRecord[];
  kycCases: KycCaseRecord[];
  paymentRequests: PaymentRequestRecord[];
};

export type AdminOverview = {
  totals: {
    users: number;
    activeUsers: number;
    pendingKyc: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    auditEvents: number;
    paymentRequests: number;
  };
  users: UserRecord[];
  kycCases: KycCaseRecord[];
  paymentRequests: PaymentRequestRecord[];
  supportTickets: SupportTicketRecord[];
  auditLogs: AuditLogRecord[];
  products: ProductRecord[];
};

type StorageState = {
  products: ProductRecord[];
  kycCases: KycCaseRecord[];
  supportTickets: SupportTicketRecord[];
  paymentRequests: PaymentRequestRecord[];
  users: UserRecord[];
  auditLogs: AuditLogRecord[];
};

const DEFAULT_STATE: StorageState = {
  products: [
    {
      id: "prod-1",
      name: "Capital Preservation Mandate",
      summary: "A defensive portfolio with focused capital protection and liquidity planning.",
      riskBand: "Conservative",
      minAmount: 1000,
      maxAmount: 25000,
      feePercent: 0.5,
      durationMonths: 12,
      currency: "USD",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-2",
      name: "Balanced Growth Strategy",
      summary: "Diversified risk-managed allocation for medium-term capital growth objectives.",
      riskBand: "Balanced",
      minAmount: 25000,
      maxAmount: 150000,
      feePercent: 1.1,
      durationMonths: 18,
      currency: "USD",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  kycCases: [],
  supportTickets: [],
  paymentRequests: [],
  users: [
    {
      id: "user-demo-1",
      email: "demo@monarchis.local",
      name: "Demo Client",
      status: "registered",
      createdAt: new Date().toISOString(),
    },
  ],
  auditLogs: [
    {
      id: "audit-demo-1",
      actor: "system",
      action: "platform_initialized",
      detail: "Monarchis workspace initialized with review-only operational settings.",
      createdAt: new Date().toISOString(),
    },
  ],
};

const STORE_PATH = path.join(process.cwd(), "data", "monarchis-store.json");

function getIsoNow() {
  return new Date().toISOString();
}

function ensureStoreDirectory() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function readLocalStore(): Promise<StorageState> {
  ensureStoreDirectory();
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STATE, null, 2), "utf8");
    return structuredClone(DEFAULT_STATE);
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<StorageState>;
    return {
      products: parsed.products ?? DEFAULT_STATE.products,
      kycCases: parsed.kycCases ?? DEFAULT_STATE.kycCases,
      supportTickets: parsed.supportTickets ?? DEFAULT_STATE.supportTickets,
      paymentRequests: parsed.paymentRequests ?? DEFAULT_STATE.paymentRequests,
      users: parsed.users ?? DEFAULT_STATE.users,
      auditLogs: parsed.auditLogs ?? DEFAULT_STATE.auditLogs,
    };
  } catch {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STATE, null, 2), "utf8");
    return structuredClone(DEFAULT_STATE);
  }
}

async function writeLocalStore(next: StorageState) {
  ensureStoreDirectory();
  fs.writeFileSync(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
}

const COLUMN_ALIASES: Record<string, string[]> = {
  id: ["id", "uuid", "user_id"],
  authUserId: ["auth_user_id", "neon_auth_user_id", "auth_id", "external_user_id"],
  appUserId: ["app_user_id", "user_id", "account_user_id"],
  email: ["email", "user_email", "applicant_email"],
  applicantEmail: ["applicant_email", "email", "user_email"],
  name: ["name", "full_name", "display_name"],
  status: ["status", "state", "request_status", "kyc_status", "ticket_status", "product_status"],
  createdAt: ["created_at", "createdat", "submitted_at", "requested_at"],
  updatedAt: ["updated_at", "updatedat", "modified_at"],
  firstName: ["first_name", "firstname"],
  lastName: ["last_name", "lastname"],
  country: ["country", "country_code", "residence_country"],
  documentType: ["document_type", "documenttype", "id_type"],
  notes: ["notes", "note", "description"],
  subject: ["subject", "title"],
  message: ["message", "body", "content"],
  type: ["type", "request_type", "transaction_type"],
  amount: ["amount", "requested_amount"],
  currency: ["currency", "currency_code"],
  paymentMethod: ["payment_method", "paymentmethod", "method"],
  riskBand: ["risk_band", "riskband"],
  minAmount: ["min_amount", "minimum_amount", "minamount"],
  maxAmount: ["max_amount", "maximum_amount", "maxamount"],
  feePercent: ["fee_percent", "fee_percentage", "feepercent"],
  durationMonths: ["duration_months", "durationmonths", "term_months"],
  summary: ["summary", "description"],
  actor: ["actor", "actor_email", "user_email", "performed_by"],
  action: ["action", "action_type", "event_type"],
  detail: ["detail", "details", "metadata", "event_data"],
};

const TABLE_NAMES = {
  users: "app_users",
  profiles: "user_profiles",
  kycCases: "kyc_cases",
  supportTickets: "support_tickets",
  paymentRequests: "payment_requests",
  products: "investment_products",
  auditEvents: "audit_events",
} as const;

type DatabaseRow = Record<string, unknown>;
type MappedValues = Record<string, unknown>;

function quoteIdentifier(identifier: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error("The database schema contains an unsupported identifier.");
  }
  return `"${identifier}"`;
}

function findColumn(columns: DatabaseColumn[], field: string) {
  const aliases = COLUMN_ALIASES[field] ?? [field];
  const normalized = new Set(aliases.map((alias) => alias.toLowerCase()));
  return columns.find((column) => normalized.has(column.column_name.toLowerCase()));
}

function readValue(row: DatabaseRow, field: string): unknown {
  const aliases = COLUMN_ALIASES[field] ?? [field];
  for (const alias of aliases) {
    const key = Object.keys(row).find((candidate) => candidate.toLowerCase() === alias.toLowerCase());
    if (key !== undefined) return row[key];
  }
  return undefined;
}

function asString(value: unknown, fallback = "") {
  if (value instanceof Date) return value.toISOString();
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function asDetail(value: unknown) {
  if (value && typeof value === "object") return JSON.stringify(value);
  return asString(value);
}

function mapProduct(row: DatabaseRow): ProductRecord {
  const status = asString(readValue(row, "status"), "draft");
  const riskBand = asString(readValue(row, "riskBand"), "Balanced");
  return {
    id: asString(readValue(row, "id")),
    name: asString(readValue(row, "name")),
    summary: asString(readValue(row, "summary")),
    riskBand: (["Conservative", "Balanced", "Growth", "Opportunistic"].includes(riskBand)
      ? riskBand
      : "Balanced") as RiskBand,
    minAmount: asNumber(readValue(row, "minAmount")),
    maxAmount: asNumber(readValue(row, "maxAmount")),
    feePercent: asNumber(readValue(row, "feePercent")),
    durationMonths: asNumber(readValue(row, "durationMonths")),
    currency: asString(readValue(row, "currency"), "USD"),
    status: (["draft", "active", "suspended", "archived"].includes(status)
      ? status
      : "draft") as ProductStatus,
    createdAt: asString(readValue(row, "createdAt")),
    updatedAt: asString(readValue(row, "updatedAt")),
  };
}

function mapKycCase(row: DatabaseRow): KycCaseRecord {
  const status = asString(readValue(row, "status"), "submitted");
  return {
    id: asString(readValue(row, "id")),
    applicantEmail: asString(readValue(row, "applicantEmail") ?? readValue(row, "email")),
    firstName: asString(readValue(row, "firstName")),
    lastName: asString(readValue(row, "lastName")),
    country: asString(readValue(row, "country")),
    documentType: asString(readValue(row, "documentType")),
    notes: asString(readValue(row, "notes")),
    status: (["submitted", "under_review", "approved", "rejected"].includes(status)
      ? status
      : "submitted") as KycCaseRecord["status"],
    createdAt: asString(readValue(row, "createdAt")),
  };
}

function mapSupportTicket(row: DatabaseRow): SupportTicketRecord {
  const status = asString(readValue(row, "status"), "new");
  return {
    id: asString(readValue(row, "id")),
    email: asString(readValue(row, "email")),
    subject: asString(readValue(row, "subject")),
    message: asString(readValue(row, "message")),
    status: (["new", "in_progress", "resolved"].includes(status)
      ? status
      : "new") as SupportTicketRecord["status"],
    createdAt: asString(readValue(row, "createdAt")),
  };
}

function mapPaymentRequest(row: DatabaseRow): PaymentRequestRecord {
  const type = asString(readValue(row, "type"), "deposit");
  const status = asString(readValue(row, "status"), "pending");
  return {
    id: asString(readValue(row, "id")),
    email: asString(readValue(row, "email")),
    type: (type === "withdrawal" ? "withdrawal" : "deposit"),
    amount: asNumber(readValue(row, "amount")),
    currency: asString(readValue(row, "currency"), "USD"),
    paymentMethod: asString(readValue(row, "paymentMethod")),
    status: (["pending", "approved", "rejected", "processing"].includes(status)
      ? status
      : "pending") as PaymentRequestRecord["status"],
    note: asString(readValue(row, "notes")),
    createdAt: asString(readValue(row, "createdAt")),
  };
}

function mapUser(row: DatabaseRow): UserRecord {
  const status = asString(readValue(row, "status"), "registered");
  return {
    id: asString(readValue(row, "id")),
    email: asString(readValue(row, "email")),
    name: asString(readValue(row, "name")),
    status: (["registered", "verified", "restricted", "suspended"].includes(status)
      ? status
      : "registered") as UserRecord["status"],
    createdAt: asString(readValue(row, "createdAt")),
  };
}

function mapAuditEvent(row: DatabaseRow): AuditLogRecord {
  return {
    id: asString(readValue(row, "id")),
    actor: asString(readValue(row, "actor")),
    action: asString(readValue(row, "action")),
    detail: asDetail(readValue(row, "detail")),
    createdAt: asString(readValue(row, "createdAt")),
  };
}

async function selectRows(
  tableName: string,
  options: { email?: string | null; limit?: number; required?: boolean } = {},
  client?: PoolClient,
): Promise<DatabaseRow[]> {
  const queryable = client ?? getPostgresPool();
  const columns = await getTableColumns(tableName, queryable);
  if (!columns.length) {
    if (options.required) throw new Error(`Required database table "${tableName}" is unavailable.`);
    return [];
  }

  const values: unknown[] = [];
  let whereClause = "";
  if (options.email) {
    const emailColumn = findColumn(columns, "email") ?? findColumn(columns, "applicantEmail");
    if (emailColumn) {
      values.push(options.email);
      whereClause = ` WHERE LOWER(${quoteIdentifier(emailColumn.column_name)}::text) = LOWER($1)`;
    } else {
      const ownerColumn = findColumn(columns, "appUserId");
      const userId = await findUserIdByEmail(options.email, queryable);
      if (!ownerColumn || !userId) {
        throw new Error(`Table "${tableName}" cannot be safely scoped to the current user.`);
      }
      values.push(userId);
      whereClause = ` WHERE ${quoteIdentifier(ownerColumn.column_name)}::text = $1`;
    }
  }

  const createdColumn = findColumn(columns, "createdAt");
  const orderClause = createdColumn
    ? ` ORDER BY ${quoteIdentifier(createdColumn.column_name)} DESC`
    : "";
  let limitClause = "";
  if (options.limit !== undefined) {
    values.push(options.limit);
    limitClause = ` LIMIT $${values.length}`;
  }
  const result = await queryable.query(
    `SELECT * FROM ${quoteIdentifier(tableName)}${whereClause}${orderClause}${limitClause}`,
    values,
  );
  return result.rows as DatabaseRow[];
}

async function findUserIdByEmail(
  email: string,
  queryable: Pick<PoolClient, "query">,
) {
  const columns = await getTableColumns(TABLE_NAMES.users, queryable);
  const emailColumn = findColumn(columns, "email");
  const idColumn = findColumn(columns, "id");
  if (!emailColumn || !idColumn) return null;
  const result = await queryable.query(
    `SELECT ${quoteIdentifier(idColumn.column_name)} AS id
     FROM ${quoteIdentifier(TABLE_NAMES.users)}
     WHERE LOWER(${quoteIdentifier(emailColumn.column_name)}::text) = LOWER($1)
     LIMIT 1`,
    [email],
  );
  return result.rows[0]?.id == null ? null : String(result.rows[0].id);
}

async function insertMappedRow(
  client: PoolClient,
  tableName: string,
  input: MappedValues,
  requiredFields: string[],
): Promise<DatabaseRow> {
  const columns = await getTableColumns(tableName, client);
  if (!columns.length) {
    throw new Error(`Required database table "${tableName}" is unavailable.`);
  }

  const insertColumns: string[] = [];
  const insertValues: unknown[] = [];
  for (const [field, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    const column = findColumn(columns, field);
    if (!column || insertColumns.includes(column.column_name)) continue;
    insertColumns.push(column.column_name);
    insertValues.push(
      column.data_type === "json" || column.data_type === "jsonb"
        ? JSON.stringify(value)
        : value,
    );
  }

  for (const field of requiredFields) {
    const userLinkSupportsEmail = ["email", "applicantEmail"].includes(field)
      && Boolean(findColumn(columns, "appUserId") && input.appUserId);
    if (!findColumn(columns, field) && !userLinkSupportsEmail) {
      throw new Error(`Table "${tableName}" does not support required field "${field}".`);
    }
  }

  const idColumn = findColumn(columns, "id");
  if (idColumn && !input.id && !idColumn.column_default) {
    if (idColumn.data_type === "uuid" || ["text", "character varying", "character"].includes(idColumn.data_type)) {
      insertColumns.push(idColumn.column_name);
      insertValues.push(randomUUID());
    }
  }

  if (!insertColumns.length) {
    throw new Error(`No compatible fields were found in database table "${tableName}".`);
  }

  const placeholders = insertValues.map((_, index) => `$${index + 1}`).join(", ");
  const result = await client.query(
    `INSERT INTO ${quoteIdentifier(tableName)} (${insertColumns.map(quoteIdentifier).join(", ")})
     VALUES (${placeholders}) RETURNING *`,
    insertValues,
  );
  return result.rows[0] as DatabaseRow;
}

async function updateMappedRow(
  client: PoolClient,
  tableName: string,
  columns: DatabaseColumn[],
  rowId: unknown,
  changes: MappedValues,
) {
  const idColumn = findColumn(columns, "id");
  if (!idColumn || rowId == null) return;
  const updates: string[] = [];
  const values: unknown[] = [];
  for (const [field, value] of Object.entries(changes)) {
    const column = findColumn(columns, field);
    if (!column || value === undefined || value === null || column.column_name === idColumn.column_name) continue;
    values.push(value);
    updates.push(`${quoteIdentifier(column.column_name)} = $${values.length}`);
  }
  const updatedAtColumn = findColumn(columns, "updatedAt");
  if (updatedAtColumn && !updates.some((entry) => entry.startsWith(`${quoteIdentifier(updatedAtColumn.column_name)} =`))) {
    values.push(getIsoNow());
    updates.push(`${quoteIdentifier(updatedAtColumn.column_name)} = $${values.length}`);
  }
  if (!updates.length) return;
  values.push(rowId);
  await client.query(
    `UPDATE ${quoteIdentifier(tableName)} SET ${updates.join(", ")}
     WHERE ${quoteIdentifier(idColumn.column_name)} = $${values.length}`,
    values,
  );
}

async function ensureUserProfile(
  client: PoolClient,
  email: string,
  authUserId?: string | null,
  name?: string | null,
) {
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [email.toLowerCase()]);
  const userColumns = await getTableColumns(TABLE_NAMES.users, client);
  const emailColumn = findColumn(userColumns, "email");
  if (!emailColumn) {
    throw new Error(`Table "${TABLE_NAMES.users}" does not contain a supported email column.`);
  }
  const idColumn = findColumn(userColumns, "id");
  const existing = await client.query(
    `SELECT * FROM ${quoteIdentifier(TABLE_NAMES.users)}
     WHERE LOWER(${quoteIdentifier(emailColumn.column_name)}::text) = LOWER($1)
     LIMIT 1 FOR UPDATE`,
    [email],
  );

  let userRow: DatabaseRow;
  let profileWasCreated = false;
  if (existing.rows[0]) {
    userRow = existing.rows[0] as DatabaseRow;
    await updateMappedRow(client, TABLE_NAMES.users, userColumns, readValue(userRow, "id"), {
      name: name?.trim() || undefined,
      authUserId: authUserId || undefined,
    });
  } else {
    profileWasCreated = true;
    const now = getIsoNow();
    const userValues: MappedValues = {
      email,
      name: name?.trim() || undefined,
      authUserId: authUserId || undefined,
      status: "registered",
      createdAt: now,
      updatedAt: now,
    };
    if (idColumn && !idColumn.column_default) {
      userValues.id = idColumn.data_type === "uuid" ? randomUUID() : authUserId || randomUUID();
    }
    userRow = await insertMappedRow(client, TABLE_NAMES.users, userValues, ["email"]);
  }

  const userId = readValue(userRow, "id");
  const profileColumns = await getTableColumns(TABLE_NAMES.profiles, client);
  if (profileColumns.length) {
    const profileOwner = findColumn(profileColumns, "appUserId");
    const profileEmail = findColumn(profileColumns, "email");
    const ownerColumn = profileOwner ?? profileEmail;
    const ownerValue = profileOwner ? userId : email;
    if (!ownerColumn || ownerValue == null) {
      throw new Error(`Table "${TABLE_NAMES.profiles}" cannot be linked safely to the authenticated user.`);
    }
    const profileResult = await client.query(
      `SELECT * FROM ${quoteIdentifier(TABLE_NAMES.profiles)}
       WHERE ${quoteIdentifier(ownerColumn.column_name)}::text = $1
       LIMIT 1 FOR UPDATE`,
      [String(ownerValue)],
    );
    if (profileResult.rows[0]) {
      await updateMappedRow(
        client,
        TABLE_NAMES.profiles,
        profileColumns,
        readValue(profileResult.rows[0] as DatabaseRow, "id"),
        { name: name?.trim() || undefined, email },
      );
    } else {
      const profileValues: MappedValues = {
        appUserId: profileOwner ? userId : undefined,
        email: profileEmail ? email : undefined,
        name: name?.trim() || undefined,
        createdAt: getIsoNow(),
        updatedAt: getIsoNow(),
      };
      await insertMappedRow(
        client,
        TABLE_NAMES.profiles,
        profileValues,
        [profileOwner ? "appUserId" : "email"],
      );
    }
  }

  if (profileWasCreated) {
    await addAuditEvent(
      client,
      email,
      "user_profile_created",
      "Authenticated user profile linked to the application.",
      userId,
    );
  }

  return mapUser(userRow);
}

async function addAuditEvent(
  client: PoolClient,
  actor: string,
  action: string,
  detail: string,
  userId?: unknown,
): Promise<AuditLogRecord | null> {
  const columns = await getTableColumns(TABLE_NAMES.auditEvents, client);
  if (!columns.length || !findColumn(columns, "actor") || !findColumn(columns, "action")) return null;
  const detailColumn = findColumn(columns, "detail");
  const row = await insertMappedRow(client, TABLE_NAMES.auditEvents, {
    actor,
    action,
    detail: detailColumn && ["json", "jsonb"].includes(detailColumn.data_type)
      ? { detail }
      : detail,
    appUserId: userId,
    createdAt: getIsoNow(),
  }, ["actor", "action"]);
  return mapAuditEvent(row);
}

async function getDatabaseState(): Promise<StorageState> {
  const [userRows, kycRows, supportRows, paymentRows, productRows, auditRows] = await Promise.all([
    selectRows(TABLE_NAMES.users, { limit: 100 }),
    selectRows(TABLE_NAMES.kycCases, { limit: 100 }),
    selectRows(TABLE_NAMES.supportTickets, { limit: 100 }),
    selectRows(TABLE_NAMES.paymentRequests, { limit: 100 }),
    selectRows(TABLE_NAMES.products, { limit: 100 }),
    selectRows(TABLE_NAMES.auditEvents, { limit: 100 }),
  ]);
  return {
    users: userRows.map(mapUser),
    kycCases: kycRows.map(mapKycCase),
    supportTickets: supportRows.map(mapSupportTicket),
    paymentRequests: paymentRows.map(mapPaymentRequest),
    products: productRows.map(mapProduct),
    auditLogs: auditRows.map(mapAuditEvent),
  };
}

async function getLocalState() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Local storage is disabled in production; configure DATABASE_URL.");
  }
  return readLocalStore();
}

async function createDatabaseRecord(
  tableName: string,
  input: MappedValues,
  requiredFields: string[],
  audit: { actor: string; action: string; detail: string },
  ownerEmail?: string,
): Promise<DatabaseRow> {
  return withDatabaseTransaction(async (client) => {
    let user: UserRecord | undefined;
    if (ownerEmail) {
      user = await ensureUserProfile(client, ownerEmail);
      input.appUserId = user.id;
    }
    const record = await insertMappedRow(client, tableName, input, requiredFields);
    await addAuditEvent(client, audit.actor, audit.action, audit.detail, user?.id);
    return record;
  });
}

async function getStoreState() {
  return hasDatabaseConfig() ? getDatabaseState() : getLocalState();
}

export async function listProducts(): Promise<ProductRecord[]> {
  const state = await getStoreState();
  return state.products;
}

export async function listUsers(): Promise<UserRecord[]> {
  const state = await getStoreState();
  return state.users;
}

export async function listSupportTickets(): Promise<SupportTicketRecord[]> {
  const state = await getStoreState();
  return state.supportTickets;
}

export async function listPaymentRequests(): Promise<PaymentRequestRecord[]> {
  const state = await getStoreState();
  return state.paymentRequests;
}

export async function listKycCases(): Promise<KycCaseRecord[]> {
  const state = await getStoreState();
  return state.kycCases;
}

export async function listAuditLogs(): Promise<AuditLogRecord[]> {
  const state = await getStoreState();
  return state.auditLogs;
}

export async function createProduct(input: {
  name: string;
  summary: string;
  riskBand: RiskBand;
  minAmount: number;
  maxAmount: number;
  feePercent: number;
  durationMonths: number;
  currency: string;
  status?: ProductStatus;
  actor?: string;
}) {
  const now = getIsoNow();
  if (hasDatabaseConfig()) {
    const row = await createDatabaseRecord(
      TABLE_NAMES.products,
      {
        name: input.name,
        summary: input.summary,
        riskBand: input.riskBand,
        minAmount: input.minAmount,
        maxAmount: input.maxAmount,
        feePercent: input.feePercent,
        durationMonths: input.durationMonths,
        currency: input.currency.toUpperCase(),
        status: input.status ?? "draft",
        createdAt: now,
        updatedAt: now,
      },
      ["name", "summary", "riskBand", "minAmount", "maxAmount", "currency", "status"],
      {
        actor: input.actor ?? "admin",
        action: "investment_product_created",
        detail: `${input.name} created`,
      },
    );
    return mapProduct(row);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for persistent product management.");
  }

  const record: ProductRecord = {
    id: randomUUID(),
    name: input.name,
    summary: input.summary,
    riskBand: input.riskBand,
    minAmount: input.minAmount,
    maxAmount: input.maxAmount,
    feePercent: input.feePercent,
    durationMonths: input.durationMonths,
    currency: input.currency.toUpperCase(),
    status: input.status ?? "draft",
    createdAt: getIsoNow(),
    updatedAt: getIsoNow(),
  };

  const current = await readLocalStore();
  const next = { ...current, products: [record, ...current.products] };
  await writeLocalStore(next);
  await appendAudit("admin", "investment_product_created", `${input.name} created`);
  return record;
}

export async function createKycCase(input: {
  applicantEmail: string;
  firstName: string;
  lastName: string;
  country: string;
  documentType: string;
  notes: string;
}) {
  const now = getIsoNow();
  if (hasDatabaseConfig()) {
    const row = await createDatabaseRecord(
      TABLE_NAMES.kycCases,
      {
        applicantEmail: input.applicantEmail,
        firstName: input.firstName,
        lastName: input.lastName,
        country: input.country,
        documentType: input.documentType,
        notes: input.notes,
        status: "submitted",
        createdAt: now,
      },
      ["applicantEmail", "firstName", "lastName", "country", "documentType", "status"],
      {
        actor: input.applicantEmail,
        action: "kyc_submitted",
        detail: `${input.firstName} ${input.lastName} submitted KYC information.`,
      },
      input.applicantEmail,
    );
    return mapKycCase(row);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for persistent KYC submissions.");
  }

  const record: KycCaseRecord = {
    id: randomUUID(),
    applicantEmail: input.applicantEmail,
    firstName: input.firstName,
    lastName: input.lastName,
    country: input.country,
    documentType: input.documentType,
    notes: input.notes,
    status: "submitted",
    createdAt: getIsoNow(),
  };

  const current = await readLocalStore();
  const next = { ...current, kycCases: [record, ...current.kycCases] };
  await writeLocalStore(next);
  await appendAudit(input.applicantEmail, "kyc_submitted", `${input.firstName} ${input.lastName} submitted KYC documentation.`);
  return record;
}

export async function createSupportTicket(input: {
  email: string;
  subject: string;
  message: string;
}) {
  const now = getIsoNow();
  if (hasDatabaseConfig()) {
    const row = await createDatabaseRecord(
      TABLE_NAMES.supportTickets,
      {
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: "new",
        createdAt: now,
      },
      ["email", "subject", "message", "status"],
      {
        actor: input.email,
        action: "support_ticket_created",
        detail: `Support ticket: ${input.subject}`,
      },
      input.email,
    );
    return mapSupportTicket(row);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for persistent support tickets.");
  }

  const record: SupportTicketRecord = {
    id: randomUUID(),
    email: input.email,
    subject: input.subject,
    message: input.message,
    status: "new",
    createdAt: getIsoNow(),
  };

  const current = await readLocalStore();
  const next = { ...current, supportTickets: [record, ...current.supportTickets] };
  await writeLocalStore(next);
  await appendAudit(input.email, "support_ticket_created", `Support ticket: ${input.subject}`);
  return record;
}

export async function createPaymentRequest(input: {
  email: string;
  type: "deposit" | "withdrawal";
  amount: number;
  currency: string;
  paymentMethod: string;
  note: string;
}) {
  const now = getIsoNow();
  if (hasDatabaseConfig()) {
    const row = await createDatabaseRecord(
      TABLE_NAMES.paymentRequests,
      {
        email: input.email,
        type: input.type,
        amount: Number(input.amount),
        currency: input.currency.toUpperCase(),
        paymentMethod: input.paymentMethod,
        notes: input.note,
        status: "pending",
        createdAt: now,
      },
      ["email", "type", "amount", "currency", "paymentMethod", "status"],
      {
        actor: input.email,
        action: `payment_request_${input.type}`,
        detail: `${input.type} request created for ${input.amount} ${input.currency.toUpperCase()}. Pending review; no funds moved.`,
      },
      input.email,
    );
    return mapPaymentRequest(row);
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for persistent payment requests.");
  }

  const record: PaymentRequestRecord = {
    id: randomUUID(),
    email: input.email,
    type: input.type,
    amount: Number(input.amount),
    currency: input.currency.toUpperCase(),
    paymentMethod: input.paymentMethod,
    status: "pending",
    note: input.note,
    createdAt: getIsoNow(),
  };

  const current = await readLocalStore();
  const next = { ...current, paymentRequests: [record, ...current.paymentRequests] };
  await writeLocalStore(next);
  await appendAudit(input.email, `payment_request_${input.type}`, `${input.type} request created for ${record.amount} ${record.currency}. Pending review.`);
  return record;
}

export async function appendAudit(actor: string, action: string, detail: string) {
  if (hasDatabaseConfig()) {
    return withDatabaseTransaction(async (client) => {
      return addAuditEvent(client, actor, action, detail);
    });
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for persistent audit events.");
  }

  const current = await readLocalStore();
  const entry: AuditLogRecord = {
    id: randomUUID(),
    actor,
    action,
    detail,
    createdAt: getIsoNow(),
  };

  const next = { ...current, auditLogs: [entry, ...current.auditLogs] };
  await writeLocalStore(next);
  return entry;
}

export async function getDashboardOverview(
  userEmail: string | null,
  authUserId?: string | null,
  name?: string | null,
): Promise<DashboardOverview> {
  let state: StorageState;
  if (hasDatabaseConfig()) {
    if (userEmail) {
      await withDatabaseTransaction((client) => ensureUserProfile(client, userEmail, authUserId, name));
      const [kycRows, supportRows, paymentRows] = await Promise.all([
        selectRows(TABLE_NAMES.kycCases, { email: userEmail, limit: 100 }),
        selectRows(TABLE_NAMES.supportTickets, { email: userEmail, limit: 100 }),
        selectRows(TABLE_NAMES.paymentRequests, { email: userEmail, limit: 100 }),
      ]);
      state = {
        users: [],
        products: [],
        kycCases: kycRows.map(mapKycCase),
        supportTickets: supportRows.map(mapSupportTicket),
        paymentRequests: paymentRows.map(mapPaymentRequest),
        auditLogs: [],
      };
    } else {
      state = { users: [], products: [], kycCases: [], supportTickets: [], paymentRequests: [], auditLogs: [] };
    }
  } else {
    const local = await getLocalState();
    state = {
      ...local,
      kycCases: userEmail ? local.kycCases.filter((item) => item.applicantEmail.toLowerCase() === userEmail.toLowerCase()) : [],
      supportTickets: userEmail ? local.supportTickets.filter((item) => item.email.toLowerCase() === userEmail.toLowerCase()) : [],
      paymentRequests: userEmail ? local.paymentRequests.filter((item) => item.email.toLowerCase() === userEmail.toLowerCase()) : [],
    };
  }

  const ticketState = state.supportTickets.slice(0, 3);
  const paymentState = state.paymentRequests.slice(0, 3);
  const pendingDeposits = state.paymentRequests.filter((request) => request.type === "deposit" && request.status === "pending").length;
  const openSupportCount = state.supportTickets.filter((ticket) => ticket.status !== "resolved").length;
  const stats = [
    { label: "Account status", value: userEmail ? "Signed in" : "Signed out" },
    { label: "Verification", value: userEmail ? "See verification status" : "Not started" },
    { label: "Deposits", value: `${pendingDeposits} pending` },
    { label: "Support", value: `${openSupportCount} open` },
  ];

  return {
    status: hasDatabaseConfig() ? "database-connected" : "local-store",
    userEmail,
    stats,
    activity: [],
    portfolio: [],
    notifications: [],
    supportTickets: ticketState,
    kycCases: state.kycCases.slice(0, 3),
    paymentRequests: paymentState,
  };
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const state = await getStoreState();
  const pendingKyc = state.kycCases.filter((item) => item.status === "submitted" || item.status === "under_review").length;
  const pendingDeposits = state.paymentRequests.filter((item) => item.type === "deposit" && item.status === "pending").length;
  const pendingWithdrawals = state.paymentRequests.filter((item) => item.type === "withdrawal" && item.status === "pending").length;

  return {
    totals: {
      users: state.users.length,
      activeUsers: state.users.filter((user) => user.status !== "suspended").length,
      pendingKyc,
      pendingDeposits,
      pendingWithdrawals,
      auditEvents: state.auditLogs.length,
      paymentRequests: state.paymentRequests.length,
    },
    users: state.users,
    kycCases: state.kycCases,
    paymentRequests: state.paymentRequests,
    supportTickets: state.supportTickets,
    auditLogs: state.auditLogs.slice(0, 8),
    products: state.products,
  };
}
