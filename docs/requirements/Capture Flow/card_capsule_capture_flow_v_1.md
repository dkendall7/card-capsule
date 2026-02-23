# CardCapsule — Capture Flow (v1.0)

## 1) Product goals & constraints
- **Primary outcome:** fast, low‑friction capture that defaults to the common case *(Front + Inside)* while gracefully supporting **Back**, **multi‑page insides**, **letters**, and **single‑panel cards**.
- **Rules from brief:**
  - User must capture **≥ 1 image** to proceed to Review.
  - Stay in **Capture** until the user taps **Continue → Review**.
  - User can **retake/edit/delete** any image during Capture.
  - **Cancel**:
    - If nothing captured → instantly exit.
    - If ≥1 image captured → confirm destructive: *“This card will be deleted. This can’t be undone.”*
  - Starting a new card should **open the camera immediately**.

## 2) Mental model: “Capture Stack”
A flexible, labeled queue of shots the user intends to take. We pre‑seed the stack with **Front** and **Inside** (majority case). Users can add **Back** and **Extra page(s)** on demand, or remove anything. The stack gives guidance without forcing a rigid flow.

**Stack defaults (new card):** `[Front]  [Inside]  [+ Back]  [+ Extra]`

- Tapping **Front/Inside** opens live camera if not captured; shows the existing photo if captured.
- Chips show status: ○ pending, ● captured, ✎ edited.
- **+ Back** adds a Back slot; **+ Extra** adds `Inside 2`, then `Inside 3`, etc.

## 3) User flow (high level)
```
Add New Card → (Camera opens immediately)
  ↓
Capture Screen (Stack seeded: Front, Inside)
  ├─ User captures Front
  │    └─ Auto-prompt: “Flip to Inside?” [Capture] [Skip]
  ├─ User captures Inside (optional)
  │    └─ Suggest: “Add Back?” [Add Back]  “Add another Inside?” [+ Extra]
  ├─ User may add Back / Extra pages / switch to Letter mode
  ├─ Thumbnail tray shows all captured; tap to edit/retake/delete
  └─ [Continue → Review] (enabled once ≥1 captured)

Cancel (top-left)
  ├─ 0 captured → exit immediately
  └─ ≥1 captured → Destructive confirm → exit & delete temp
```

## 4) Screen specs — Capture

### 4.1 Top bar
- **Left:** `Cancel`
- **Center:** `New Card`
- **Right:** `Continue →` (disabled until ≥1 capture)

### 4.2 Viewfinder
- Full‑bleed camera preview with **card outline** guidance (rounded rectangle with corner brackets).
- **Hints** (fade in/out): “Fill the frame”, “Avoid glare”, “Hold steady—auto capture…”.
- **Auto‑capture** when edges and focus are stable; always allow manual shutter.

### 4.3 Controls
**Primary row (chips = Capture Stack):**
`[●/○ Front]  [●/○ Inside]  [ + Back ]  [ + Extra ]   [⋯ More]`

- **States**: ○ Pending, ● Captured, ✎ Edited
- **Interactions**:
  - Tap pending chip → focuses camera on that slot.
  - Tap captured chip → opens **Image Detail** (Retake/Edit/Delete).
  - **+ Extra** adds `Inside 2`, `Inside 3`, etc. (label auto‑increments).
  - **⋯ More** opens a sheet for rare variants (see 6. Variants).

**Bottom bar:**
- Left: `Flash` (Auto / On / Off)
- Center: **Shutter** (big circle). Long‑press → burst (picks best).
- Right: `Gallery` (pick from camera roll)

**Thumbnail tray (floating, bottom‑right)**
- Stack of tiny thumbs (1–4 visible). Tap opens Image Detail for that shot.
- Shows count badge if >4.

### 4.4 Image Detail (per shot)
- Full preview with:
  - **Retake** (reopen camera with same slot selected)
  - **Edit** (crop/rotate/deskew/contrast; auto‑deskew suggested)
  - **Replace** (choose from gallery)
  - **Delete** (confirm; removes the slot or marks it pending if default slot)
- **Re-label** (optional) if AI mislabels; default shows the slot label (“Front”, “Inside 2”).

### 4.5 Micro-interactions
- **Haptics**: light tick on capture; warning vibration on blur/glare.
- **Toasts**: “Saved Front”, “Inside replaced”, “Back deleted”.
- **Smart prompts** after a capture:
  - After **Front**: “Flip open to capture Inside?”
  - After **Inside**: “Add Back or another Inside page?”

## 5) State logic (React-friendly)
```ts
// minimal shape
{
  mode: 'card' | 'letter' | 'unknown',
  shots: [
    { id:'front', label:'Front', type:'front', status:'pending|captured|edited', uri?:string, edits?:{crop,rotate,deskew,contrast}, aiLabel?:'front'|'inside'|'back' },
    { id:'inside-1', label:'Inside', type:'inside', status:'pending|captured|edited', uri?:string },
    // dynamically add: {id:'back', type:'back'} and {id:'inside-2', 'inside-3', ...}
  ],
  capturedCount: number,
  canContinue: boolean,   // capturedCount >= 1
  isDirty: boolean,       // capturedCount >= 1
}
```
**Actions**: `selectSlot(id)`, `capture(id, uri)`, `retake(id)`, `edit(id, edits)`, `delete(id)`, `addExtraInside()`, `addBack()`, `relabel(id,label|type)`.

## 6) Variants & edge cases
- **Single‑panel card** (front only): system detects no fold → suggest “Looks like a single-panel card. You can continue now or add Back.”
- **Letter** (single page): quick toggle in ⋯ More or auto‑detect aspect → stack becomes `[Letter] [+ Back]`.
- **Back with message**: after Inside capture, nudge: “Is there a note on the back?” → [Add Back].
- **Multi‑page insides**: every tap on **+ Extra** creates `Inside N`.
- **Gallery import**: if user imports multiple, open **Labeling sheet** to map each image to Front/Inside/Back/Inside N.
- **Offline**: persist locally until Review; show a small offline badge; edits all local.

## 7) Error & quality handling
- **Glare/blur/low light** detection → inline hint + allow capture; don’t block.
- **Auto‑deskew & crop** after capture; user can adjust in Edit.
- **Orientation** locked to correct upright using EXIF + edge detection.

## 8) Cancel & destructive confirm
- **Cancel (top-left)**:
  - If no images: exit to previous screen.
  - If ≥1 images: modal →
    - Title: `Discard this card?`
    - Body: `All captured images will be deleted. This can’t be undone.`
    - Buttons: `Keep Capturing` (primary), `Discard` (destructive)

## 9) Copy & labels
- Chip labels: **Front, Inside, Back, Inside 2, Inside 3…**
- Hints: “Flip the card to capture the inside.”, “Add Back if there’s a note.”
- CTA: **Continue → Review**

## 10) Accessibility
- Targets ≥ 44px; chips are focusable; announce status (“Inside captured”).
- VoiceOver: read chip order and state; describe toasts.
- High contrast and large text support; haptics optional.

## 11) Analytics & success metrics
- Events: `capture_start`, `shot_captured{type}`, `retake`, `edit`, `delete`, `add_back`, `add_inside_n`, `continue_review`, `cancel_discard`.
- KPIs: time-to-first-capture, % complete Front+Inside, retake rate, drop‑off before Review, average pages per card.

## 12) Wireframes (ASCII)

### 12.1 Capture — zero shots
```
┌──────────────────────────────────────────────┐
│ Cancel                     New Card      Continue ▸ (disabled)
├──────────────────────────────────────────────┤
│  ░  ░  ░  CAMERA PREVIEW  ░  ░  ░           │
│    ┌───────────────────────────────┐        │
│    │   ⟫ Align card to the frame   │        │
│    │   Hold steady—auto capture…   │        │
│    └───────────────────────────────┘        │
│                                            │
├──────────────────────────────────────────────┤
│ [○ Front]  [○ Inside]  [ + Back ]  [ + Extra ]  [ ⋯ ]           │
├──────────────────────────────────────────────┤
│  Flash   ● Shutter ●    Gallery          (thumb tray empty)      │
└──────────────────────────────────────────────┘
```

### 12.2 After capturing Front
```
Top toast:  ✓ Front saved    [Flip to Inside?  Capture | Skip]
Chips: [● Front] [○ Inside] [ + Back ] [ + Extra ] [ ⋯ ]
Continue ▸ becomes enabled
Thumb tray shows tiny Front thumbnail
```

### 12.3 With multiple captures
```
Chips: [● Front] [● Inside] [ + Back ] [ + Extra ] [ ⋯ ]
Thumb tray: [Front] [Inside] [Back?] … (tap → Retake/Edit)
Continue ▸ (enabled)
```

### 12.4 Image Detail (sheet)
```
[Front]
────────────
│  full preview           │
────────────
[Retake]  [Edit]  [Replace]   (Delete)
```

## 13) Review handoff (for context)
- On **Continue → Review**, pass ordered shots with labels, edits applied.
- Review screen can perform OCR/transcription, let user reorder/rename, and confirm.

## 14) Future enhancements
- **Auto‑label** side using vision model; let users override.
- **Smart sequence**: if Front found → auto highlight Inside chip.
- **Glare guard**: if severe glare, suggest angle change with micro‑animation.
- **Batch mode**: capture several cards back‑to‑back, review at the end.

---
**Why this works**: Defaults to *Front + Inside* (speed) while the Stack keeps the flow open‑ended (flexibility). Users see progress, can fix mistakes inline, and can bail safely. It respects edge cases without cluttering the main path.

