CREATE TABLE "family_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"family_id" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "family_member_serial_index" ON "family_members" USING btree ("serial");--> statement-breakpoint
CREATE INDEX "family_member_user_id_index" ON "family_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "family_member_family_id_index" ON "family_members" USING btree ("family_id");