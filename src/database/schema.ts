import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  date,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

const STATUS_ENUM = pgEnum("status", ["PENDING", "APPROVED", "REJECTED"]);
const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
const BORROW_STATUS_ENUM = pgEnum("borrow_status", ["BORROWED", "RETURNED"]);

export const users = pgTable("users", {
  id: varchar("id").notNull().primaryKey().unique(),
  name: varchar("name", { length: 255 }),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  password: text("password"),
  universityId: integer("university_id").unique(),
  universityCard: text("university_card"),
  image: text("image"),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").notNull().primaryKey().unique(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").notNull().primaryKey().unique(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id").notNull().unique(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id").notNull().primaryKey().unique(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const jwks = pgTable("jwks", {
  id: varchar("id").notNull().primaryKey().unique(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// export type InsertUser = typeof user.$inferInsert;
// export type SelectUser = typeof user.$inferSelect;

// export type InsertSession = typeof session.$inferInsert;
// export type SelectSession = typeof session.$inferSelect;

// export type InsertAccount = typeof account.$inferInsert;
// export type SelectAccount = typeof account.$inferSelect;

// export type InsertVerification = typeof verification.$inferInsert;
// export type SelectVerification = typeof verification.$inferSelect;
