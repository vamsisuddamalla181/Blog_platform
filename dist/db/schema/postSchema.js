"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const userSchema_1 = require("../schema/userSchema");
exports.posts = (0, pg_core_1.pgTable)("posts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    guid: (0, pg_core_1.uuid)("guid").notNull().unique(),
    title: (0, pg_core_1.varchar)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    userguid: (0, pg_core_1.uuid)("userguid").references(() => userSchema_1.users.guid).notNull(),
    is_public: (0, pg_core_1.boolean)("is_public").default(true),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
