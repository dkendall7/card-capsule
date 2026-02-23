# CardCapsule — Expo MVP Execution Plan

## 0) North Star

CardCapsule is a memory-safe for sentimental cards that:

1. Captures with near-zero friction (magic capture)
2. Understands the card (OCR + intelligent prefill)
3. Organizes by People and Events
4. Encourages reflection (resurfacing)
5. Feels premium and lovable (app-store polish)

If any decision makes the product feel like a storage app instead of a memory-safe, reject it.

This is an emotional MVP, not a CRUD MVP.

---

## 1) Non-Negotiables

### Home
The home screen must support two user intents:

1. “I just got a card” → immediate Add Card action
2. “I’m browsing/reflecting” → resurfacing + browsing

Home must include:
- Prominent Add Card CTA
- Resurfacing module
- Recent cards feed
- Entry points to People / Events / Search

---

### Capture (Magic Engine)

- Camera launches immediately when adding a card
- Light-touch, streamlined
- Preferred: edge detection + auto-capture when stable
- Manual shutter must exist as fallback
- Slot model: Front + Inside
- Support:
  - single-sided cards
  - retake per slot
  - delete per slot
  - safe cancel behavior
- After capture:
  - automatic OCR
  - intelligent metadata prefill
  - 1–2 taps to save

---

### Intelligence

After capture:

- OCR runs automatically
- Extracted text is:
  - stored
  - displayed beautifully in detail view
- System attempts to infer:
  - From (giver)
  - Occasion/Event
  - Date (default today)

Suggestions must be editable.

Imperfect inference is acceptable. Magic perception is essential.

---

### Organize + Recall

MVP must include:

- Tagging by Person
- Tagging by Event
- People view
- Events view
- Basic search across OCR text

---

### Resurfacing

MVP must resurface memories in-app:

- If card month/day matches today
- Display resurfacing module on home

Push notifications optional for MVP.

---

### Share

- Create share link
- Copy link
- Revoke link
- Shared view works reliably

Sharing must feel intentional and controlled.

---

## 2) Emotional MVP Scope

### Included

- Native capture (document-scan-like)
- OCR extraction
- Intelligent prefill
- People tagging
- Event tagging
- Resurfacing banner
- Search (basic)
- Share links
- Premium mobile-native UI
- Lovability polish pass

### Deferred

- Back/Extra pages
- Advanced AI tagging
- Relationship graphs
- Notification engine
- Complex multi-page support

---

## 3) UX Architecture

### Navigation (expo-router)

- /(auth)/sign-in
- /(tabs)/home
- /(tabs)/people
- /(tabs)/events
- /(tabs)/search
- /capture
- /card/[id]
- /share/[token] (optional in-app)

---

## 4) Capture Flow Spec

### Slot Model

Slots:
- Front
- Inside

Actions:
- Retake
- Delete
- Continue

Cancel behavior:
- If no images captured → exit immediately
- If ≥1 image captured → confirm discard

---

### Capture Experience

Preferred:
- Edge detection overlay
- Auto capture when stable
- Perspective correction (if feasible)
- Manual shutter fallback

Post-capture pipeline:
1. Normalize image
2. Resize/compress
3. Upload
4. OCR
5. Metadata inference
6. Review/Confirm screen

---

### Review Screen

Display:
- Image previews
- Extracted message
- Editable fields:
  - From
  - To
  - Event
  - Date
  - Notes (optional)

Primary action: Save Memory  
Secondary: Edit Photos

---

## 5) Intelligence Strategy

### OCR

- Must run through secure backend (Supabase Edge Function recommended)
- Do not embed API secrets in mobile app
- Store:
  - ocr_text
  - optional confidence
  - inferred fields

---

### Metadata Inference (MVP Heuristics)

From:
- Parse sign-offs like “Love, X”, “From X”

Event:
- Keyword match: birthday, wedding, anniversary, graduation, etc.

Date:
- Default today

All suggestions must be editable.

---

## 6) Data Model Alignment

Cursor must inspect existing Supabase schema before modifying anything.

Minimum entities:

cards:
- id
- user_id
- created_at
- images
- ocr_text
- event reference
- person reference

contacts (People)

events

share_links:
- token
- card_id
- revoked_at
- expires_at (optional)

If changes required:
- Create schema alignment document first.

---

## 7) Technical Direction (Expo)

- New Expo app in `/mobile`
- Do not modify existing web app
- All logic in `/mobile/src/lib`
- UI screens thin

Suggested libraries:
- expo-router
- expo-camera or document scanning solution
- expo-image-manipulator
- expo-file-system
- expo-haptics
- expo-clipboard

---

## 8) Execution Phases

Each phase:
- One commit
- Device-tested
- Includes run steps + test steps

---

### Phase 0 — Expo Bootstrap

- Create `/mobile`
- Configure expo-router
- Auth route grouping
- Theme tokens
- Minimal Home shell with Add CTA

Acceptance:
- Runs on simulator

---

### Phase 1 — Capture Tech Spike

Goal:
- Prove best document-scan approach in Expo

Deliver:
- Prototype capture screen
- Decision doc explaining:
  - library chosen
  - auto-capture feasibility
  - limitations

Acceptance:
- Feels scanner-like on device

---

### Phase 2 — Supabase Auth + Home

- Auth works
- Session persistence
- Home:
  - Add CTA
  - Resurfacing module
  - Cards feed

Acceptance:
- Real data renders
- Good empty states

---

### Phase 3 — Card Detail

- Beautiful layout
- Image rendering optimized
- Share entry point

Acceptance:
- Smooth navigation
- No layout jank

---

### Phase 4 — Capture v1

- Slot model
- Retake/delete
- Upload pipeline
- Review screen

Acceptance:
- Reliable capture + save on device

---

### Phase 5 — OCR + Intelligent Prefill

- Backend OCR integration
- Metadata inference
- Prefilled review screen

Acceptance:
- User experiences “magic” moment

---

### Phase 6 — People + Events

- Tagging UI
- Filter views
- Browse by Person
- Browse by Event

Acceptance:
- Emotional organization works

---

### Phase 7 — Search

- Full-text search across OCR

Acceptance:
- Find card by internal phrase

---

### Phase 8 — Share Links

- Create
- Copy
- Revoke
- Shared view functional

---

### Phase 9 — Lovability Pass

- Haptics
- Motion polish
- Skeleton loaders
- Safe area audit
- Keyboard behavior
- Performance pass

Acceptance:
- Feels app-store quality

---

### Phase 10 — Store Readiness

- Icons
- Splash
- Permission strings
- Privacy policy
- TestFlight build

Acceptance:
- Release candidate ready