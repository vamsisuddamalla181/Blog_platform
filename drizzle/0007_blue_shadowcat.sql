ALTER TABLE "posts" DROP CONSTRAINT "posts_userguid_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "userguid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userguid_users_guid_fk" FOREIGN KEY ("userguid") REFERENCES "public"."users"("guid") ON DELETE no action ON UPDATE no action;