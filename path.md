AI CUSTOMER SUPPORT SAAS
Product Requirements Document (PRD)
Version 1.0
1. PROJECT OVERVIEW
Project Name
AI Customer Support SaaS
Goal
Build a multi-tenant SaaS platform where businesses can upload internal documents and instantly create an AI-powered support assistant trained on their company knowledge.
The platform should:
Support multiple companies (multi-tenant)
Process PDFs and documents
Generate embeddings
Perform vector search
Answer questions using RAG
Track usage and costs
Provide a real-time analytics dashboard
Be production-ready and deployable
2. BUSINESS PROBLEM
Companies repeatedly answer the same questions:
Customer support questions
Product questions
Internal employee questions
HR questions
Technical documentation questions
This consumes time and resources.
The platform solves this by allowing businesses to upload documentation and create an AI assistant that answers questions using their own knowledge base.

3. TARGET USERS
Workspace Owner
Can:
Create workspace
Manage subscription
Manage documents
View analytics
Manage members
Workspace Admin
Can:
Upload documents
Manage chats
View analytics
Workspace Member
Can:
Ask questions
Access company knowledge base
4. CORE FEATURES
Authentication
Register
Login
Logout
Refresh token
Password reset
Email verification
Workspace Management
Create workspace
Update workspace
Switch workspace
Manage members
Knowledge Base
Upload PDF
Upload DOCX
View uploaded documents
Delete documents
Reprocess documents

AI Chat
Chat interface
Streaming responses
Chat history
Source citations
Analytics Dashboard
Live metrics
Token usage
Cost tracking
Message volume
Document statistics

Billing
Stripe checkout
Subscription plans
Invoice history
5. TECH STACK
Frontend
Next.js 15
TypeScript
TailwindCSS
Shadcn UI
TanStack Query
Zustand
React Hook Form
Zod
Backend
Go
Gin
JWT
WebSockets
Database
PostgreSQL
pgvector
Storage
MinIO (Development)
S3 (Production)
Cache / Realtime
Redis
AI
OpenAI GPT
OpenAI Embeddings
Infrastructure
Docker
Docker Compose

6. MONOREPO STRUCTURE


ai-support-saas/           # Root Folder
├── backend/               # Go API & Worker
│   ├── cmd/
│   │   ├── api/           # Go Gin API (main.go)
│   │   └── worker/        # Background Worker (main.go)
│   ├── migrations/        # SQL Migration files
│   └── go.mod             # Go dependencies
├── frontend/              # Next.js 15 App
│   ├── src/               # App router, components, types
│   ├── package.json       # Node dependencies
│   └── tsconfig.json
├── docker-compose.yml     # Starts Postgres + pgvector, Redis, MinIO locally
└── .gitignore             # Root gitignore to ignore node_modules, .env, etc.

7. SYSTEM ARCHITECTURE
Browser
   │
   ▼

Next.js Frontend
   │
   ▼

Go API
   │
   ├── PostgreSQL
   ├── pgvector
   ├── Redis
   ├── OpenAI
   ├── MinIO
   └── Stripe
   │
   ▼

Worker Service
8. REAL-TIME ARCHITECTURE
The dashboard must update in real time.
Technology
Redis Pub/Sub
WebSockets
TanStack Query cache updates
Event Flow
Document Uploaded
       │
       ▼

Worker

       │
       ▼

Redis Event

       │
       ▼

WebSocket Broadcast

       │
       ▼

Frontend Update
9. DATABASE MODULES
Authentication
users
sessions
password_resets
verification_tokens
Workspace
workspaces
workspace_members
invitations
Knowledge Base
documents
document_versions
document_chunks
embeddings
processing_jobs
Chat
chat_sessions
messages
message_sources
Billing
subscriptions
invoices
Analytics
usage_logs
Security
api_keys
audit_logs
Realtime
system_events
10. DOCUMENT PROCESSING PIPELINE
Upload PDF
     │
     ▼

Store File
     │
     ▼

Create Job
     │
     ▼

Worker Extracts Text
     │
     ▼

Chunk Text
     │
     ▼

Generate Embeddings
     │
     ▼

Store Vectors
     │
     ▼

Mark Completed

11. RAG PIPELINE
Question
     │
     ▼

Generate Query Embedding
     │
     ▼

Similarity Search
     │
     ▼

Retrieve Chunks
     │
     ▼

Build Prompt
     │
     ▼

Generate Response
     │
     ▼

Store Message

12. DASHBOARD MODULES
Overview
Real-time metrics:
Documents
Messages
Token usage
Cost
Active users
Documents
Upload count
Processing status
Failed jobs
Chat
Sessions
Messages
Response time
Usage
Tokens
Costs
Requests

13. WEBSOCKET EVENTS
Document Events
document.uploaded
document.processing
document.completed
document.failed
Chat Events
chat.created
message.created
message.stream
message.completed
Analytics Events
usage.updated
cost.updated
dashboard.updated

14. API MODULES
Auth
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
Workspaces
POST /workspaces
GET /workspaces
GET /workspaces/:id
PATCH /workspaces/:id
Documents
POST /documents/upload
GET /documents
GET /documents/:id
DELETE /documents/:id
Chat
POST /chat/message
GET /chat/sessions
GET /chat/messages
Analytics
GET /analytics/overview
GET /analytics/usage
GET /analytics/cost
15. DEVELOPMENT PHASES
Phase 1
Foundation
Monorepo
Docker
Database
Redis
Authentication
Phase 2
Workspace
Workspaces
Roles
Tenant isolation
Phase 3
Knowledge Base
Upload
Processing
Embeddings
Phase 4
RAG
Vector search
Context retrieval
Prompt building
Phase 5
Chat
Streaming
History
Sources
Phase 6
Analytics
Real-time dashboard
Usage tracking
Phase 7
Deployment
Production setup
Demo preparation
