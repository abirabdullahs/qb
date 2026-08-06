CREATE TABLE "admission_exams" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_segment_id" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"exam_year" smallint NOT NULL,
	"conducting_body" varchar(100),
	"exam_type" varchar(20) NOT NULL,
	"institute_id" integer,
	"negative_marking" numeric(4, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(20),
	CONSTRAINT "admission_segments_name_unique" UNIQUE("name"),
	CONSTRAINT "admission_segments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "admission_unit_institutes" (
	"unit_id" integer NOT NULL,
	"institute_id" integer NOT NULL,
	CONSTRAINT "admission_unit_institutes_unit_id_institute_id_pk" PRIMARY KEY("unit_id","institute_id")
);
--> statement-breakpoint
CREATE TABLE "admission_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_exam_id" integer NOT NULL,
	"unit_name" varchar(20) NOT NULL,
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"attachable_type" varchar(30) NOT NULL,
	"attachable_id" bigint NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"alt_text" varchar(255),
	"order_no" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20),
	CONSTRAINT "boards_name_unique" UNIQUE("name"),
	CONSTRAINT "boards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"order_no" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"segment_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "institutes" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_segment_id" integer NOT NULL,
	"name" varchar(150) NOT NULL,
	"short_name" varchar(50),
	"location" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "question_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL,
	"board_id" integer NOT NULL,
	"year" smallint
);
--> statement-breakpoint
CREATE TABLE "question_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL,
	"option_label" varchar(1) NOT NULL,
	"option_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"explanation_text" text,
	"order_no" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "question_set_items" (
	"set_id" integer NOT NULL,
	"question_id" bigint NOT NULL,
	"order_no" integer DEFAULT 0,
	"marks_override" numeric(5, 2),
	CONSTRAINT "question_set_items_set_id_question_id_pk" PRIMARY KEY("set_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "question_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"segment_id" integer,
	"negative_marking" numeric(4, 2) DEFAULT '0',
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_stats" (
	"question_id" bigint PRIMARY KEY NOT NULL,
	"attempt_count" bigint DEFAULT 0 NOT NULL,
	"correct_count" bigint DEFAULT 0 NOT NULL,
	"avg_time_seconds" numeric(8, 2),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_sub_parts" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" bigint NOT NULL,
	"part_label" varchar(5) NOT NULL,
	"part_text" text NOT NULL,
	"marks" numeric(4, 2),
	"cognitive_level" varchar(20),
	"answer_text" text,
	"explanation_text" text,
	"order_no" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "question_tags" (
	"question_id" bigint NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "question_tags_question_id_tag_id_pk" PRIMARY KEY("question_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"segment_id" integer NOT NULL,
	"group_id" integer,
	"admission_segment_id" integer,
	"admission_exam_id" integer,
	"admission_unit_id" integer,
	"institute_id" integer,
	"subject_id" integer NOT NULL,
	"chapter_id" integer,
	"topic_id" integer,
	"sub_topic_id" integer,
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
	"contributor_id" integer,
	"reviewed_by" integer,
	"duplicate_hash" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(20) NOT NULL,
	"segment_kind" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "segments_name_unique" UNIQUE("name"),
	CONSTRAINT "segments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "sub_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"order_no" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "subject_groups" (
	"subject_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	CONSTRAINT "subject_groups_subject_id_group_id_pk" PRIMARY KEY("subject_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(20),
	CONSTRAINT "subjects_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"concept" text,
	"order_no" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150),
	"password_hash" text,
	"role" varchar(20) DEFAULT 'contributor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admission_exams" ADD CONSTRAINT "admission_exams_admission_segment_id_admission_segments_id_fk" FOREIGN KEY ("admission_segment_id") REFERENCES "public"."admission_segments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_exams" ADD CONSTRAINT "admission_exams_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_unit_institutes" ADD CONSTRAINT "admission_unit_institutes_unit_id_admission_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."admission_units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_unit_institutes" ADD CONSTRAINT "admission_unit_institutes_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_units" ADD CONSTRAINT "admission_units_admission_exam_id_admission_exams_id_fk" FOREIGN KEY ("admission_exam_id") REFERENCES "public"."admission_exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_segment_id_segments_id_fk" FOREIGN KEY ("segment_id") REFERENCES "public"."segments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutes" ADD CONSTRAINT "institutes_admission_segment_id_admission_segments_id_fk" FOREIGN KEY ("admission_segment_id") REFERENCES "public"."admission_segments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_boards" ADD CONSTRAINT "question_boards_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_boards" ADD CONSTRAINT "question_boards_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_set_items" ADD CONSTRAINT "question_set_items_set_id_question_sets_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."question_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_set_items" ADD CONSTRAINT "question_set_items_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_segment_id_segments_id_fk" FOREIGN KEY ("segment_id") REFERENCES "public"."segments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_stats" ADD CONSTRAINT "question_stats_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_sub_parts" ADD CONSTRAINT "question_sub_parts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_segment_id_segments_id_fk" FOREIGN KEY ("segment_id") REFERENCES "public"."segments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_admission_segment_id_admission_segments_id_fk" FOREIGN KEY ("admission_segment_id") REFERENCES "public"."admission_segments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_admission_exam_id_admission_exams_id_fk" FOREIGN KEY ("admission_exam_id") REFERENCES "public"."admission_exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_admission_unit_id_admission_units_id_fk" FOREIGN KEY ("admission_unit_id") REFERENCES "public"."admission_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_institute_id_institutes_id_fk" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_sub_topic_id_sub_topics_id_fk" FOREIGN KEY ("sub_topic_id") REFERENCES "public"."sub_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_contributor_id_users_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_topics" ADD CONSTRAINT "sub_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_groups" ADD CONSTRAINT "subject_groups_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject_groups" ADD CONSTRAINT "subject_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;