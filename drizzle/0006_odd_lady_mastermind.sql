ALTER TABLE "posts" RENAME COLUMN "author_id" TO "userguid";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_userguid_users_id_fk" FOREIGN KEY ("userguid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;