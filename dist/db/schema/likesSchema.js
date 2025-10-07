"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const userSchema_1 = require("./userSchema");
const postSchema_1 = require("./postSchema");
exports.likes = (0, pg_core_1.pgTable)("likes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    guid: (0, pg_core_1.uuid)("guid").notNull().unique(),
    post_id: (0, pg_core_1.integer)("post_id").references(() => postSchema_1.posts.id).notNull(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => userSchema_1.users.id).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
