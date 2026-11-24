# SAP Mastery Hub deployment

The frontend and API run on Vercel. All application database records use MongoDB Atlas: users, hashed passwords, approval status, sessions, learning progress, assignments, quizzes, mentor conversations, announcements and rate limits. There is no PostgreSQL, SQLite or browser database fallback.

## Environment variables

- `MONGODB_URI`: Atlas driver connection URI with the database user's credentials. This is a server secret, never a `VITE_` variable.
- `MONGODB_DB`: database name, defaults to `sap_mastery`.
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: initial app administrator. Supply the chosen password through Vercel secrets; it is hashed before storage. No password is embedded in source. Password must have at least 12 characters. These variables create the administrator only on a new database; changing them does not reset an existing account.
- `APP_ORIGIN`: optional explicit browser origin. When unset, same-origin requests to the current deployment are accepted. Local Vite development uses `http://localhost:5173`.
- `GEMINI_API_KEY`: server-side Google API key for live mentor responses.
- `DAILY_RATE_LIMIT`: maximum daily AI requests, defaults to 5000.

Import your private environment file into Vercel Production, then deploy `main`. The repository's `vercel.json` configures installation, build and API routing. PostgreSQL variables are ignored by this version. Remove `ADMIN_PASSWORD` after successful administrator creation and redeploy; your login continues to work.

## Atlas connectivity

Use Atlas Connect > Drivers to obtain the Node.js connection URI. Atlas Network Access must permit connections from the deployed Vercel backend; adding only your laptop's IP does not authorize Vercel. Use the Atlas/Vercel integration or configure access for your deployment's outbound network. Database credentials and app login credentials are separate. Rotate database credentials exposed in screenshots before production use.

The backend reuses a MongoClient across warm invocations. Unique indexes prevent duplicate accounts, sessions expire after eight hours, and changing roles/status revokes sessions. Transactions protect concurrent learning-data updates and account deletion. Transactions require a replica set (Atlas supports this). Existing PostgreSQL records are not automatically copied; old data remains untouched.

## Development and checks

Run `npm install`, configure `.env` from `.env.example`, then `npm run dev`. Run `npm run build --prefix client` for the frontend. Run `npm test --prefix server` for API/authentication tests against an isolated temporary MongoDB replica set. The first test run downloads the MongoDB test binary; by default tests do not connect to Atlas. Alternatively set `MONGODB_TEST_URI` to run against a uniquely named disposable database on a test cluster; that test database is dropped afterward.


# SAP Modern ABAP, RAP & React Mastery Studio 🔷

A complete, production-grade full-stack web application designed for SAP developers, full-stack engineers, and solution architects mastering **Modern ABAP (7.50+ / 7.57+ / ABAP Cloud)**, **CDS View Entities**, **RAP Managed Business Objects (`strict ( 2 )`)**, **EML**, **OData V4**, and **React (Vite + Tailwind CSS)**.

---

## 🌟 Enhanced Masterclass Features (Blog & Book Edition)

Inspired by authoritative architectural references such as **[Discovering ABAP (RAP Model)](https://discoveringabap.com/abap-rap-model/)** and **[Medium SAP Innovation Hub (RAP Get-to-Know Series)](https://medium.com/sap-innovation-hub/restful-abap-programming-model-rap-get-to-know-series-part-1-c14929e8acb2)**, the studio provides an exhaustive developer book & vlog experience:

1. **🎙️ Lead Architect Vlog Hooks & Real-World War Stories**:
   - Every day opens with a Lead Architect keynote hook and a real-world enterprise production post-mortem / war story explaining how legacy anti-patterns cause system outages and how the modern RAP pattern prevents them.
2. **🔍 Exhaustive Keyword & Constructor Expression Deep-Dives**:
   - Every core module and language feature is defined across 6 architectural facets:
     - **Syntax Blueprint** (Modern syntax template)
     - **Simple Layman Analogy** (Everyday mental model / JS-TS equivalent)
     - **Official SAP Technical Definition** (Precise compiler semantics & Cloud language rules)
     - **Under the Hood** (Runtime roll area, HANA pushdown, static compilation checks)
     - **Common Senior Architect Pitfall** (Real-world bug warning & remediation)
     - **Modern Clean Core Code Example** (Live snippet with one-click copy)
   - Covers: `FINAL(var) vs DATA(var)`, `VALUE #( )`, `FOR`, `REDUCE #( )`, `COND #( )`, `SWITCH #( )`, `FILTER #( )`, `Modern Open SQL Comma Separation & @ Host Variables`, `IF_OO_ADT_CLASSRUN`, `DEFINE VIEW ENTITY`, `strict ( 2 )`, `IN LOCAL MODE`, `draft determine action Prepare`, `read by \_assoc`, and more!
3. **⚖️ The Showdown: Battle of the Elements (Element A vs Element B)**:
   - Side-by-side comparison cards (Concept, Syntax diffs, Pros & Cons, and Clean Core Verdicts).
   - Multi-metric runtime & architecture feature comparison matrix.
   - Pragmatic Senior Architect Production Advice.
   - Showdowns include:
     - *Classic Procedural Loops vs Modern Constructor Expressions*
     - *CDS DDIC-Based Views vs CDS View Entities*
     - *Legacy BOPF / OData V2 vs RESTful ABAP Programming Model (RAP)*
     - *Managed RAP vs Unmanaged RAP*
     - *RAP Determinations vs RAP Validations*
     - *Internal EML (`IN LOCAL MODE`) vs External EML & Direct SQL*
     - *Standard Active Instance vs Draft-Enabled Business Objects*
     - *Instance-Bound Actions vs Static / Factory Actions*
     - *OData V2 State / Batches vs OData V4 Deep Operations*
     - *SAP UI5 Smart Templates vs Custom React 18 SPA + OData V4*
     - *Legacy RFC/BAPI Call vs React `fetch()` with CSRF Handshake*
     - *Standard Dynpro Modifications vs Clean Core Side-by-Side Extensibility*
     - *Classical ABAP Unit vs RAP Test Double Framework*
     - *Unmanaged Save Phase vs Managed Save with Additional Save*

---

## ⚡ Tech Stack & Architecture

- **Frontend (`/client`)**:
  - React 18 + Vite (SPA)
  - Tailwind CSS + `@tailwindcss/vite`
  - Lucide React Icons
  - Dark / Light Mode with automatic theme persistence
  - SaaS Toast Notification System (strictly no `window.alert` / `window.confirm`)
- **Backend API (`/server`)**:
  - Node.js + Express REST API
  - Persistent SQLite Database (`database.sqlite`) via `sql.js` (WebAssembly SQLite runtime with zero native compilation dependencies)
  - Auto-initializing schema and data seeding on first startup
  - Automated Clean Core & Modern ABAP Static Code Analyzer
  - Optional Google Gemini API proxy for live AI SAP Architect Mentoring
- **Monorepo Scripts**:
  - `concurrently` for running client & server simultaneously in development
  - Express static serving for single-port production execution

---

## 📂 Project Structure

```
Abap Rap chatbot/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header with streak, theme toggle, and JSON export
│   │   │   ├── Sidebar.jsx        # Navigation & overall mastery progress bar
│   │   │   ├── Toast.jsx          # SaaS floating toast alerts
│   │   │   ├── CodeBlock.jsx      # Syntax highlighting + line-by-line annotations
│   │   │   └── ConfirmModal.jsx   # Non-blocking confirmation modal
│   │   ├── data/
│   │   │   ├── priorities.js      # 8 Mandatory Priorities (Sequence 1 → 8)
│   │   │   ├── roadmap.js         # 14-Day Intensive Curriculum
│   │   │   ├── lessons.js         # 14 Deep Lessons (2-level teaching + code + labs)
│   │   │   ├── projects.js        # 18 Projects (20-step lifecycle + full code)
│   │   │   ├── architecture.js    # 5-Layer full-stack architecture model
│   │   │   ├── knowledgeBase.js   # Live-searchable Modern SAP Knowledge Base
│   │   │   └── quizData.js        # 10-Question Technical Competency Assessment
│   │   ├── services/
│   │   │   └── api.js             # REST API client connecting to /api/*
│   │   ├── views/
│   │   │   ├── DashboardView.jsx
│   │   │   ├── RoadmapView.jsx
│   │   │   ├── LessonsView.jsx
│   │   │   ├── ProjectsView.jsx
│   │   │   ├── ArchitectureView.jsx
│   │   │   └── MentorQuizView.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── db.js                  # SQLite persistence & data access layer
│   │   ├── cleanCoreValidator.js  # Clean Core static analyzer & mentor engine
│   │   └── index.js               # Express server & REST endpoints
│   ├── database.sqlite            # Persistent SQLite database file
│   └── package.json
├── package.json                   # Root monorepo scripts (concurrently)
└── README.md                      # Documentation & setup guide
```

---

## 🚀 Quickstart & Setup Commands

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24.20.0)
- **npm** v9+

### 2. Installation
Run the all-in-one installation script from the root repository:
```bash
npm run install:all
```
*(Or install each folder manually: `npm install && cd server && npm install && cd ../client && npm install`)*

### 3. Run in Development Mode
Start both the Express backend API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

### 4. Build & Run in Production Mode
```bash
# Build React client into static assets (client/dist)
npm run build

# Start the Express server (serves both API & React SPA on http://localhost:5000)
npm start
```

---

## 💾 SQLite Database Schema

The SQLite database (`server/database.sqlite`) auto-initializes the following tables:

| Table | Columns | Purpose |
| :--- | :--- | :--- |
| `user_progress` | `id`, `completed_days`, `solved_exercises`, `best_quiz_score`, `streak`, `active_theme`, `updated_at` | Tracks roadmap progress, exercise completions, streak, and theme preference |
| `project_checklists` | `id`, `project_id`, `step_index`, `completed` | Persists individual 20-step lifecycle progress for each of the 18 projects |
| `assignment_submissions`| `id`, `lesson_id`, `user_code`, `status`, `architect_feedback`, `submitted_at` | Stores submitted ABAP/RAP code and Clean Core ATC grading feedback |
| `quiz_attempts` | `id`, `score`, `total`, `answers_json`, `created_at` | Historical log of technical quiz attempts |
| `mentor_messages` | `id`, `role`, `content`, `created_at` | Multi-turn AI SAP Architect chat history |

---

## 🌐 REST API Endpoints

- `GET /api/progress` — Fetch user learning streak, completed days, and solved exercises
- `PUT /api/progress` — Update progress milestones and theme
- `POST /api/progress/reset` — Reset all progress to initial clean state
- `GET /api/projects` — Fetch all 20-step project checklist states
- `PUT /api/projects/:id/steps` — Toggle a specific project lifecycle step
- `POST /api/assignments/submit` — Submit code for automated Clean Core ATC validation
- `GET /api/assignments/:lessonId` — Get past submissions for a lesson
- `GET /api/mentor/messages` — Fetch AI Architect conversation history
- `POST /api/mentor/chat` — Chat with AI Mentor (analyzes code snippets & optionally proxies to Gemini API)
- `DELETE /api/mentor/messages` — Clear chat history
- `POST /api/quiz/attempt` — Save quiz score & answers
- `GET /api/quiz/history` — Get past quiz scores
- `GET /api/export` — Download complete SQLite state as a `.json` backup

---

## 🏛️ The 8 Mandatory Priorities Sequence

1. **Modern ABAP Expressions**: Inline `DATA/FINAL`, `VALUE`, `COND`, `SWITCH`, `REDUCE`, `FILTER`, `FOR`, String Templates.
2. **CDS View Entities**: `DEFINE ROOT VIEW ENTITY`, Associations, Compositions, and DCL Access Controls.
3. **RAP Managed BOs**: Root & Child entities, Lock Master, Numbering: Managed UUID.
4. **BDEF, Validations & Determinations**: `strict ( 2 );`, `validate on save`, `determine on modify`.
5. **Service Exposure & OData V4**: Service Definitions (`EXPOSE`) and Service Bindings (`OData V4 - Web API`).
6. **React + RAP Integration**: Modular `fetch()` service, `X-CSRF-Token` handshake, delta `PATCH`, and `error.details` parsing.
7. **Draft Handling, EML & Actions**: Draft tables, `PREPARE` action, bound custom actions, and dynamic Feature Control.
8. **ABAP Cloud & Clean Core**: Language Version 5 (Cloud), Level A Released APIs (`I_BusinessPartner`, `I_Product`), and ATC Quality Governance.

---

## 🛡️ Clean Core & Modern ABAP Static Rules Enforced

The built-in analyzer automatically blocks classic legacy constructs:
- ❌ **Classic `WRITE`** ➔ Replaced by `out->write()` in `IF_OO_ADT_CLASSRUN` or OData V4 exposure.
- ❌ **Direct table reads (`SELECT * FROM but000 / mara / vbak`)** ➔ Replaced by released Level A CDS view entities (`I_BusinessPartner`, `I_Product`, `I_SalesOrderTP`).
- ❌ **Obsolete `HEADER LINE` / `OCCURS 0`** ➔ Replaced by explicit table types `WITH EMPTY KEY` and inline `VALUE #( )`.
- ❌ **Subroutines (`FORM / PERFORM`)** ➔ Replaced by Object-Oriented ABAP methods.
- ❌ **Missing `strict ( 2 );` in RAP BDEF** ➔ Enforced for cloud certification.
- ❌ **Missing `IN LOCAL MODE` in internal EML queries** ➔ Enforced to bypass external authorization overhead.
- ❌ **React missing `X-CSRF-Token` or using `PUT` instead of `PATCH`** ➔ Flagged with instant remediation guides.

---

## 📜 License
MIT License. Built for SAP S/4HANA & BTP ABAP Cloud Practitioners.
