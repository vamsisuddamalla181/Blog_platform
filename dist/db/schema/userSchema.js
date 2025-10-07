"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    guid: (0, pg_core_1.uuid)("guid").notNull().unique(),
    token: (0, pg_core_1.varchar)("token").unique(),
    username: (0, pg_core_1.varchar)("username", { length: 50 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 100 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow()
});
