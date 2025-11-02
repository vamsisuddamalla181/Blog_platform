import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",   // Path to your schema (tables)
  out: "./drizzle",               // Where migration files will be generated
  dialect: "postgresql",          // Database type
  dbCredentials: {
    host: "localhost",            // Your DB host
    port: 5001,                   // Updated to match local Postgres config
    user: "postgres",             // Your DB user
    password: "Vamsi@123",    // Your DB password
    database: "mydb",          // Your database name
    ssl: false,
  },

});
