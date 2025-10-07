import { pgTable, serial, varchar, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../schema/userSchema";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  guid: uuid("guid").notNull().unique(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  userguid: uuid("userguid").references(() => users.guid).notNull(),
  is_public: boolean("is_public").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
