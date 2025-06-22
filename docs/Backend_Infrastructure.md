# Backend Infrastructure on AWS: A Detailed Guide

This document provides a comprehensive overview of the cloud infrastructure for the AutoNote NestJS backend, hosted on Amazon Web Services.

---

## **1. Core Philosophy**

The infrastructure is designed around modern, scalable, and secure principles:
- **Containerization:** The application is packaged into a standard Docker container, allowing it to run consistently in any environment.
- **Serverless Compute:** We use **AWS Fargate** to run our container, which removes the need to manage underlying EC2 servers, patches, or operating systems.
- **Infrastructure as Code (IaC) Principles:** Key configurations for deployment are stored as code (`Dockerfile`, GitHub Actions workflows) in the repository.
- **Secure by Default:** Secrets are managed centrally and securely using **AWS Secrets Manager**, and network access is tightly controlled.

---

## **2. Components Overview**

| Component | AWS Service | Purpose |
| :--- | :--- | :--- |
| **Container Image** | Docker | Packaging the NestJS application and its dependencies. |
| **Image Registry** | Amazon ECR | A private, secure repository to store our Docker images. |
| **Networking** | Amazon VPC | The private network that isolates our resources. |
| **Compute** | Amazon ECS (with Fargate) | Runs our container in a serverless environment. |
| **Secrets** | AWS Secrets Manager | Securely stores and injects secrets like API keys. |
| **Permissions** | AWS IAM | Manages permissions for services to interact with each other. |
| **CI/CD** | GitHub Actions | Automates building, testing, and deploying the application. |

---

## **3. Networking: VPC and Subnets**

We have established a custom Virtual Private Cloud (VPC) to create a logically isolated network for our resources.

- **VPC CIDR Block:** `10.0.0.0/16`
  - This provides a large private IP address space for all our resources.

- **Subnet Strategy:** The VPC is divided into the following subnets, spread across multiple Availability Zones for high availability.
  - **Public Subnets:**
    - `10.0.1.0/24`
    - `10.0.2.0/24`
    - These subnets are made public by adding a route (`0.0.0.0/0`) in their associated Route Table that points to an **Internet Gateway (IGW)**.
    - Our VPC's gateway is named `autonote-igw-1`.
    - Our ECS Fargate task runs in these subnets.
  - **Private Subnets:**
    - `10.0.101.0/24`
    - `10.0.102.0/24`
    - These subnets do **not** have a direct route to the internet, providing a secure location for internal resources like databases or caches (e.g., ElastiCache for Redis).

---

## **4. Compute: ECS with AWS Fargate**

Our NestJS application runs as a task within an **Elastic Container Service (ECS)** cluster.

- **Cluster:** `autonote-server-cluster`
  - This is a logical grouping for our services.
- **Launch Type:** **AWS Fargate**
  - We don't manage servers. AWS provisions the compute resources for us.
- **Task Definition:** `autonote-server-task`
  - This is the blueprint for our application container.
  - It specifies the Docker image URI from ECR.
  - It maps the container's port `3000`.
  - Crucially, it references secrets stored in **AWS Secrets Manager** instead of containing plaintext environment variables.
- **Service:** `autonote-server-service`
  - This service ensures that our desired number of tasks (e.g., 1) is always running.
  - It automatically restarts the task if it crashes.
  - It assigns a **Public IP** to the task, making our API accessible to the internet without a load balancer for now.

---

## **5. Security and IAM Roles**

Security is managed through two primary mechanisms: IAM Roles for service permissions and Security Groups for network access control.

### **IAM Role**

- **Task Execution Role (`ecsTaskExecutionRole`):** This role is used by the ECS service itself to perform actions on our behalf. We have attached two key AWS-managed policies to it:
  1.  **`AmazonECSTaskExecutionRolePolicy`:** Grants permission to pull images from ECR and write logs to CloudWatch.
  2.  **`SecretsManagerReadWrite`:** Grants permission to read the secret values from AWS Secrets Manager and inject them into our container.

### **Network Security (Security Group)**

The ECS task is associated with a Security Group that acts as a virtual firewall, controlling inbound and outbound traffic.

- **Current Inbound Rule:**
  - **Type:** Custom TCP
  - **Port:** `3000`
  - **Source:** `0.0.0.0/0` (Anywhere)
  - **Description:** Allows public internet access to the NestJS application for development and testing.

> **⚠️ Security Warning:** The current `0.0.0.0/0` source is insecure for a production environment as it allows any IP address to attempt to connect to the API.

- **Recommended Production Hardening:**
  - The `0.0.0.0/0` inbound rule should be removed.
  - Instead of IP-based restrictions, a **Shared Secret** (e.g., an `X-API-KEY` header) should be implemented in the application logic. This ensures that only trusted clients (like the Amplify frontend) that possess the secret key can access the API, regardless of their IP address.

---

## **6. Deployment Flow**

The deployment process is automated via GitHub Actions.

1.  **Push to `main`:** A developer pushes code changes affecting the backend (`apps/server/**`) to the `main` branch.
2.  **Build Docker Image:** The GitHub Actions workflow (`.github/workflows/build-and-push-backend.yml`) automatically builds the Docker image.
3.  **Push to ECR:** The workflow tags the new image with the latest commit SHA and pushes it to our `autonote/server` ECR repository.
4.  **Manual Service Update:** The `autonote-server-service` in ECS must be manually updated to use the new Docker image. This is done by creating a new Task Definition revision pointing to the new image tag and updating the service to use that revision. This step can be automated in the future. 