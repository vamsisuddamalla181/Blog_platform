import { Pool } from "pg";   
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "dotenv";

import * as user from "./schema/userSchema";
import * as post from "./schema/postSchema";
import * as comment from "./schema/commentSchema";
import * as like from "./schema/likesSchema";

config();

const pool = new Pool({
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


const db = drizzle(pool, {
    schema: {
        ...user,
        ...post,
        ...comment,
        ...like
    }
});

export default db;
