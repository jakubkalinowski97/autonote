# AI Agent Architecture for AutoNote

This document details the structure, responsibilities, and database schema of the AI agent powering AutoNote, with a focus on its integration with Supabase and vector search.

---

## 1. Overview

The AI agent is the intelligent core of AutoNote, responsible for:
- Ingesting and transforming multi-modal user inputs (audio, image, text)
- Unifying and stylizing notes using LLMs
- Managing semantic search and conversational Q&A
- Handling note versioning, workspace isolation, and permissions
- Interfacing with Supabase for data storage, retrieval, and vector search

---

## 2. AI Agent Structure

### a. Core Components

- **Input Processor**
  - Handles audio (transcription), image (OCR/description), and text inputs
  - Calls external AI models (e.g., OpenAI Whisper, GPT-4 Vision)

- **Note Transformer**
  - Unifies and stylizes notes using LLMs (e.g., GPT-4)
  - Applies user-selected transformation styles

- **Embedding & Vector Manager**
  - Generates embeddings for notes and queries
  - Stores and queries embeddings in Supabase vector DB

- **Search & Q&A Engine**
  - Handles semantic search and conversational queries
  - Retrieves relevant notes and synthesizes answers

- **Versioning & History Manager**
  - Tracks all note transformations and edits
  - Enables viewing and reverting to previous versions

- **Security & Permissions Layer**
  - Enforces workspace isolation and role-based access
  - Integrates with Supabase Auth and RLS

---

## 3. Database Tables (Supabase)

### 3.1. users
- `id` (UUID, PK)
- `email` (string, unique)
- `name` (string)
- `created_at` (timestamp)
- ... (other auth/profile fields)

### 3.2. workspaces
- `id` (UUID, PK)
- `name` (string)
- `owner_id` (UUID, FK to users)
- `created_at` (timestamp)
- ...

### 3.3. workspace_members
- `id` (UUID, PK)
- `workspace_id` (UUID, FK to workspaces)
- `user_id` (UUID, FK to users)
- `role` (enum: 'owner', 'editor', 'viewer')
- `invited_at` (timestamp)

### 3.4. notes
- `id` (UUID, PK)
- `workspace_id` (UUID, FK to workspaces)
- `author_id` (UUID, FK to users)
- `current_version_id` (UUID, FK to note_versions)
- `title` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- ...

### 3.5. note_versions
- `id` (UUID, PK)
- `note_id` (UUID, FK to notes)
- `content` (text)
- `transformation_style` (string)
- `ai_metadata` (jsonb)
- `created_at` (timestamp)
- `created_by` (UUID, FK to users)
- `source_type` (enum: 'audio', 'image', 'text')
- `source_url` (string, nullable)
- ...

### 3.6. note_embeddings
- `id` (UUID, PK)
- `note_version_id` (UUID, FK to note_versions)
- `embedding` (vector)
- `created_at` (timestamp)
- (Indexed for vector search)

### 3.7. tags
- `id` (UUID, PK)
- `name` (string, unique)

### 3.8. note_tags
- `id` (UUID, PK)
- `note_id` (UUID, FK to notes)
- `tag_id` (UUID, FK to tags)

### 3.9. media_files
- `id` (UUID, PK)
- `note_version_id` (UUID, FK to note_versions)
- `file_url` (string)
- `file_type` (string)
- `created_at` (timestamp)

---

## 4. Data Flow Example: Note Creation & Transformation

1. **User Input:** User submits audio/image/text note via frontend.
2. **AI Agent:**
    - Processes input (transcription/OCR if needed)
    - Transforms note using LLM (applies style)
    - Stores original and transformed note in `note_versions`
    - Creates/updates entry in `notes` (links to latest version)
    - Generates embedding, stores in `note_embeddings`
    - Stores any media in `media_files`
3. **Workspace & Permissions:**
    - Note is linked to a workspace
    - Access is controlled via `workspace_members` and RLS

---

## 5. Security & Isolation
- **Row Level Security (RLS):** Enforced on all tables to ensure workspace and user isolation
- **Role-based Access:** Managed via `workspace_members` and Supabase Auth
- **Media Security:** Signed URLs for file access

---

## 6. Extensibility
- Modular AI agent allows for easy integration of new input types, transformation styles, and AI models
- Database schema supports versioning, tagging, and future features (e.g., note relationships, visualization)

---

## 7. Detailed Flow Diagram (Mermaid)

```mermaid
flowchart TD
    U1(["User action: Add new note OR Ask a question"])
    F1(["Frontend captures input and metadata"])
    F2(["API Gateway receives user action"])
    AG1(["AI Agent: Decide action type"])

    %% --- Add Note Branch ---
    AG2a(["If Add Note: Detect input type"])
    AG3a(["If audio/image: Upload media to storage"])
    AG4a(["If audio: Transcribe with Whisper"])
    AG5a(["If image: OCR/describe with GPT-4 Vision"])
    AG6a(["If text: Use as-is"])
    AG7a(["Unify input to text"])
    AG8a(["Summarize note (LLM)"])
    AG9a(["Generate tags (AI-suggested or manual)"])
    AG10a(["Create embedding (summary + tags + title)"])
    AG11a(["Store original & transformed note in note_versions"])
    AG12a(["Update/create note in notes table"])
    AG13a(["Store embedding in note_embeddings (vector DB)"])
    AG14a(["Store media in media_files (if any)"])
    AG15a(["Assign tags (manual or AI-suggested)"])
    AG16a(["Supabase: Enforce workspace & user permissions"])
    F3a(["Frontend updates UI with new note"])
    AG17a(["View/Edit Note History or Revert Version"])

    %% --- Ask Question Branch ---
    AG2b(["If Ask Question: Retrieve recent conversation history"])
    AG3b(["Embed query (LLM) with conversation context"])
    AG4b(["Decision: Semantic Search or Q&A"])
    AG5b(["If Semantic Search: Vector search in note_embeddings (Supabase)"])
    AG6b(["Retrieve top relevant notes"])
    AG7b(["If Q&A: Vector search in note_embeddings (Supabase)"])
    AG8b(["Retrieve top relevant notes for Q&A"])
    AG9b(["Assemble context from notes and conversation history"])
    AG10b(["Send context & query to LLM for answer"])
    AG11b(["Store question & answer in conversation_messages"])
    AG12b(["Return answer and/or notes to frontend"])
    F3b(["Frontend displays results to user"])
    AG13b(["Generate Note Graph/Map View"])

    %% Add Note Flow
    U1 --> F1 --> F2 --> AG1
    AG1 -- "Add Note" --> AG2a
    AG2a -- "audio/image" --> AG3a
    AG3a -- "audio" --> AG4a --> AG7a
    AG3a -- "image" --> AG5a --> AG7a
    AG2a -- "text" --> AG6a --> AG7a
    AG7a --> AG8a --> AG9a --> AG10a --> AG11a --> AG12a --> AG13a --> AG14a --> AG15a --> AG16a --> F3a
    F3a -- "User requests history" --> AG17a
    AG17a -- "Revert" --> AG11a

    %% Ask Question Flow
    AG1 -- "Ask Question" --> AG2b --> AG3b --> AG4b
    AG4b -- "Semantic Search" --> AG5b --> AG6b --> AG13b --> F3b
    AG4b -- "Q&A" --> AG7b --> AG8b --> AG9b --> AG10b --> AG11b --> AG12b --> AG13b --> F3b