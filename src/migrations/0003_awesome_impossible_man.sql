ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "oauth_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "full_name";