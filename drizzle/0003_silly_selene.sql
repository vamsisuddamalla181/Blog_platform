ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verification_token" varchar(128);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verification_expires" timestamp;