 focus# AutoNote: Implementation Plan

This document provides a detailed, step-by-step plan for the engineering team to build and launch the AutoNote application.

---

## Phase 1: Project Setup & Foundation (Sprint 1-2)

**Goal:** Establish the development environment, set up all required cloud services, and create the basic application shells.

**Steps:**

1.  **Initialize Monorepo:**
    *   Use `npx create-nx-workspace` to set up the monorepo.
    *   Add `prettier` for code formatting and establish workspace-wide linting rules.

2.  **Create Application Shells:**
    *   **Backend:** Use the Nx NestJS plugin (`@nx/nest`) to generate a new application named `server` inside the `apps` directory.
    *   **Frontend:** Use the Nx Expo plugin (`@nx/expo`) to generate a new application named `app` inside the `apps` directory.

3.  **Provision Cloud Services:**
    *   **Supabase:** Create a new Supabase project. Enable the `pgvector` extension. Save the project URL and `anon` / `service_role` keys securely.
    *   **AWS:**
        *   Set up **AWS Amplify** and connect it to our GitHub repository for the frontend.
        *   Create an **Amazon ECR** (Elastic Container Registry) repository to store our backend Docker images.
        *   Set up an initial **Amazon ECS** Cluster and Task Definition for our NestJS backend.
        *   Create an **Amazon ElastiCache for Redis** instance.
    *   **Stripe:** Create a Stripe account and get API keys.
    *   **LangSmith:** Create a LangSmith account and get API keys.
    *   **Sentry & PostHog:** Create accounts and generate API keys for both frontend and backend projects.

4.  **CI/CD Foundation:**
    *   Set up initial **GitHub Actions** workflows.
    *   Create a simple "test" workflow that runs on every push.
    *   Create a placeholder "deploy" workflow.

---

## Phase 2: Core Backend Development (Sprint 2-4)

**Goal:** Build out the core API functionalities, focusing on user management and the data model.

**Steps:**

1.  **Integrate Supabase:**
    *   Add the Supabase client library to the NestJS `server`.
    *   Create a `SupabaseModule` to provide the client instance via dependency injection.

2.  **Implement Authentication:**
    *   Create an `AuthModule` in the NestJS `server`.
    *   Create endpoints for `login`, `register`, and `logout`. These endpoints will primarily act as secure proxies to the Supabase Auth service.
    *   Implement a route guard that validates the JWT from Supabase on every protected request.

3.  **Define Database Schema:**
    *   Using a schema migration tool (like `drizzle-kit` or `node-pg-migrate`), define the initial database tables: `users`, `workspaces`, `notes`, `note_history`.
    *   Ensure all tables have the correct `user_id` and `workspace_id` foreign keys for data isolation.
    *   Implement **Row-Level Security (RLS)** policies on all tables in Supabase.

4.  **Build Core CRUD APIs:**
    *   Create NestJS modules for `Workspaces` and `Notes`.
    *   Implement standard CRUD (Create, Read, Update, Delete) API endpoints for both modules, ensuring all queries respect RLS and multi-tenancy.

---

## Phase 3: Core Frontend Development (Sprint 3-5)

**Goal:** Build the main application interface and connect it to the backend.

**Steps:**

1.  **Setup Navigation:**
    *   Use `expo-router` to set up file-based routing.
    *   Create main navigation structure: an auth flow (Login/Register screens) and an app flow (the main app after login).

2.  **Integrate Authentication:**
    *   Create screens for Login and Registration.
    *   Connect these screens to the backend `AuthModule` endpoints.
    *   Implement secure storage for the user's JWT using `expo-secure-store`.

3.  **Build Core UI:**
    *   Create the main `NoteList` view (using the tree structure).
    *   Create the `NoteDetail` view for displaying note content.
    *   Create the `Workspace` selection and management UI.

4.  **Connect to Backend APIs:**
    *   Use a data fetching library (like `TanStack Query`) to connect the UI components to the backend's CRUD APIs for notes and workspaces.

---

## Phase 4: Implementing the "Magic" (Sprint 5-7)

**Goal:** Integrate AI services and background jobs to bring the core AutoNote features to life.

**Steps:**

1.  **Set up Background Job System:**
    *   Integrate `@nestjs/bullmq` into the `server`.
    *   Configure the connection to our Amazon ElastiCache Redis instance.
    *   Create the first background job processor.

2.  **Implement Note Processing:**
    *   Create an `UploadController` that provides secure, single-use URLs for the frontend to upload files directly to Supabase Storage.
    *   When an upload is complete, add a `process-note` job to the BullMQ queue.
    *   The background worker for this job will:
        1.  Fetch the file from Supabase Storage.
        2.  Call the appropriate AI service (Whisper for audio, GPT-4 Vision for images).
        3.  Call the core transformation LLM via LangSmith.
        4.  Generate a vector embedding from the result.
        5.  Update the note in the database with the final content and the embedding.

3.  **Implement Semantic Search:**
    *   Create a search endpoint in the NestJS `server`.
    *   This endpoint will take a user query, generate an embedding for it, and use the `pgvector` `<=>` operator to find the most similar notes in the database (respecting the user's RLS policy).

---

## Phase 5: Monetization & Launch Prep (Sprint 8)

**Goal:** Integrate payments and prepare for a production release.

**Steps:**

1.  **Integrate Stripe:**
    *   **Frontend:** Use `@stripe/stripe-react-native` to build the "Upgrade to Pro" screen and payment form.
    *   **Backend:** Create a `StripeModule`. Implement webhook handlers to listen for successful payments. When a `checkout.session.completed` event is received, update the user's role in your database to `pro`.

2.  **Finalize CI/CD:**
    *   Flesh out the GitHub Actions "deploy" workflow to fully automate the deployment of the NestJS backend to Amazon ECS.

3.  **Monitoring & Analytics:**
    *   Ensure Sentry and PostHog SDKs are fully integrated and configured for both the frontend and backend.
    *   Build dashboards in PostHog to track key user activation metrics.

4.  **Beta Testing & Launch:**
    *   Deploy a final version to a staging environment.
    *   Invite a small group of beta testers.
    *   Address feedback, fix bugs, and prepare for public launch.

---

## Authentication (Auth) Implementation & Integration Plan

### 1. Overview
- Supabase Auth is used for authentication (email/password and OAuth providers like Google).
- The backend (NestJS) provides endpoints that proxy to Supabase Auth and validate JWTs.
- The frontend (Expo/React Native) handles auth flows and securely stores JWTs.
- A custom `public.users` table is used for app-specific metadata (roles, Stripe integration, etc.), linked to `auth.users` by UUID.

### 2. Backend (NestJS)
- **Endpoints:** `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/oauth/:provider`, `/auth/profile`.
- **JWT Validation:** AuthGuard validates JWTs from Supabase and attaches user info to requests.
- **User Management:** On registration/login (including OAuth), create a record in `public.users` if it doesn't exist.
- **Role Management:** Add a `role` field to `public.users`. Update via Stripe webhook handler.
- **API Key Security:** Require `X-API-KEY` header for non-auth endpoints in production.
- **Logout:** `/auth/logout` endpoint calls Supabase's signOut.

### 3. Frontend (Expo/React Native)
- **Auth Screens:** Login, Register, and OAuth sign-in (e.g., Google).
- **OAuth Flow:**
  1. Call `/auth/oauth/google` to get the Google login URL.
  2. Redirect user to Google.
  3. Handle redirect back and extract JWT from Supabase.
  4. Store JWT securely (expo-secure-store).
  5. Use JWT for all API requests.
- **JWT Storage:** Store JWT securely and attach as Bearer token in Authorization header.
- **Auth Flow:** On app launch, check for valid JWT; redirect to login if missing/expired.

### 4. Database (Supabase)
- **auth.users:** Managed by Supabase for authentication.
- **public.users:** App-specific metadata (roles, Stripe ID, etc.), linked by UUID.
- **Other tables:** `workspaces`, `notes`, `note_history` with `user_id` and `workspace_id` foreign keys.
- **RLS:** Enable and configure Row-Level Security for all tables.

### 5. Security
- Store Supabase keys in AWS Secrets Manager.
- Add API key check for production.

### 6. Third-Party (OAuth) Sign-In
- Use Supabase's `signInWithOAuth` for providers like Google.
- Frontend initiates OAuth, handles redirect, and stores JWT.
- Backend validates JWT and manages user records as with email/password sign-in.

---

## User Role Management Plan

### 1. Account-Level Roles
- **Field:** `role` in `public.users` (e.g., 'free', 'pro', 'admin')
- **Default:** 'free' on registration
- **Upgrade:** Set to 'pro' after successful Stripe payment (via webhook)
- **Admin:** Set manually (admin panel or SQL)
- **Usage:** Gate access to premium features in the backend (e.g., via guards or decorators)

### 2. Team/Workspace Roles
- **Table:** `workspace_members` (or similar)
- **Fields:** `user_id`, `workspace_id`, `role` ('owner', 'editor', 'viewer')
- **Usage:** Control permissions within a workspace (edit, view, manage, etc.)

### 3. Stripe Integration for Role Upgrades
- **Webhook:** Listen for `checkout.session.completed` or similar events
- **Logic:** On successful payment, update the user's `role` in `public.users` to 'pro'
- **Downgrade:** Optionally, listen for subscription cancellations and downgrade the role

### 4. Backend Enforcement
- **Guards/Decorators:** Use NestJS guards or custom decorators to restrict access to certain endpoints/features based on the user's role
- **Example:**
  ```typescript
  @UseGuards(RoleGuard('pro'))
  @Get('premium-feature')
  getPremiumFeature() { ... }
  ```

### 5. Admin/Support
- **Manual Role Changes:** Provide an admin endpoint or SQL access to set roles to 'admin' or for support cases

### 6. RLS (Row-Level Security)
- **Policy:** Ensure RLS policies in Supabase respect the user's role for sensitive operations if needed 

---

## AI Agent Implementation

### Overview
The AI Agent is the intelligent core of AutoNote, responsible for processing multi-modal inputs, transforming notes, managing semantic search, and handling conversational Q&A. This section details the database schema and implementation requirements based on the AI Agent flow diagram.

### Database Schema & Relationships

#### Core Tables (Already Defined)

**3.1. users**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    role VARCHAR DEFAULT 'free' CHECK (role IN ('free', 'pro', 'admin')),
    last_selected_workspace_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**3.2. workspaces**
```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**3.3. workspace_members**
```sql
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    invited_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);
```

#### AI Agent Specific Tables

**3.4. notes**
```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_version_id UUID, -- FK to note_versions, set after version creation
    title VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**3.5. note_versions**
```sql
CREATE TABLE note_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    transformation_style VARCHAR, -- e.g., 'business', 'casual', 'academic'
    ai_metadata JSONB, -- Store AI processing details, model used, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    source_type VARCHAR CHECK (source_type IN ('audio', 'image', 'text')),
    source_url VARCHAR, -- URL to original media file in storage
    processing_status VARCHAR DEFAULT 'completed' CHECK (processing_status IN ('processing', 'completed', 'failed'))
);

-- Add foreign key constraint after notes table creation
ALTER TABLE notes ADD CONSTRAINT fk_current_version 
    FOREIGN KEY (current_version_id) REFERENCES note_versions(id);
```

**3.6. note_embeddings**
```sql
-- Requires pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE note_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_version_id UUID REFERENCES note_versions(id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI embedding dimensions
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX ON note_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**3.7. media_files**
```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_version_id UUID REFERENCES note_versions(id) ON DELETE CASCADE,
    file_url VARCHAR NOT NULL, -- Supabase Storage URL
    file_type VARCHAR NOT NULL, -- MIME type
    file_size INTEGER, -- in bytes
    original_filename VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**3.8. tags**
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**3.9. note_tags**
```sql
CREATE TABLE note_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    assigned_by VARCHAR CHECK (assigned_by IN ('user', 'ai')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(note_id, tag_id)
);
```

#### Conversation & Q&A Tables

**3.10. conversations**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR, -- Auto-generated or user-defined
    started_at TIMESTAMP DEFAULT NOW(),
    last_message_at TIMESTAMP DEFAULT NOW()
);
```

**3.11. conversation_messages**
```sql
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR NOT NULL CHECK (sender_type IN ('user', 'ai')),
    content TEXT NOT NULL,
    message_type VARCHAR DEFAULT 'text' CHECK (message_type IN ('text', 'search_results')),
    related_note_ids UUID[], -- Array of note IDs referenced in AI responses
    ai_metadata JSONB, -- Model used, tokens consumed, etc.
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Usage Tracking Tables (for Plan Limits)

**3.12. user_monthly_usage**
```sql
CREATE TABLE user_monthly_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    year_month DATE, -- First day of month (e.g., '2024-01-01')
    transformations_count INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, year_month)
);
```

**3.13. user_daily_usage**
```sql
CREATE TABLE user_daily_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE,
    qa_queries_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

### AI Agent Flow Implementation

#### 1. Add Note Flow
**Key Steps & Database Operations:**

1. **Input Detection & Upload** (`AG2a` → `AG3a`)
   - Store file in Supabase Storage
   - Create record in `media_files` table

2. **AI Processing** (`AG4a`, `AG5a`, `AG6a`)
   - Process with Whisper (audio) or GPT-4 Vision (image)
   - Create `note_versions` record with `processing_status = 'processing'`

3. **Note Transformation** (`AG7a`, `AG8a`)
   - **Usage Check**: Query `user_monthly_usage` for transformation count
   - Apply transformation style via LLM
   - Update `note_versions` with final content

4. **Storage & Indexing** (`AG9a` → `AG12a`)
   - Create/update `notes` record
   - Generate and store embedding in `note_embeddings`
   - Update `processing_status = 'completed'`

5. **Tagging** (`AG14a`)
   - Create records in `tags` and `note_tags` tables

#### 2. Ask Question Flow
**Key Steps & Database Operations:**

1. **Usage Limit Check** (Before `AG4b`)
   - Query `user_daily_usage` for Q&A count
   - Block if limit exceeded (free plan: 3-5 queries/day)

2. **Conversation Management** (`AG2b`)
   - Query `conversation_messages` for recent history
   - Create new `conversations` record if needed

3. **Semantic Search** (`AG5b`, `AG6b`)
   - Generate query embedding
   - Vector search in `note_embeddings` using cosine similarity
   - Return matching `notes` records

4. **Conversational Q&A** (`AG7b` → `AG10b`)
   - Vector search + LLM processing
   - Store question/answer in `conversation_messages`
   - Update usage counters

### Row Level Security (RLS) Policies

**Essential RLS Policies:**
```sql
-- Notes access
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_access ON notes 
    USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
    ));

-- Note embeddings (inherits from notes)
ALTER TABLE note_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY embeddings_access ON note_embeddings 
    USING (note_version_id IN (
        SELECT nv.id FROM note_versions nv
        JOIN notes n ON nv.note_id = n.id
        WHERE n.workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    ));

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY conversations_access ON conversations 
    USING (user_id = auth.uid() AND workspace_id IN (
        SELECT workspace_id FROM workspace_members 
        WHERE user_id = auth.uid()
    ));
```

### Implementation Priority

1. **Phase 1**: Core tables (`notes`, `note_versions`, `note_embeddings`)
2. **Phase 2**: AI processing (`media_files`, usage tracking tables)
3. **Phase 3**: Advanced features (`conversations`, `tags`, visualization support)
4. **Phase 4**: RLS policies and security hardening

### Performance Considerations

- **Vector Search**: Use appropriate `ivfflat` index parameters based on dataset size
- **Usage Tracking**: Consider using Redis cache for real-time usage checks
- **Large Files**: Implement file size validation before upload (5MB/10MB/15MB limits)
- **Async Processing**: Use BullMQ for heavy AI operations to prevent API timeouts

### Supabase Vector DB & File Storage: Best Practice Recommendations

#### Vector Database (pgvector)
- **Embedding Dimension:** Ensure the `embedding` column dimension matches the model used (e.g., 1536 for OpenAI, adjust if using other models).
- **Index Tuning:** For large datasets, tune `ivfflat` index parameters (`lists`, `probes`) for optimal performance as your data grows.
- **Batching:** For bulk embedding operations (e.g., re-embedding all notes), use batched inserts/updates to avoid locking and performance issues.

#### File Storage
- **Bucket Security:** Set Supabase Storage buckets to `private` by default. Only use `public` for assets that must be world-accessible.
- **Access Policies:** Define Supabase Storage policies to restrict file access to the file's owner or workspace members. Example: only allow users in the same workspace to access a note's media files.
- **Signed URLs:** Always use signed URLs for temporary, secure file access (downloads and previews). Never expose direct storage URLs for private files.
- **File Type Validation:** Restrict allowed file types on upload (e.g., only allow images and audio, block executables and scripts).
- **Cleanup on Delete:** When a note or note version is deleted, ensure the corresponding file is also deleted from Supabase Storage. Implement a cleanup job or trigger to handle orphaned files.
- **Resumable Uploads:** For large files or unreliable networks, consider using Supabase's resumable upload feature to improve user experience and reliability.

#### Security & RLS
- **RLS for Metadata:** Enforce Row Level Security (RLS) on all metadata tables (e.g., `media_files`, `note_embeddings`) to ensure users can only access their own/workspace data.
- **Storage Policy Double-Check:** Ensure Supabase Storage policies are in sync with your database RLS policies for consistent access control.

#### Performance
- **Monitor Index Performance:** Regularly monitor and tune vector index performance as your dataset grows.
- **Usage Tracking:** Use Redis or similar caching for real-time usage checks if you expect high write volume on usage tracking tables.

--- 