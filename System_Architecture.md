# AutoNote: System Architecture Overview

This document provides a high-level overview of the complete technical architecture for the AutoNote application. It describes how the frontend, backend, database, and deployment pipelines work together to deliver the application.

---

## **1. Core Principles**

The architecture is built on modern, cloud-native principles to ensure scalability, reliability, and developer efficiency.
- **Monorepo:** All code (frontend, backend, shared types) is managed in a single Nx workspace for consistency and easy code sharing.
- **Infrastructure as Code (IaC):** All infrastructure and deployment configurations (`Dockerfile`, `amplify.yml`, GitHub Actions workflows) are defined as code and stored in the Git repository.
- **Serverless First:** We leverage managed, serverless services (AWS Fargate, AWS Amplify, Supabase) wherever possible to reduce operational overhead.
- **Continuous Deployment:** All components of the stack are deployed automatically via GitHub Actions upon merges to the `main` branch.

---

## **2. Component Architecture Diagram**

```mermaid
graph TD
    subgraph "User's Device"
        A[Expo App on Web/Mobile]
    end

    subgraph "AWS Cloud"
        B[AWS Amplify Hosting]
        C[Amazon ECR<br/>(Docker Registry)]
        D[Amazon ECS on Fargate<br/>(NestJS Backend)]
        E[VPC/Networking]
    end
    
    subgraph "Supabase Cloud"
        F[Supabase Database<br/>(PostgreSQL)]
        G[Supabase Auth]
    end

    subgraph "Development & CI/CD"
        H[GitHub Repository<br/>(Nx Monorepo)]
        I[GitHub Actions]
    end
    
    A --> B
    A -- API Calls --> D
    A -- Auth Requests --> G
    
    D -- DB Queries --> F
    
    I -- Build & Push --> C
    I -- Deploy --> B
    I -- Deploy --> D
    I -- DB Migrations --> F
    
    H -- Triggers --> I
    
    D -- Pulls Image --> C

    linkStyle 0 stroke:#007bff,stroke-width:2px;
    linkStyle 1 stroke:#28a745,stroke-width:2px;
    linkStyle 2 stroke:#28a745,stroke-width:2px;
    linkStyle 3 stroke:#dc3545,stroke-width:2px;
    linkStyle 4 stroke:#17a2b8,stroke-width:2px;
    linkStyle 5 stroke:#17a2b8,stroke-width:2px;
    linkStyle 6 stroke:#17a2b8,stroke-width:2px;
    linkStyle 7 stroke:#17a2b8,stroke-width:2px;
    linkStyle 8 stroke:#ffc107,stroke-width:2px;
    linkStyle 9 stroke:#ffc107,stroke-width:2px;
```

---

## **3. Detailed Component Breakdown**

### **Frontend: Expo Application**
- **Framework:** Expo (React Native)
- **Hosting:** **AWS Amplify Hosting**
- **Description:** A cross-platform application that runs on web and mobile. It communicates with the backend via REST API calls and directly with Supabase for user authentication.
- **Deployment:** Automatically built and deployed by AWS Amplify when changes are pushed to `apps/app/**`. The configuration is managed in `amplify.yml`.

### **Backend: NestJS API Server**
- **Framework:** NestJS (Node.js)
- **Hosting:** **Amazon ECS with AWS Fargate**
- **Container Registry:** **Amazon ECR**
- **Description:** A containerized API server that handles all business logic. It exposes a REST API that the frontend consumes. It connects to the Supabase database for data operations.
- **Deployment:**
    1. Changes to `apps/server/**` trigger a GitHub Actions workflow.
    2. The workflow builds a Docker image and pushes it to Amazon ECR.
    3. A subsequent job in the workflow triggers a rolling update on the ECS service, deploying the new container image with zero downtime.

### **Database: Supabase**
- **Provider:** Supabase (hosted PostgreSQL)
- **Schema Management:** Supabase CLI
- **Description:** Provides the core database, user authentication, and authorization services. The database schema is managed via migration files stored in the `supabase/migrations` directory.
- **Deployment (Schema Changes):**
    1. Changes to `supabase/migrations/**` trigger a GitHub Actions workflow.
    2. The workflow connects to the live Supabase database and applies the new migrations using `supabase db push`.

### **Shared Code**
- **Location:** `libs/shared`
- **Description:** A shared TypeScript library within the monorepo that holds code used by both the frontend and backend.
- **Current Use:** It contains the auto-generated TypeScript type definitions for the Supabase database schema, ensuring end-to-end type safety. 