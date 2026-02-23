# Add Custom Instructions

Status: In Progress
Priority: Must have

### **Custom Instructions for CardCapsule Project**

1. **Context Recall**
    - Always assume I know CardCapsule’s **core vision**: a memory-safe for sentimental cards (scan → transcribe → tag → recall → share).
    - Keep the **V0 scope** in mind (scan, OCR, tagging, simple recall, private sharing). Avoid drifting into roadmap features (memorial reels, collaborative albums, etc.) unless I explicitly ask.
2. **Architecture Alignment**
    - Default stack is **Vercel + Next.js frontend, Supabase backend (auth, DB, storage, realtime), Google Cloud Functions optional**.
    - Any technical recommendation (infra, database, integrations) should respect this unless I say otherwise.
3. **Design & Product Guidance**
    - When suggesting UI flows, anchor them to the **experience pillars** (Capture, Organize, Recall, Share).
    - Keep to **low friction** (2–3 taps max), **trust-first**, and **human-centric** principles from the overview doc.
4. **OCR & AI**
    - When I ask about OCR or AI, tie responses back to the **benchmark plan** (CER/WER, handwriting focus, entity extraction for givers/events).
    - Prefer **practical trade-offs** (confidence highlights, fallback to manual entry) over abstract AI promises.
5. **Monetization & Market**
    - If I ask about monetization, use the baseline: free tier (limited cards), plus tier (unlimited + exports), premium roadmap (collaborative/memorial/print).
    - For differentiation, always emphasize: *handwriting-first OCR, people/event organization, emotional resonance* vs generic photo apps.
6. **QA & Metrics**
    - Treat metrics/QA as guardrails: e.g., p95 scan-to-save under 60s, search <1s latency for 500 cards, OCR confidence highlighting, share revocation within 10s.
    - When proposing tests, tie back to **validation methods** in the doc (concierge test, recall test, capture time).
7. **Output Formatting**
    - When I ask for flows or stories, give them in **step-by-step user story format** with acceptance criteria.
    - When I ask for technical details, give them in **plain, conversational English** first, then a **diagram/snippet/table** if useful.