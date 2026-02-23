# One Pager - CardCapsule

*A memory-safe for cards: snap, auto-transcribe, tag by person or event, and resurface moments when they matter.*

---

### **The Problem**

Physical cards carry meaning but also clutter and fragility. People want to preserve the sentiment without shoeboxes or guilt.

---

### **The Solution**

CardCapsule provides a **fast, low-friction capture and recall system** that preserves the message, the giver, and the moment.

- **Capture**: Guided scan (front + inside), auto edge detection, glare reduction.
- **Transcribe**: OCR + handwriting transcription with confidence scores.
- **Organize**: One-tap tags (person, event, year) and AI suggestions.
- **Recall**: Full-text search, albums by people/events, timeline view.
- **Share**: Tokenized private links, optional exports.

---

### **Target Users**

- New parents, newlyweds, recent grads
- Families preserving messages from aging relatives
- People decluttering after moves or life events

---

### **Core Experience Pillars**

- **Capture**: Scan in seconds
- **Organize**: People & events out of the box
- **Recall**: Search and resurface meaning
- **Share**: Private, simple links
- **Memorialize** (future): reels, resurfacing rituals, memorial mode

---

### **Why CardCapsule is Different**

- Card-aware scanner flow
- Handwriting-first transcription & search
- Sentiment-centric organization (people, events, years)
- Humanistic framing: memories, not just photos

---

### **Architecture at a Glance**

- **Frontend**: Next.js on Vercel (fast global delivery, SSR/SSG, CI/CD)
- **Backend**: Supabase (auth, Postgres DB, realtime sync, storage)
- **Auxiliary Services**: Google Cloud Functions/Run (OCR, entity extraction, integrations)
- **Security**: Encrypted at rest/in transit, Supabase Row-Level Security, tokenized share links

---

### **Monetization**

- Free tier (limited cards & share links)
- Plus plan (unlimited cards, albums, exports, priority OCR)
- Future: collaborative albums, print books, memory reels

---

### **Go-to-Market**

- Life events where cards pile up (weddings, baby showers, graduations, memorials)
- Partnerships with stationery shops, event photographers, and organizers
- Campaign hook: **“Goodbye clutter, keep the love.”**

---

👉 CardCapsule makes it effortless to **preserve heartfelt memories without the mess**, keeping love close while reclaiming space.

---