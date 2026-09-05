import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('el', 'en');
  CREATE TYPE "public"."enum_properties_type" AS ENUM('apartment', 'studio', 'maisonette', 'villa', 'house', 'room', 'hotel', 'guesthouse');
  CREATE TYPE "public"."enum_properties_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_v_version_type" AS ENUM('apartment', 'studio', 'maisonette', 'villa', 'house', 'room', 'hotel', 'guesthouse');
  CREATE TYPE "public"."enum__properties_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_v_published_locale" AS ENUM('el', 'en');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('callback', 'phone_reveal');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'notified', 'contacted', 'booked', 'lost');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('el', 'en');
  CREATE TYPE "public"."enum_amenities_category" AS ENUM('general', 'kitchen', 'outdoor', 'accessibility', 'family');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "properties_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "properties_booking_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "properties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"type" "enum_properties_type",
  	"area_id" integer,
  	"guests" numeric,
  	"bedrooms" numeric,
  	"beds" numeric,
  	"bathrooms" numeric,
  	"size_sqm" numeric,
  	"cover_image_id" integer,
  	"latitude" numeric,
  	"longitude" numeric,
  	"distance_to_beach" numeric,
  	"price_from" numeric,
  	"price_to" numeric,
  	"contact_name" varchar,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"contact_viber" varchar,
  	"mite" varchar,
  	"subscription_until" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_properties_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "properties_locales" (
  	"name" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"address" varchar,
  	"price_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "properties_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"amenities_id" integer
  );
  
  CREATE TABLE "_properties_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_booking_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_type" "enum__properties_v_version_type",
  	"version_area_id" integer,
  	"version_guests" numeric,
  	"version_bedrooms" numeric,
  	"version_beds" numeric,
  	"version_bathrooms" numeric,
  	"version_size_sqm" numeric,
  	"version_cover_image_id" integer,
  	"version_latitude" numeric,
  	"version_longitude" numeric,
  	"version_distance_to_beach" numeric,
  	"version_price_from" numeric,
  	"version_price_to" numeric,
  	"version_contact_name" varchar,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_contact_viber" varchar,
  	"version_mite" varchar,
  	"version_subscription_until" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__properties_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__properties_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_properties_v_locales" (
  	"version_name" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_address" varchar,
  	"version_price_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_properties_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"amenities_id" integer
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"property_id" integer NOT NULL,
  	"type" "enum_enquiries_type" DEFAULT 'callback' NOT NULL,
  	"visitor_name" varchar,
  	"visitor_phone" varchar,
  	"visitor_email" varchar,
  	"check_in" timestamp(3) with time zone,
  	"check_out" timestamp(3) with time zone,
  	"guests" numeric,
  	"message" varchar,
  	"status" "enum_enquiries_status" DEFAULT 'new' NOT NULL,
  	"notification_log" varchar,
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"area_id" integer,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"properties_id" integer
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_area_id" integer,
  	"version_cover_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"properties_id" integer
  );
  
  CREATE TABLE "areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "areas_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "amenities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_amenities_category" DEFAULT 'general' NOT NULL,
  	"icon" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "amenities_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"properties_id" integer,
  	"enquiries_id" integer,
  	"articles_id" integer,
  	"areas_id" integer,
  	"amenities_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_booking_links" ADD CONSTRAINT "properties_booking_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_locales" ADD CONSTRAINT "properties_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_booking_links" ADD CONSTRAINT "_properties_v_version_booking_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_parent_id_properties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_area_id_areas_id_fk" FOREIGN KEY ("version_area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_locales" ADD CONSTRAINT "_properties_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_rels" ADD CONSTRAINT "_properties_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_rels" ADD CONSTRAINT "_properties_v_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_area_id_areas_id_fk" FOREIGN KEY ("version_area_id") REFERENCES "public"."areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "areas" ADD CONSTRAINT "areas_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "areas_locales" ADD CONSTRAINT "areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "amenities_locales" ADD CONSTRAINT "amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_areas_fk" FOREIGN KEY ("areas_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_gallery_order_idx" ON "properties_gallery" USING btree ("_order");
  CREATE INDEX "properties_gallery_parent_id_idx" ON "properties_gallery" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_image_idx" ON "properties_gallery" USING btree ("image_id");
  CREATE INDEX "properties_booking_links_order_idx" ON "properties_booking_links" USING btree ("_order");
  CREATE INDEX "properties_booking_links_parent_id_idx" ON "properties_booking_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");
  CREATE INDEX "properties_area_idx" ON "properties" USING btree ("area_id");
  CREATE INDEX "properties_cover_image_idx" ON "properties" USING btree ("cover_image_id");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  CREATE INDEX "properties__status_idx" ON "properties" USING btree ("_status");
  CREATE UNIQUE INDEX "properties_locales_locale_parent_id_unique" ON "properties_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_rels_order_idx" ON "properties_rels" USING btree ("order");
  CREATE INDEX "properties_rels_parent_idx" ON "properties_rels" USING btree ("parent_id");
  CREATE INDEX "properties_rels_path_idx" ON "properties_rels" USING btree ("path");
  CREATE INDEX "properties_rels_amenities_id_idx" ON "properties_rels" USING btree ("amenities_id");
  CREATE INDEX "_properties_v_version_gallery_order_idx" ON "_properties_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_properties_v_version_gallery_parent_id_idx" ON "_properties_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_gallery_image_idx" ON "_properties_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_properties_v_version_booking_links_order_idx" ON "_properties_v_version_booking_links" USING btree ("_order");
  CREATE INDEX "_properties_v_version_booking_links_parent_id_idx" ON "_properties_v_version_booking_links" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_parent_idx" ON "_properties_v" USING btree ("parent_id");
  CREATE INDEX "_properties_v_version_version_slug_idx" ON "_properties_v" USING btree ("version_slug");
  CREATE INDEX "_properties_v_version_version_area_idx" ON "_properties_v" USING btree ("version_area_id");
  CREATE INDEX "_properties_v_version_version_cover_image_idx" ON "_properties_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_properties_v_version_version_updated_at_idx" ON "_properties_v" USING btree ("version_updated_at");
  CREATE INDEX "_properties_v_version_version_created_at_idx" ON "_properties_v" USING btree ("version_created_at");
  CREATE INDEX "_properties_v_version_version__status_idx" ON "_properties_v" USING btree ("version__status");
  CREATE INDEX "_properties_v_created_at_idx" ON "_properties_v" USING btree ("created_at");
  CREATE INDEX "_properties_v_updated_at_idx" ON "_properties_v" USING btree ("updated_at");
  CREATE INDEX "_properties_v_snapshot_idx" ON "_properties_v" USING btree ("snapshot");
  CREATE INDEX "_properties_v_published_locale_idx" ON "_properties_v" USING btree ("published_locale");
  CREATE INDEX "_properties_v_latest_idx" ON "_properties_v" USING btree ("latest");
  CREATE INDEX "_properties_v_autosave_idx" ON "_properties_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_properties_v_locales_locale_parent_id_unique" ON "_properties_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_properties_v_rels_order_idx" ON "_properties_v_rels" USING btree ("order");
  CREATE INDEX "_properties_v_rels_parent_idx" ON "_properties_v_rels" USING btree ("parent_id");
  CREATE INDEX "_properties_v_rels_path_idx" ON "_properties_v_rels" USING btree ("path");
  CREATE INDEX "_properties_v_rels_amenities_id_idx" ON "_properties_v_rels" USING btree ("amenities_id");
  CREATE INDEX "enquiries_property_idx" ON "enquiries" USING btree ("property_id");
  CREATE INDEX "enquiries_type_idx" ON "enquiries" USING btree ("type");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_area_idx" ON "articles" USING btree ("area_id");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_properties_id_idx" ON "articles_rels" USING btree ("properties_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_area_idx" ON "_articles_v" USING btree ("version_area_id");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_properties_id_idx" ON "_articles_v_rels" USING btree ("properties_id");
  CREATE UNIQUE INDEX "areas_slug_idx" ON "areas" USING btree ("slug");
  CREATE INDEX "areas_image_idx" ON "areas" USING btree ("image_id");
  CREATE INDEX "areas_updated_at_idx" ON "areas" USING btree ("updated_at");
  CREATE INDEX "areas_created_at_idx" ON "areas" USING btree ("created_at");
  CREATE UNIQUE INDEX "areas_locales_locale_parent_id_unique" ON "areas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "amenities_updated_at_idx" ON "amenities" USING btree ("updated_at");
  CREATE INDEX "amenities_created_at_idx" ON "amenities" USING btree ("created_at");
  CREATE UNIQUE INDEX "amenities_locales_locale_parent_id_unique" ON "amenities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("areas_id");
  CREATE INDEX "payload_locked_documents_rels_amenities_id_idx" ON "payload_locked_documents_rels" USING btree ("amenities_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "properties_gallery" CASCADE;
  DROP TABLE "properties_booking_links" CASCADE;
  DROP TABLE "properties" CASCADE;
  DROP TABLE "properties_locales" CASCADE;
  DROP TABLE "properties_rels" CASCADE;
  DROP TABLE "_properties_v_version_gallery" CASCADE;
  DROP TABLE "_properties_v_version_booking_links" CASCADE;
  DROP TABLE "_properties_v" CASCADE;
  DROP TABLE "_properties_v_locales" CASCADE;
  DROP TABLE "_properties_v_rels" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "areas" CASCADE;
  DROP TABLE "areas_locales" CASCADE;
  DROP TABLE "amenities" CASCADE;
  DROP TABLE "amenities_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_properties_type";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum__properties_v_version_type";
  DROP TYPE "public"."enum__properties_v_version_status";
  DROP TYPE "public"."enum__properties_v_published_locale";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_amenities_category";
  DROP TYPE "public"."enum_users_role";`)
}
