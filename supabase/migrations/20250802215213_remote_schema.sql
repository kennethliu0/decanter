

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."application_field_type" AS ENUM (
    'long',
    'short'
);


ALTER TYPE "public"."application_field_type" OWNER TO "postgres";


CREATE TYPE "public"."division" AS ENUM (
    'B',
    'C'
);


ALTER TYPE "public"."division" OWNER TO "postgres";


CREATE TYPE "public"."tournament_summary" AS (
	"tour_name" "text",
	"tour_division" "public"."division",
	"tour_image" "text"
);


ALTER TYPE "public"."tournament_summary" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."accept_invite"("invite_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$DECLARE
  v_user_id UUID;
  v_user_email text;
  v_tour_id UUID;
  tour_slug text;
BEGIN
  -- Get the authenticated user from JWT
  v_user_id := auth.uid();
  v_user_email := auth.email();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHORIZED: user is not authenticated';
  END IF;

  -- Get the tournament_id from the invite
  SELECT tournament_id INTO v_tour_id
  FROM tournament_invites
  WHERE id = invite_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: invite id not found in tournament_invites table';
  END IF;



  SELECT slug INTO tour_slug
  FROM tournaments WHERE id=v_tour_id;

  -- Prevent duplicates
  IF EXISTS (
    SELECT 1 FROM tournament_admins
    WHERE user_id = v_user_id AND tournament_id = v_tour_id
  ) THEN
    RETURN tour_slug;
  END IF;

  -- Insert into tournament_admins
  INSERT INTO tournament_admins (user_id, tournament_id, email)
  VALUES (v_user_id, v_tour_id, v_user_email);

  RETURN tour_slug;
END;$$;


ALTER FUNCTION "public"."accept_invite"("invite_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_invite_info"("invite_id" "uuid") RETURNS "public"."tournament_summary"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$DECLARE
  v_user_id UUID;
  v_tour_id UUID;
  tour_name text;
  tour_division division;
  tour_image text;
BEGIN
  -- Get the authenticated user from JWT
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHORIZED: user is not authenticated';
  END IF;

  -- Get the tournament_id from the invite
  SELECT tournament_id INTO v_tour_id
  FROM tournament_invites
  WHERE id = invite_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_FOUND: invite id not found in tournament_invites table';
  END IF;

  SELECT name, division, image_url INTO tour_name, tour_division, tour_image
  FROM tournaments
  WHERE id = v_tour_id;

  RETURN (tour_name, tour_division, tour_image);
END;$$;


ALTER FUNCTION "public"."get_invite_info"("invite_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."tournament_admins" (
    "tournament_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text"
);


ALTER TABLE "public"."tournament_admins" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_applications" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "tournament_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "responses" "jsonb",
    "preferences" "text"[],
    "submitted" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tournament_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournament_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tournament_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."tournament_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tournaments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "website_url" "text",
    "name" "text",
    "location" "text",
    "closed_early" boolean,
    "start_date" "date",
    "end_date" "date",
    "apply_deadline" timestamp with time zone,
    "division" "public"."division",
    "created_by" "uuid" DEFAULT "gen_random_uuid"(),
    "approved" boolean DEFAULT false,
    "application_fields" "jsonb"[],
    "slug" "text"
);


ALTER TABLE "public"."tournaments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."volunteer_profiles" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "name" "text",
    "education" "text",
    "bio" "text",
    "experience" "text",
    "preferences_b" "text"[],
    "preferences_c" "text"[],
    "email" character varying
);


ALTER TABLE "public"."volunteer_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."tournament_admins"
    ADD CONSTRAINT "tournament_admins_pkey" PRIMARY KEY ("tournament_id", "user_id");



ALTER TABLE ONLY "public"."tournament_applications"
    ADD CONSTRAINT "tournament_applications_pkey" PRIMARY KEY ("user_id", "tournament_id");



ALTER TABLE ONLY "public"."tournament_invites"
    ADD CONSTRAINT "tournament_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournament_invites"
    ADD CONSTRAINT "tournament_invites_tournament_id_key" UNIQUE ("tournament_id");



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."volunteer_profiles"
    ADD CONSTRAINT "volunteer_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."volunteer_profiles"
    ADD CONSTRAINT "volunteer_profiles_email_key" UNIQUE ("email");



CREATE INDEX "tournament_admins_user_id_idx" ON "public"."tournament_admins" USING "btree" ("user_id");



CREATE INDEX "tournaments_start_date_idx" ON "public"."tournaments" USING "btree" ("start_date");



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."tournament_applications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."tournaments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_timestamp" BEFORE UPDATE ON "public"."volunteer_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."tournament_admins"
    ADD CONSTRAINT "tournament_admins_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_admins"
    ADD CONSTRAINT "tournament_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_applications"
    ADD CONSTRAINT "tournament_applications_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_applications"
    ADD CONSTRAINT "tournament_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_applications"
    ADD CONSTRAINT "tournament_applications_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."volunteer_profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournament_invites"
    ADD CONSTRAINT "tournament_invites_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tournaments"
    ADD CONSTRAINT "tournaments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."volunteer_profiles"
    ADD CONSTRAINT "volunteer_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable delete for tournament admins" ON "public"."tournaments" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."tournament_id" = "tournaments"."id") AND ("tournament_admins"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."tournaments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for self" ON "public"."tournament_applications" FOR INSERT WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Enable insert for tournament creators only" ON "public"."tournament_admins" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tournaments"
  WHERE (("tournaments"."id" = "tournament_admins"."tournament_id") AND ("tournaments"."created_by" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Enable read access for authenticated users" ON "public"."tournament_admins" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for authenticated users only" ON "public"."tournaments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update for tournament admins" ON "public"."tournaments" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."tournament_id" = "tournaments"."id") AND ("tournament_admins"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."tournament_id" = "tournaments"."id") AND ("tournament_admins"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Read access for admins or self" ON "public"."tournament_applications" FOR SELECT TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR (EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("tournament_admins"."tournament_id" = "tournament_admins"."tournament_id"))))));



CREATE POLICY "Tournament admins can access invites" ON "public"."tournament_invites" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."tournament_id" = "tournament_invites"."tournament_id") AND (( SELECT "auth"."uid"() AS "uid") = "tournament_admins"."user_id")))));



CREATE POLICY "Tournament admins can create invites" ON "public"."tournament_invites" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tournament_admins"
  WHERE (("tournament_admins"."tournament_id" = "tournament_invites"."tournament_id") AND (( SELECT "auth"."uid"() AS "uid") = "tournament_admins"."user_id")))));



CREATE POLICY "Update access for self" ON "public"."tournament_applications" FOR UPDATE USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can insert their own profiles" ON "public"."volunteer_profiles" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update their own profiles" ON "public"."volunteer_profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Volunteer profiles are viewable only by authenticated users" ON "public"."volunteer_profiles" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."tournament_admins" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournament_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tournaments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."volunteer_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."accept_invite"("invite_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."accept_invite"("invite_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."accept_invite"("invite_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_invite_info"("invite_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_invite_info"("invite_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_invite_info"("invite_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."tournament_admins" TO "anon";
GRANT ALL ON TABLE "public"."tournament_admins" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_admins" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_applications" TO "anon";
GRANT ALL ON TABLE "public"."tournament_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_applications" TO "service_role";



GRANT ALL ON TABLE "public"."tournament_invites" TO "anon";
GRANT ALL ON TABLE "public"."tournament_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament_invites" TO "service_role";



GRANT ALL ON TABLE "public"."tournaments" TO "anon";
GRANT SELECT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."tournaments" TO "authenticated";
GRANT ALL ON TABLE "public"."tournaments" TO "service_role";



GRANT SELECT("id"),INSERT("id"),UPDATE("id") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("created_at"),INSERT("created_at"),UPDATE("created_at") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("updated_at"),INSERT("updated_at"),UPDATE("updated_at") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("image_url"),INSERT("image_url"),UPDATE("image_url") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("website_url"),INSERT("website_url"),UPDATE("website_url") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("name"),INSERT("name"),UPDATE("name") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("location"),INSERT("location"),UPDATE("location") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("closed_early"),INSERT("closed_early"),UPDATE("closed_early") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("start_date"),INSERT("start_date"),UPDATE("start_date") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("end_date"),INSERT("end_date"),UPDATE("end_date") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("apply_deadline"),INSERT("apply_deadline"),UPDATE("apply_deadline") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("division"),INSERT("division"),UPDATE("division") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("created_by"),INSERT("created_by"),UPDATE("created_by") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("application_fields"),INSERT("application_fields"),UPDATE("application_fields") ON TABLE "public"."tournaments" TO "authenticated";



GRANT SELECT("slug"),INSERT("slug") ON TABLE "public"."tournaments" TO "authenticated";



GRANT ALL ON TABLE "public"."volunteer_profiles" TO "anon";
GRANT ALL ON TABLE "public"."volunteer_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."volunteer_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
