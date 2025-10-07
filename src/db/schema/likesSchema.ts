import { pgTable, serial, timestamp,uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { posts } from "./postSchema";

export const likes = pgTable("likes", {
  id: serial("id"),
  guid:uuid("guid").notNull().unique().primaryKey(),
  postguid: uuid("post_id").references(() => posts.guid).notNull(),
  userguid: uuid("user_id").references(() => users.guid).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
