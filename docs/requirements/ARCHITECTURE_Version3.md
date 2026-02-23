# Card Capsule App Architecture

## Overview

Card Capsule is a web application designed for managing and viewing card collections. The architecture leverages Vercel for frontend deployment, Supabase for authentication and as a primary data backend, and Google Cloud for additional backend services or integrations. This setup provides strong scalability, developer experience, and performance.

---

## High-Level Architecture

```
+----------------+        HTTPS         +---------------------+        API Calls         +-------------------+
|    Browser /   | <-----------------> |   Vercel Frontend   | <-------------------->  |    Supabase DB    |
|   User Device  |        (Next.js)     |    (Static/SSR)     |   (REST/RPC/Auth/WS)    |  (Postgres/Realtime)|
+----------------+                     +---------------------+                        +-------------------+
                                              |   |                                      
                                              |   |   +-----------------------------+
                                              |   +-> | Google Cloud Functions/Run  |
                                              |       | (auxiliary services, if any)|
                                              +-------+-----------------------------+
```

---

## Components

### 1. **Frontend (Vercel / Next.js)**
- **Framework:** Next.js for SSR/SSG, routing, and React UI.
- **Deployment:** Vercel for instant global deployments, automatic SSL, and CI/CD.
- **Responsibilities:**
  - Handles all UI/UX and static asset serving.
  - Directly communicates with Supabase via its client SDK for authentication, database, and storage.
  - Calls Google Cloud Functions/Run if additional server-side logic is required.

### 2. **Backend (Supabase)**
- **Authentication:** Supabase Auth provides secure user authentication (email/password, OAuth, social).
- **Database:** Supabase Postgres offers a managed SQL database, accessed directly from the frontend via Supabase client or via backend services.
- **Realtime:** Supabase Realtime enables live updates and synchronization for collaborative or dynamic features.
- **Storage:** Supabase Storage manages user-uploaded files, such as card images.
- **API:** All database and storage interactions are handled via Supabase's RESTful and RPC APIs, reducing the need for custom backend endpoints.

### 3. **Backend (Google Cloud Platform)**
- **API Layer:** Google Cloud Functions or Cloud Run for additional backend logic that should not reside in the client or Supabase (e.g., advanced processing, integration with external APIs).
- **Other Services:** Optional usage of Google Cloud Storage or Pub/Sub for advanced workflows.

---

## Data Flow

1. **User Interaction:**
   - User accesses the app via Vercel-hosted frontend.
2. **Authentication:**
   - Frontend uses Supabase Auth for user sign-up, login, and session management.
3. **Database & Storage:**
   - Frontend interacts directly with Supabase Postgres for reading/writing card data and with Supabase Storage for file uploads.
   - Realtime features are powered by Supabase Realtime.
4. **Auxiliary Logic:**
   - For complex operations, the frontend may call Google Cloud Functions/Run, which can securely interact with Supabase or other services as needed.

---

## Security

- **HTTPS:** All traffic is encrypted.
- **Authentication:** All user sessions managed via Supabase Auth; JWTs are used for secure API/database requests.
- **Authorization:** Supabase Row-Level Security (RLS) enforces user-level data access.
- **Secrets:** Managed through Vercel environment variables and Google Secret Manager (for backend).

---

## Scalability & Reliability

- **Frontend:** Vercel provides global edge caching and scales automatically.
- **Backend:** Supabase and Google Cloud are both managed, scalable platforms.
- **Realtime:** Supabase Realtime supports live data features at scale.
- **Resilience:** Monitoring via Vercel, Supabase dashboards, and Google Cloud Operations.

---

## Technologies Used

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | Next.js, React, Vercel |
| API         | Supabase client SDK (REST/RPC), Google Cloud Functions/Run |
| Database    | Supabase Postgres    |
| Storage     | Supabase Storage, (optional GCS) |
| Auth        | Supabase Auth        |
| CI/CD       | Vercel, GitHub Actions, Cloud Build |
| Monitoring  | Supabase Dashboard, Google Cloud Operations Suite |

---

## Diagram

```mermaid
flowchart TD
  User[User Browser]
  Vercel[Vercel (Next.js Frontend)]
  Supabase[Supabase (Auth, DB, Realtime, Storage)]
  GCP[Google Cloud Functions/Run (optional)]

  User -- HTTP(S) --> Vercel
  Vercel -- Supabase Client SDK --> Supabase
  Vercel -- REST/Fetch --> GCP
  GCP -- Service Account/API --> Supabase
```

---

## Summary

This architecture leverages Vercel for rapid frontend delivery, Supabase as a scalable backend (authentication, database, storage, realtime), and Google Cloud for advanced or external-facing backend logic. It enables rapid iteration, high reliability, and future extensibility for Card Capsule.

**Update as needed:**  
Document should be kept current as architecture and technology choices evolve.