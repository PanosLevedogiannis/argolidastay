import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_owner_requests_status" AS ENUM('new', 'contacted', 'collecting', 'published', 'declined');
  CREATE TABLE "owner_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"owner_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"property_name" varchar,
  	"area_name" varchar,
  	"property_type" varchar,
  	"message" varchar,
  	"status" "enum_owner_requests_status" DEFAULT 'new' NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "owner_requests_id" integer;
  CREATE INDEX "owner_requests_status_idx" ON "owner_requests" USING btree ("status");
  CREATE INDEX "owner_requests_updated_at_idx" ON "owner_requests" USING btree ("updated_at");
  CREATE INDEX "owner_requests_created_at_idx" ON "owner_requests" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_owner_requests_fk" FOREIGN KEY ("owner_requests_id") REFERENCES "public"."owner_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_owner_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("owner_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "owner_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "owner_requests" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_owner_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_owner_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "owner_requests_id";
  DROP TYPE "public"."enum_owner_requests_status";`)
}
