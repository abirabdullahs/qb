# Online Smart Question Bank — Project Structure

Stack assumed: Next.js (App Router) + TypeScript + PostgreSQL + Drizzle ORM + Zod

Design principle: **start lean, grow by need.** Only 3 core domains at launch
(`academic`, `admission`, `question`) — others get added when you actually
build that feature, not before. This avoids maintaining 40+ empty folders
before writing real code.

```
question-bank/
│
├── src/
│   │
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                        # homepage
│   │   │   ├── questions/
│   │   │   │   ├── page.tsx                     # browse/filter questions
│   │   │   │   └── [questionId]/page.tsx        # single question view
│   │   │   ├── practice/
│   │   │   │   └── [subjectId]/page.tsx         # chapter/topic-wise practice
│   │   │   └── mock-tests/
│   │   │       ├── page.tsx
│   │   │       └── [setId]/page.tsx             # take a question_set as a test
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── questions/
│   │   │       │   ├── page.tsx                 # contributor's question list
│   │   │       │   ├── new/page.tsx              # add question (MCQ/CQ/Written)
│   │   │       │   └── [questionId]/edit/page.tsx
│   │   │       ├── review/
│   │   │       │   └── page.tsx                  # moderator approve/reject queue
│   │   │       ├── question-sets/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [setId]/edit/page.tsx
│   │   │       ├── taxonomy/                      # academic curriculum admin
│   │   │       │   ├── subjects/page.tsx
│   │   │       │   ├── chapters/page.tsx
│   │   │       │   └── topics/page.tsx
│   │   │       └── admissions/                     # exams/units/institutes admin
│   │   │           ├── exams/page.tsx
│   │   │           ├── units/page.tsx
│   │   │           └── institutes/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── questions/
│   │   │   │   ├── route.ts                        # GET (list+filter), POST (create)
│   │   │   │   └── [questionId]/route.ts            # GET, PATCH, DELETE
│   │   │   ├── question-sets/route.ts
│   │   │   ├── upload/route.ts                       # image upload -> attachments
│   │   │   └── health/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── domains/
│   │   │
│   │   ├── academic/                    # segments, groups, boards, subjects,
│   │   │   │                            # chapters, topics, sub_topics
│   │   │   ├── components/
│   │   │   │   ├── CurriculumTree.tsx    # subject -> chapter -> topic picker
│   │   │   │   ├── SubjectForm.tsx
│   │   │   │   ├── ChapterForm.tsx
│   │   │   │   └── TopicForm.tsx
│   │   │   ├── server/
│   │   │   │   ├── academic.service.ts   # one service file covers segment/group/
│   │   │   │   ├── academic.repository.ts # subject/chapter/topic/board — split
│   │   │   │   └── academic.queries.ts    # later ONLY if a file gets too big
│   │   │   ├── validations/
│   │   │   │   └── academic.schema.ts     # zod schemas for all sub-entities
│   │   │   ├── types/
│   │   │   │   └── academic.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── admission/                   # admission_segments, institutes,
│   │   │   │                            # admission_exams, admission_units,
│   │   │   │                            # admission_unit_institutes
│   │   │   ├── components/
│   │   │   │   ├── AdmissionExamForm.tsx
│   │   │   │   ├── ExamTypeSelector.tsx  # single_institute / cluster / centralized
│   │   │   │   ├── ClusterUnitBuilder.tsx # A/B/C unit + institute mapping
│   │   │   │   └── InstituteSelector.tsx
│   │   │   ├── server/
│   │   │   │   ├── admission.service.ts   # holds the exam_type branching logic —
│   │   │   │   │                          # e.g. cluster needs units, centralized
│   │   │   │   │                          # needs neither institute nor unit
│   │   │   │   ├── admission.repository.ts
│   │   │   │   └── admission.queries.ts
│   │   │   ├── validations/
│   │   │   │   └── admission.schema.ts    # zod .refine() to enforce exam_type rules
│   │   │   ├── types/
│   │   │   │   └── admission.types.ts
│   │   │   ├── constants/
│   │   │   │   └── exam-types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── question/                    # questions, question_options,
│   │   │   │                            # question_sub_parts, question_boards
│   │   │   ├── components/
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── QuestionRenderer.tsx  # renders stimulus + body, math-aware
│   │   │   │   ├── QuestionForm.tsx      # shared fields: subject/chapter/topic,
│   │   │   │   │                         # segment, difficulty, year, marks...
│   │   │   │   ├── mcq/
│   │   │   │   │   ├── MCQEditor.tsx
│   │   │   │   │   └── MCQOptionList.tsx
│   │   │   │   ├── cq/
│   │   │   │   │   ├── CQEditor.tsx      # উদ্দীপক + ক/খ/গ/ঘ builder
│   │   │   │   │   └── CQSubPartList.tsx
│   │   │   │   ├── written/
│   │   │   │   │   └── WrittenEditor.tsx
│   │   │   │   └── filters/
│   │   │   │       └── QuestionFilters.tsx  # segment/subject/chapter/type/year/board
│   │   │   ├── server/
│   │   │   │   ├── question.service.ts    # create/update/delete orchestration
│   │   │   │   ├── question.repository.ts
│   │   │   │   ├── question.queries.ts    # filtered/paginated fetch queries
│   │   │   │   └── duplicate-hash.ts       # generates duplicate_hash on create
│   │   │   ├── validations/
│   │   │   │   ├── question.schema.ts      # base fields + academic/admission .refine()
│   │   │   │   ├── mcq.schema.ts
│   │   │   │   └── cq.schema.ts
│   │   │   ├── types/
│   │   │   │   └── question.types.ts
│   │   │   ├── constants/
│   │   │   │   ├── question-types.ts       # MCQ / CQ / WRITTEN
│   │   │   │   ├── difficulty-levels.ts
│   │   │   │   └── cq-styles.ts            # গ_ঘ_separate / গ_ঘ_combined
│   │   │   └── index.ts
│   │   │
│   │   └── content/                     # shared LaTeX/rich-text handling —
│   │       │                            # used by question, mcq option,
│   │       │                            # cq sub_part, explanation, answer
│   │       ├── components/
│   │       │   ├── RichTextEditor.tsx
│   │       │   ├── MathEditor.tsx        # LaTeX input helper
│   │       │   └── LatexRenderer.tsx     # KaTeX/MathJax render, respects has_math
│   │       ├── utils/
│   │       │   ├── detect-math.ts        # sets has_math flag automatically
│   │       │   └── sanitize-html.ts
│   │       └── index.ts
│   │
│   ├── components/                       # generic, no domain knowledge
│   │   ├── ui/                           # Button, Input, Select, Dialog, Table...
│   │   ├── layout/                       # Navbar, Sidebar, DashboardShell
│   │   └── feedback/                     # EmptyState, ErrorState, LoadingState
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema/
│   │   │   │   ├── academic.ts            # segments, groups, boards, subjects,
│   │   │   │   │                          # chapters, topics, sub_topics (one file —
│   │   │   │   │                          # they're tightly related & small)
│   │   │   │   ├── admission.ts           # admission_segments, institutes,
│   │   │   │   │                          # admission_exams, admission_units,
│   │   │   │   │                          # admission_unit_institutes
│   │   │   │   ├── questions.ts           # questions, question_options,
│   │   │   │   │                          # question_sub_parts, question_boards
│   │   │   │   ├── attachments.ts
│   │   │   │   ├── tags.ts                # tags, question_tags
│   │   │   │   ├── question-sets.ts       # question_sets, question_set_items
│   │   │   │   ├── stats.ts               # question_stats
│   │   │   │   ├── users.ts
│   │   │   │   └── index.ts               # re-exports everything for Drizzle
│   │   │   └── transactions.ts            # wraps multi-table question creation
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.ts
│   │   │   └── permissions.ts             # role checks: admin/moderator/teacher/contributor
│   │   │
│   │   ├── storage/                       # image upload -> attachments table
│   │   │   ├── storage.provider.ts        # interface
│   │   │   └── s3.provider.ts             # or local/R2 — swap later, no rewrite
│   │   │
│   │   ├── http/
│   │   │   ├── api-response.ts
│   │   │   └── error-handler.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── slugify.ts
│   │       └── pagination.ts
│   │
│   ├── config/
│   │   └── app.config.ts
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   │
│   └── types/
│       └── api.types.ts                   # generic API envelope types
│
├── db/
│   ├── migrations/                        # drizzle-kit generated
│   └── seeds/
│       ├── boards.seed.ts                 # ঢাকা, রাজশাহী, কুমিল্লা...
│       ├── segments.seed.ts               # SSC, HSC, Admission
│       └── admission.seed.ts              # sample exams: BUET (single_institute),
│                                           # GST (cluster), Medical (centralized)
│
├── scripts/
│   └── import-questions.ts                # bulk CSV/JSON import helper
│
├── docs/
│   └── database.md                        # ER notes, exam_type rules explained
│
├── .env.example
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## কেন এই structure — মূল সিদ্ধান্তগুলো

**১. মাত্র ৪টা domain দিয়ে শুরু (academic, admission, question, content)**
আপনার আগের প্রস্তাবে ১১টা domain ছিল (review, statistics, search, tag, attachment আলাদা আলাদা)। বাস্তবে এগুলোর বেশিরভাগ ছোট এবং `question` domain এর সাথেই এত ঘনিষ্ঠ যে আলাদা folder tree আগেভাগে বানালে শুধু navigation-ই কঠিন হয়। যেমন:
- `review` (status/approve/reject) → `question.service.ts` এর ভেতরেই ২-৩টা ফাংশন হিসেবে থাকুক, feature বড় হলে (review history, reviewer comments ইত্যাদি) তখন আলাদা domain করুন।
- `tags`, `attachments`, `stats` → এগুলো ছোট, `lib/db/schema` এ টেবিল আছে, দরকার হলে ছোট `server/` ফাইল হিসেবে question domain এর ভেতরেই রাখুন।
- `search` → শুরুতে `question.queries.ts` এর ভেতর filter+search logic থাকুক; পরে Postgres full-text/GIN index যোগ করার সময় আলাদা করবেন।

**২. প্রতি sub-entity তে ৩ ফাইল (service/repository/queries) না রেখে, domain-level এ ১-২টা ফাইল**
`academic` domain এ segment, group, subject, chapter, topic — প্রতিটার জন্য আলাদা service না বানিয়ে একটা `academic.service.ts` এ সব রাখা শুরুতে অনেক দ্রুত develop করা যায়। ফাইল ৩০০+ লাইন হয়ে গেলে তখন split করুন (সেটা easy refactor)।

**৩. `admission.service.ts` এ exam_type branching logic কেন্দ্রীভূত**
আপনার schema তে `single_institute` / `cluster` / `centralized` — তিন ধরনের ভিন্ন business rule আছে (কোনটায় institute লাগবে, কোনটায় unit)। এই logic একটাই জায়গায় (`admission.service.ts` + zod `.refine()`) থাকা উচিত, না হলে component গুলোতে duplicate validation ছড়িয়ে যাবে।

**৪. `content` domain আলাদা রাখা হয়েছে**
কারণ LaTeX rendering ও `has_math` detection question, option, CQ sub-part, explanation — সব জায়গায় লাগবে। এটা truly shared, তাই generic `components/` এ না রেখে নিজের ছোট domain এ রাখা ঠিক আছে।

**৫. Feature বাড়লে যা যোগ করবেন (এখনই বানাবেন না):**
- `domains/review/` — যখন review history/comment ফিচার আসবে
- `domains/statistics/` — যখন analytics dashboard বানাবেন
- `domains/search/` — যখন Postgres full-text search implement করবেন
- `tests/` — feature stabilize হওয়ার পর

এই approach এ আপনি আসল feature (question add/edit, MCQ/CQ builder, admission exam logic) দ্রুত বানাতে পারবেন, আর architecture organically বড় হবে দরকার অনুযায়ী, আগে থেকে ফাঁকা ফোল্ডারের বোঝা ছাড়াই।