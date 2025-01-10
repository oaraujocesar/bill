CREATE TABLE "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial" varchar(26) NOT NULL,
	"name" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "family_serial_index" ON "families" USING btree ("serial");--> statement-breakpoint
CREATE INDEX "family_user_id_index" ON "families" USING btree ("user_id");