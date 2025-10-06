import { pgTable, serial, integer, timestamp,uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { posts } from "./postSchema";

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  guid:uuid("guid").notNull().unique(),
  post_id: integer("post_id").references(() => posts.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
