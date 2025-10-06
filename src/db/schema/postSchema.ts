import { pgTable, serial, varchar, text, boolean, timestamp, integer,uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  guid:uuid("guid").notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  author_id: integer("author_id").references(() => users.id).notNull(),
  is_public: boolean("is_public").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
