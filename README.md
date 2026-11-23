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

SQLite authentication setup
---------------------------
Run the Express backend and serve the built client from it. Standalone Vercel API handlers are disabled; they do not provide SQLite persistence.

Set these server environment variables before first startup:
- ADMIN_USERNAME: initial administrator username
- ADMIN_EMAIL: administrator email
- ADMIN_PASSWORD: a unique password of at least 12 characters (no default password)
- SQLITE_PATH: absolute path on persistent disk, optional; defaults to server/database.sqlite
- APP_ORIGIN: exact browser origin, e.g. https://your-domain.example (defaults to http://localhost:5173 for Vite development)
- NODE_ENV=production when deployed behind HTTPS

Run npm run build --prefix client, then npm start. Remove ADMIN_PASSWORD after bootstrapping the first administrator. Register other users through the UI. In Admin > Approvals select the role to grant and approve access. Users remain pending until approval. Rejection, role changes and account deletion revoke existing sessions. Sessions expire after eight hours, and a new login replaces the previous session.

Only SQLite is used for server data. The sql.js backend must run as ONE Node process with persistent disk; do not use clustered processes or ephemeral/serverless storage. Back up database.sqlite. Legacy shared learning records are preserved in their original tables but are not assigned to new users, because their owner cannot be established. Browser-local accounts and plaintext passwords are not imported: register fresh accounts.

Verification: npm test --prefix server. Tests create and remove an isolated temporary SQLite database; they never use your production database.
