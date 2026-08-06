CREATE TABLE IF NOT EXISTS "segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"code" varchar(20) NOT NULL UNIQUE,
	"segment_kind" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"segment_id" integer NOT NULL REFERENCES "segments"("id") ON DELETE cascade,
	"name" varchar(100) NOT NULL,
	"code" varchar(20)
);

CREATE TABLE IF NOT EXISTS "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL UNIQUE,
	"code" varchar(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS "admission_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"code" varchar(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS "institutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_segment_id" integer NOT NULL REFERENCES "admission_segments"("id") ON DELETE cascade,
	"name" varchar(150) NOT NULL,
	"short_name" varchar(50),
	"location" varchar(100)
);

CREATE TABLE IF NOT EXISTS "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL UNIQUE,
	"code" varchar(20)
);

CREATE TABLE IF NOT EXISTS "subject_groups" (
	"subject_id" integer NOT NULL REFERENCES "subjects"("id") ON DELETE cascade,
	"group_id" integer NOT NULL REFERENCES "groups"("id") ON DELETE cascade,
	CONSTRAINT "subject_groups_pkey" PRIMARY KEY("subject_id","group_id")
);

CREATE TABLE IF NOT EXISTS "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL REFERENCES "subjects"("id") ON DELETE cascade,
	"name" varchar(200) NOT NULL,
	"order_no" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL REFERENCES "chapters"("id") ON DELETE cascade,
	"name" varchar(200) NOT NULL,
	"order_no" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "sub_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL REFERENCES "topics"("id") ON DELETE cascade,
	"name" varchar(200) NOT NULL,
	"order_no" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150) UNIQUE,
	"password_hash" text,
	"role" varchar(20) DEFAULT 'contributor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "admission_exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_segment_id" integer NOT NULL REFERENCES "admission_segments"("id"),
	"name" varchar(150) NOT NULL,
	"exam_year" smallint NOT NULL,
	"conducting_body" varchar(100),
	"exam_type" varchar(20) NOT NULL,
	"institute_id" integer REFERENCES "institutes"("id"),
	"negative_marking" numeric(4, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "admission_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_exam_id" integer NOT NULL REFERENCES "admission_exams"("id") ON DELETE cascade,
	"unit_name" varchar(20) NOT NULL,
	"description" varchar(255)
);

CREATE TABLE IF NOT EXISTS "admission_unit_institutes" (
	"unit_id" integer NOT NULL REFERENCES "admission_units"("id") ON DELETE cascade,
	"institute_id" integer NOT NULL REFERENCES "institutes"("id") ON DELETE cascade,
	CONSTRAINT "admission_unit_institutes_pkey" PRIMARY KEY("unit_id","institute_id")
);

CREATE TABLE IF NOT EXISTS "questions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"segment_id" integer NOT NULL REFERENCES "segments"("id"),
	"group_id" integer REFERENCES "groups"("id"),
	"admission_segment_id" integer REFERENCES "admission_segments"("id"),
	"admission_exam_id" integer REFERENCES "admission_exams"("id"),
	"admission_unit_id" integer REFERENCES "admission_units"("id"),
	"institute_id" integer REFERENCES "institutes"("id"),
	"subject_id" integer NOT NULL REFERENCES "subjects"("id"),
	"chapter_id" integer REFERENCES "chapters"("id"),
	"topic_id" integer REFERENCES "topics"("id"),
	"sub_topic_id" integer REFERENCES "sub_topics"("id"),
	"question_type" varchar(10) NOT NULL,
	"stimulus_text" text,
	"question_text" text NOT NULL,
	"has_math" boolean DEFAULT false NOT NULL,
	"cq_style" varchar(20),
	"year" smallint,
	"exam_name" varchar(150),
	"is_previous_year" boolean DEFAULT false NOT NULL,
	"marks" numeric(5, 2),
	"difficulty" varchar(10) DEFAULT 'medium',
	"language" varchar(5) DEFAULT 'bn' NOT NULL,
	"answer_text" text,
	"explanation_text" text,
	"video_solution_url" varchar(255),
	"status" varchar(15) DEFAULT 'pending' NOT NULL,
	"contributor_id" integer REFERENCES "users"("id"),
	"reviewed_by" integer REFERENCES "users"("id"),
	"duplicate_hash" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "question_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"option_label" varchar(1) NOT NULL,
	"option_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"explanation_text" text,
	"order_no" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "question_sub_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"part_label" varchar(5) NOT NULL,
	"part_text" text NOT NULL,
	"marks" numeric(4, 2),
	"cognitive_level" varchar(20),
	"answer_text" text,
	"explanation_text" text,
	"order_no" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "question_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"board_id" integer NOT NULL REFERENCES "boards"("id"),
	"year" smallint
);

CREATE TABLE IF NOT EXISTS "attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"attachable_type" varchar(30) NOT NULL,
	"attachable_id" bigint NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"alt_text" varchar(255),
	"order_no" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "question_tags" (
	"question_id" bigint NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"tag_id" integer NOT NULL REFERENCES "tags"("id") ON DELETE cascade,
	CONSTRAINT "question_tags_pkey" PRIMARY KEY("question_id","tag_id")
);

CREATE TABLE IF NOT EXISTS "question_stats" (
	"question_id" bigint PRIMARY KEY NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"attempt_count" bigint DEFAULT 0 NOT NULL,
	"correct_count" bigint DEFAULT 0 NOT NULL,
	"avg_time_seconds" numeric(8, 2),
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "question_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"segment_id" integer REFERENCES "segments"("id"),
	"negative_marking" numeric(4, 2) DEFAULT '0',
	"created_by" integer REFERENCES "users"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "question_set_items" (
	"set_id" integer NOT NULL REFERENCES "question_sets"("id") ON DELETE cascade,
	"question_id" bigint NOT NULL REFERENCES "questions"("id") ON DELETE cascade,
	"order_no" integer DEFAULT 0,
	"marks_override" numeric(5, 2),
	CONSTRAINT "question_set_items_pkey" PRIMARY KEY("set_id","question_id")
);
