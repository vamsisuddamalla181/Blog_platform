ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_token" varchar(128);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_expires" timestamp;