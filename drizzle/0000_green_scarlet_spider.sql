CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial NOT NULL,
	"guid" uuid PRIMARY KEY NOT NULL,
	"postguid" uuid NOT NULL,
	"userguid" uuid NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "comments_guid_unique" UNIQUE("guid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial NOT NULL,
	"guid" uuid PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "likes_guid_unique" UNIQUE("guid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"guid" uuid NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"userguid" uuid NOT NULL,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "posts_guid_unique" UNIQUE("guid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"guid" uuid PRIMARY KEY NOT NULL,
	"token" varchar,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_guid_unique" UNIQUE("guid"),
	CONSTRAINT "users_token_unique" UNIQUE("token"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comments_postguid_posts_guid_fk') THEN
		ALTER TABLE "comments" ADD CONSTRAINT "comments_postguid_posts_guid_fk" FOREIGN KEY ("postguid") REFERENCES "public"."posts"("guid") ON DELETE no action ON UPDATE no action;
	END IF;
END$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'comments_userguid_users_guid_fk') THEN
		ALTER TABLE "comments" ADD CONSTRAINT "comments_userguid_users_guid_fk" FOREIGN KEY ("userguid") REFERENCES "public"."users"("guid") ON DELETE no action ON UPDATE no action;
	END IF;
END$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'likes_post_id_posts_guid_fk') THEN
		ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_guid_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("guid") ON DELETE no action ON UPDATE no action;
	END IF;
END$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'likes_user_id_users_guid_fk') THEN
		ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_guid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("guid") ON DELETE no action ON UPDATE no action;
	END IF;
END$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_userguid_users_guid_fk') THEN
		ALTER TABLE "posts" ADD CONSTRAINT "posts_userguid_users_guid_fk" FOREIGN KEY ("userguid") REFERENCES "public"."users"("guid") ON DELETE no action ON UPDATE no action;
	END IF;
END$$;