import { pgTable, serial, text, integer, timestamp,uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { posts } from "./postSchema";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  guid:uuid("guid").notNull().unique(),
  post_id: integer("post_id").references(() => posts.id).notNull(),
  author_id: integer("author_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
