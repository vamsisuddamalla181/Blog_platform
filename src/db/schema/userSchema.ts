import { pgTable, serial, varchar, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id"),
  guid: uuid("guid").notNull().unique().primaryKey(),
  token: varchar("token").unique(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  // fields to support password reset flow
  password_reset_token: varchar("password_reset_token", { length: 128 }),
  password_reset_expires: timestamp("password_reset_expires"),
  // fields to support email verification
  is_verified: boolean("is_verified").default(false),
  verification_token: varchar("verification_token", { length: 128 }),
  verification_expires: timestamp("verification_expires")
});
