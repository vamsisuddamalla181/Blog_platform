ALTER TABLE "comments" ADD COLUMN "guid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "guid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "guid" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_guid_unique" UNIQUE("guid");--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_guid_unique" UNIQUE("guid");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_guid_unique" UNIQUE("guid");