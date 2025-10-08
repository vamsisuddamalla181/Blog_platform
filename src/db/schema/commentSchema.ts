import { pgTable, serial, text, integer, timestamp,uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
import { posts } from "./postSchema";

export const comments = pgTable("comments", {
  id: serial("id"),
  guid:uuid("guid").notNull().unique().primaryKey(),
  postguid: uuid("postguid").references(() => posts.guid).notNull(),
  userguid: uuid("userguid").references(() => users.guid).notNull(),
  text: text("text").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at:timestamp("updated_at")
});
