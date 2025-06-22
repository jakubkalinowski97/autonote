# Supabase Database Management: A Guide to Schema as Code

This document outlines the process and best practices for managing the AutoNote application's database schema using the Supabase CLI. The core philosophy is **Database as Code**, where every schema change is captured in a version-controlled migration file.

---

## **1. Core Philosophy**

Instead of making changes directly in the Supabase Studio UI (which can lead to untracked changes), we will use a migration-based workflow. This provides several key advantages:
- **Version Control:** Your entire database schema is stored in Git, alongside your application code.
- **Reproducibility:** Anyone on the team can spin up a local database with the exact same schema.
- **Collaboration:** Changes can be reviewed and discussed through Pull Requests.
- **Safe Deployments:** Migrations can be applied to staging and production environments in a predictable and controlled manner.

---

## **2. The Tool: Supabase CLI**

The primary tool for this workflow is the **Supabase CLI**. It allows us to perform several critical functions:
-   Link our local repository to our remote Supabase project.
-   Spin up a local instance of Supabase for development.
-   Generate new migration files based on schema changes.
-   Apply (or "push") migrations to the live Supabase database.

---

## **3. One-Time Setup Process**

This process needs to be followed to get the repository ready for database management.

1.  **Install the Supabase CLI:**
    ```bash
    # For macOS / Linux with Homebrew
    brew install supabase/tap/supabase

    # For other systems, see Supabase docs
    ```

2.  **Initialize Supabase in the Monorepo:**
    -   Navigate to the root of the `AutoNote_Workspace`.
    -   Run the command: `supabase init`
    -   This will create a new `supabase` directory at the root. This directory will contain all your migration files and local configuration.

3.  **Link to the Remote Project:**
    -   Find your **Project ID** in your Supabase project's settings (URL: `https://app.supabase.com/project/[YOUR_PROJECT_ID]/settings/general`).
    -   Run the following command, which will require you to log in with a personal access token:
    ```bash
    supabase login
    supabase link --project-ref <YOUR_PROJECT_ID>
    ```
    This step securely links your local `supabase` directory to your live project.

---

## **4. Workflow for Schema Changes**

This is the ongoing process for creating and modifying your database schema.

### **A. Generating the Initial Schema**

Since the project already exists, our first step is to capture the *current state* of the live database and codify it.

```bash
# This command connects to your remote DB and creates a new migration file
# that represents the schema that is already there.
supabase db remote commit -n "initial-schema"
```
This creates your first migration file in `supabase/migrations/`.

### **B. Making New Schema Changes (The Day-to-Day Workflow)**

From now on, every change follows this pattern:

1.  **Start the Local Supabase Stack:**
    ```bash
    supabase start
    ```
    This spins up a local, temporary instance of Supabase (Postgres, GoTrue, etc.) using Docker.

2.  **Make Schema Changes Locally:**
    -   You can apply changes to your local database using your preferred tool. A simple way is to use the `psql` command provided by the CLI to open a SQL editor.
    -   Example: Let's create a `notes` table. You would run `supabase sql` and then execute:
    ```sql
    CREATE TABLE notes (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      title TEXT,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```

3.  **Generate a New Migration File:**
    After making changes to your local database, you generate a migration file that captures those specific changes.
    ```bash
    # The CLI diffs your local DB state against the last migration
    # and creates a new file with the differences.
    supabase db local commit -n "create-notes-table"
    ```
    This creates a new file in `supabase/migrations/` containing the `CREATE TABLE notes...` SQL statement.

4.  **Generate TypeScript Types:**
    After creating the migration, generate TypeScript types from your local database. This keeps your application code in sync with your schema.
    ```bash
    # This command introspects your local DB and generates a TS file.
    # We will pipe this into a file within the NestJS app.
    supabase gen types typescript --local --schema public,auth > libs/shared/src/lib/supabase.ts
    ```
    You should create the `apps/server/src/app/types` directory if it doesn't exist. This generated file should be committed to Git alongside your migration file.

5.  **Apply Migrations to the Live Database:**
    Once you have committed your new migration and type definition files to Git, you can apply the migration to your live Supabase project.
    ```bash
    supabase db push
    ```

This workflow ensures that every change is deliberate, versioned, and safely deployable.

---

## **5. Using Generated Types in the Application**

With the `supabase.ts` file generated, you can now use it in your NestJS services to achieve full type safety with the Supabase client.

First, you'll need to define a `Database` type in a central place, like your `supabase.module.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@auto-note-workspace/shared'; // 👈 Import the generated types

// When creating the client in your module factory
createClient<Database>(/* ... */);
```

Now, all your client queries will be type-safe:

```typescript
// In a service method
const { data, error } = await this.supabase
  .from('notes') // ✅ Autocompletes table names
  .select('id, title, content'); // ✅ Autocompletes column names

// `data` is now correctly typed as `Note[] | null` instead of `any`
``` 