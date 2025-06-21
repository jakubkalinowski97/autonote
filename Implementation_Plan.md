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