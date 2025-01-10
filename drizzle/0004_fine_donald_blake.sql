DROP INDEX "family_member_serial_index";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "serial";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "family_members" DROP COLUMN "deleted_at";