ALTER TABLE "families" DROP CONSTRAINT "families_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "family_serial_index";--> statement-breakpoint
DROP INDEX "family_user_id_index";--> statement-breakpoint
ALTER TABLE "families" DROP COLUMN "user_id";