# vizmo Design System Reference

Source of truth: `docs/vizmo-markenhandbuch.pdf` (Markenhandbuch, 6 pages, German).
Read the section you need, not the whole file.

Every rule carries one of these tags:

- **[PDF]** stated in the Markenhandbuch. Do not change it.
- **[PDF-observed]** visible in the PDF layout but not written down as a rule. Use it as a strong default.
- **[Computed]** worked out from PDF values (for example WCAG contrast).
- **[Assumption]** not in the PDF. A working default for the demo, open to revision. Do not present it as brand.

Contents: 1 Brand · 2 Color · 3 Typography · 4 Logo & mark · 5 Spacing, radius, elevation · 6 Components · 7 Interaction states · 8 Voice & copy · 9 Open questions

---

## 1. Brand essence

- **[PDF]** Product: vizmo is a platform that lets private landlords (private Vermieter) organize apartment viewings without arranging every appointment themselves.
- **[PDF]** Trust runs both ways: landlords let strangers into their home, and applicants (Interessenten) reveal their identity. The brand therefore feels **calm, precise and reliable, not playful**.
- **[PDF]** Mark: two chevrons pointing forward and down, "two guided steps that arrive". They stand for the step-by-step flow from application to viewing.
- **[PDF]** Claim: „Besichtigungen, die sich selbst organisieren."
- **[PDF]** Supergraphic: the double chevron, cropped large, in slightly lightened Nachtblau. It is the recognition device on all social-media surfaces. **[Assumption]** In the app, use it only sparingly (empty states, onboarding or login hero), never as wallpaper.

## 2. Color

### 2.1 Tokens [PDF]

| Token | Brand name | Hex | Role per PDF |
|---|---|---|---|
| `blue` | Vizmo Blau | `#3C5BDA` | Primary: buttons, links, active steps, upper chevron |
| `night` | Nachtblau | `#151C39` | Body text, wordmark, dark surfaces, header |
| `lavender` | Lavendel | `#A9B8EF` | Accent, lower chevron, progress on dark backgrounds. **Surface/graphic only, never text on light** |
| `mist` | Nebel | `#E6EBFE` | Background areas, cards, badges, light app icon |
| `deep-blue` | Tiefblau | `#2B45B5` | Hover and pressed states, links on Nebel |
| `slate` | Schiefer | `#545B78` | Secondary text, labels |
| `gray` | Grau | `#8C93AD` | Placeholders, disabled elements. **Non-text only** |
| `line` | Linie | `#DCE1F0` | Dividers, input field borders |
| `surface` | Fläche | `#F6F7FC` | App page background |
| `white` | Weiß | `#FFFFFF` | Cards, content areas |
| `success` | Bestätigt | `#187A4C` | Identity verified, acceptance, slot booked |
| `warning` | Hinweis | `#E5A00D` | Deposit hold active (Betragssperre), action pending |
| `error` | Fehler | `#C23A3A` | Rejection, failed verification |
| `ink` | Schwarz **[Decision]** | `#000000` | Website header only: wordmark of the logo (owner's decision, deviates from the PDF's Nachtblau). Never for text or UI |

Implemented in `src/app/tokens.css` as Tailwind theme colors (`bg-blue`, `text-night`, `border-line`, …; CSS var `--color-<token>`). Tailwind's default palette is removed. Token names are **[Assumption]**. Brand names and hex values are **[PDF]**. Never put raw colors outside `tokens.css`.

### 2.2 Usage rules [PDF]

- Distribution: **60 % white/surface · 25 % Nachtblau · 10 % Vizmo Blau · 5 % Lavendel.**
- Blue is reserved for **actions and brand**. Use it sparingly so it stays strong.
- Use Nachtblau instead of black.
- Functional colors (Bestätigt / Hinweis / Fehler) appear **only in status indicators**, so they keep their meaning. Never use them for decoration, charts or category coding.
- Hinweis takes **Nachtblau text only**. Bestätigt and Fehler take white text.
- Lavendel is never a text color on a light background.

### 2.3 Contrast pairs

| Foreground on background | Ratio | Source | Use |
|---|---|---|---|
| White on Vizmo Blau | 5.7:1 | [PDF] | Primary button label |
| Nachtblau on White | 16.7:1 | [PDF] | Body text |
| Nachtblau on Nebel | 14.1:1 | [PDF] | Text on cards and badges |
| White on Tiefblau | 8.0:1 | [PDF] | Hovered or pressed primary button |
| Schiefer on White | 6.7:1 | [PDF] | Secondary text |
| White on Bestätigt | 5.4:1 | [PDF] | Success badge |
| Nachtblau on Hinweis | 7.5:1 | [Computed] | Warning badge (white fails at 2.2:1) |
| White on Fehler | 5.2–5.3:1 | [PDF]/[Computed] | Error badge |
| Vizmo Blau on White / Fläche / Nebel | 5.7 / 5.3 / 4.8:1 | [Computed] | Links. The PDF prefers Tiefblau on Nebel (6.7:1) |
| Schiefer on Fläche / Nebel | 6.2 / 5.6:1 | [Computed] | Secondary text on tinted areas |
| Bestätigt / Fehler on White | 5.4 / 5.3:1 | [Computed] | Status text (paired with an icon) |
| Lavendel on Nachtblau | 8.6:1 | [Computed] | Accent text on dark is acceptable. Not forbidden by the PDF (which forbids it only on light), and seen on the cover [PDF-observed] |
| Vizmo Blau on Nachtblau | 2.9:1 | [Computed] | **Fails.** Do not use blue text on dark |
| Grau on White | 3.1:1 | [Computed] | Fails for body text. Non-text only, as the PDF says |
| Linie on White | 1.3:1 | [Computed] | **Below the 3:1 non-text minimum.** See 6.3 |

## 3. Typography

- **[PDF]** Headings: **Poppins Bold**. It is related to the wordmark. (Owner is looking for a less generic alternative; Schibsted Grotesk Medium was tried and reverted until the right face is found.)
- **[PDF]** Body text and app UI: **Inter Regular / Medium**. It reads better at small sizes.
- **[PDF]** Both fonts come from Google Fonts.
- **[PDF]** Never reset the wordmark in another font. Always use the logo asset.
- **[Assumption]** Inter SemiBold (600) is allowed only where Medium can't carry hierarchy, for example table headers. Poppins appears in headings only, never in controls or body text.
- **[Assumption]** Type scale. The PDF gives no sizes.

| Role | Font | Size / line-height | Weight |
|---|---|---|---|
| Display (rare, hero/empty state) | Poppins | 31.25 / 38 | 700 |
| H1 page title | Poppins | 25 / 32 | 700 |
| H2 section | Poppins | 20 / 28 | 700 |
| H3 card title | Poppins | 16 / 24 | 700 |
| Body | Inter | 14 / 20 | 400 |
| Body emphasis, labels, buttons | Inter | 14 / 20 | 500 |
| Small / meta / captions | Inter | 12 / 16 | 400–500 |

- **[Decision]** Type scale (owner's request): a strict modular scale with ratio 1.25 from 16 px: 12.8 (`text-small`) · 16 (`text-copy`, `text-h3`) · 20 (`text-h2`, `text-lead`, `text-intro`) · 25 (`text-h1`) · 31.25 (`text-display`) · 39.06 · 48.83 · 61.04. The marketing sizes `text-section` (25 → 31.25 → 39.06), `text-hero` (31.25 → 39.06 → 48.83) and `text-stage` (31.25 → 39.06 → 48.83 → 61.04) step up one scale step per breakpoint (640, 1024, 1280 px) via media queries in `tokens.css`, never to in-between values. The only size off the scale is `text-body` (14 px) for dense UI: buttons, table cells, captions.
- Utilities: `font-display` (Poppins, always with `font-bold`), `font-sans` (Inter, default), and `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`. Tailwind's default size scale is removed.
- **[Assumption]** Use sentence case everywhere and no all-caps labels. Use tabular numerals (`font-variant-numeric: tabular-nums`) for times, dates, amounts and counts in tables.

## 4. Logo & mark

- **[PDF]** The default is the **horizontal color logo**. Use the stacked version only when width is tight.
- **[PDF]** Variants: horizontal color on light (default) · color on dark · blue (original) · single-color Nachtblau · single-color white (on blue or photos) · single-color black (print/fax) · stacked light / dark / white.
- **[PDF]** Background mapping: on Weiß, Fläche and Nebel use **color on light**. On Nachtblau use **color on dark**. On Vizmo Blau or busy photos use **single-color white**.
- **[PDF]** Clear space: at least **half the wordmark height** around the logo.
- **[PDF]** Minimum size: horizontal logo **80 px** (20 mm) wide. Below that, use the mark alone, from **16 px**, and then **always on a Nachtblau tile**.
- **[PDF]** Chevron colors: upper chevron Vizmo Blau, lower chevron Lavendel. Never recolor or swap them.
- **[PDF]** App icons: dark (default) is the mark on a Nachtblau rounded tile. Light is the mark on a Nebel tile. The favicon is the mark on a Nachtblau tile.
- **[PDF]** Not allowed: distorting, rotating or adding a shadow to the logo · recoloring or swapping the chevrons · Lavendel as text on light · resetting the wordmark in another font · the color logo on blue (the upper chevron disappears).
- **Implemented:** `src/components/shell/brand-logo.tsx` holds the horizontal logo traced 1:1 from the vector paths on the PDF cover (chevron polylines with stroke width 100 and round caps, wordmark outline). Tones: `dark` (Farbe auf Dunkel, white wordmark) and `light` (Farbe auf Hell). Use this component, never a font-set wordmark. **[Assumption]** The viewBox carries 4 units of padding on every side so the round chevron caps and the wordmark are never clipped at fractional pixel sizes.

## 5. Spacing, radius, elevation

The PDF defines none of these. Everything below is an **[Assumption]** unless tagged otherwise.

- Spacing: 4 px base grid. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Layout: app shell with a Nachtblau or white sidebar/header. Content on a Fläche background, in white cards. Max content width about 1280 px. Gutters 24 px desktop, 16 px mobile.
- Radius: the PDF's color tiles, cover and logo frames use clearly rounded corners, about 12–16 px at page scale **[PDF-observed]**. Proposed scale: 6 px (inputs, small badges) · 8 px (buttons) · 12 px (cards, panels) · 16 px (modals, large hero tiles) · full (pills, avatars). Radius follows hierarchy. Don't use one radius for everything.
- Borders over shadows: the PDF uses 1 px light borders (Linie-like) on white tiles and no shadows **[PDF-observed]**. Default to `border border-line` on cards. Reserve shadows for floating layers (menus, popovers, modals), tinted with Nachtblau (for example `0 8px 24px rgb(21 28 57 / 0.12)`), never pure black.
- Utilities: spacing uses Tailwind's 4 px scale (`p-4` = 16 px). Radius: `rounded-input`, `rounded-button`, `rounded-card`, `rounded-modal`, `rounded-full`. Shadow: `shadow-overlay` only. Width: `max-w-content`.
- Motion: 120–200 ms ease-out for state changes. Respect `prefers-reduced-motion`. No decorative entrance animations. This fits "calm, not playful" [PDF].

## 6. Components

The PDF specifies colors and roles only. Component anatomy is an **[Assumption]** built from those roles. Implemented in `src/components/ui/` and `src/components/shell/`; live preview at `/primitives`.

### 6.1 Buttons
- **Primary:** Vizmo Blau background with white text **[PDF role]**. Hover and pressed use Tiefblau **[PDF]**. One primary per view region.
- **Secondary:** white background, 1 px border, Nachtblau text. Hover uses a Nebel background.
- **Tertiary/ghost:** text-only, Vizmo Blau label (Tiefblau on Nebel surfaces **[PDF]**).
- **Destructive:** Fehler is a status color [PDF]. Express a destructive action as a secondary button with Fehler text/border only inside a confirm step. **[Assumption, review]** Not implemented yet; add it to `button.tsx` when a screen needs it.
- Loading: spinner replaces the icon, button disabled with `aria-busy`. Disabled primary uses Grau with a white label.
- Heights: 32 px (compact/table), 40 px (default). Label in Inter Medium 14. Labels name the next step („Slot buchen", „Identität bestätigen") **[PDF tone]**.

### 6.2 Links
- Vizmo Blau. Hover is Tiefblau with an underline. On Nebel, use Tiefblau **[PDF]**.

### 6.3 Inputs
- White fill, Linie border **[PDF]**, Nachtblau value text, Grau placeholder **[PDF]**, Schiefer label above the field.
- Because Linie on white is 1.3:1 [Computed], the field must also be identifiable without the border: a visible label always, and a hover border in Grau. **[Assumption]**
- Focus: 2 px Vizmo Blau ring (see 7). Error: Fehler border plus an error message with an icon below the field.

### 6.4 Badges / status
- Neutral/info badge: Nebel background with Nachtblau text **[PDF]**.
- Status badges use only the functional colors and only for their stated meanings **[PDF]**: Bestätigt (verified, accepted, slot booked), Hinweis (deposit hold, action pending; Nachtblau text), Fehler (rejected, failed check).
- **[Assumption]** Always pair status color with an icon or text. Color is never the only signal. Implemented: solid badges only. Each status tone has a fixed icon (CircleCheck / TriangleAlert / CircleX). A subtle tinted variant isn't built: Hinweis on light fails as text (2.2:1) and as an icon (below 3:1), so a light warning variant would need Nachtblau text and icon and would lose its color signal.

### 6.5 Cards & surfaces
- Page background Fläche. Cards white or Nebel **[PDF]**. Dark surfaces and the header are Nachtblau **[PDF]**.
- Avoid a uniform card grid. Vary density and structure by content (lists, tables, timelines, detail panes). **[Assumption]**

### 6.6 Steps / progress
- Active step: Vizmo Blau **[PDF]**. Progress on dark: Lavendel **[PDF]**.
- **[Assumption]** Completed step: Nachtblau with a check (not Bestätigt green, which is for status). Upcoming: Grau. The two-chevron "step by step" idea may be echoed in stepper visuals, not as literal logo copies.

### 6.7 Tables & lists
- **[Assumption]** Header row in Inter Medium 12–13, Schiefer, Linie dividers, rows 44–52 px, tabular numerals, hover row on Fläche.

### 6.8 Navigation
- **[Assumption, implemented]** Nachtblau sidebar (240 px) from 768 px up. Below that, a Nachtblau top bar with a menu button opens the same nav as a modal drawer (native `<dialog>`). Inactive items are Lavendel, hover is white on `white/5`, active is white on `white/10` with a Lavendel left indicator. Focus rings on dark surfaces are white. Sections: "Vermieter" (screens) and "Entwicklung" (`/primitives`) pinned to the bottom. The horizontal logo (Farbe auf Dunkel) sits top-left. It doubles as a hidden presenter switch: clicking it hides or shows the "Entwicklung" section (`src/lib/dev-mode.ts`, remembered in localStorage, hidden until hydration so the audience never sees it flash). Keep this identical on all screens.

### 6.9 Iconography
- **[Decision, founder feedback]** No sparkle or star icons for AI features. They read as generic "AI". Use content icons instead (text, speech bubble, check) and label AI output in plain words ("KI-Zusammenfassung").
- **[Assumption]** No icon set is specified. Using `lucide-react` (2 px default, rounded joins; nav uses 1.75). Use a single outline set with 1.5–2 px strokes and rounded joins (matching the chevrons' rounded strokes), sized 16/20/24, colored Nachtblau or Schiefer.

## 7. Interaction states

| State | Rule | Source |
|---|---|---|
| Hover (primary/link) | Tiefblau | [PDF] |
| Pressed (primary) | Tiefblau. Optionally a slightly darker shade or `scale(0.98)` | [PDF] / [Assumption] |
| Focus-visible | 2 px Vizmo Blau outline, 2 px offset (white offset on dark surfaces) | [Assumption] |
| Disabled | Grau for the element; label stays readable, with no hover effect; `aria-disabled`/`disabled` | [PDF] Grau = disabled; rest [Assumption] |
| Selected / active | Nebel background with Nachtblau text, or Vizmo Blau indicator | [Assumption] built on [PDF] roles |
| Loading | Skeletons in Nebel/Linie. Keep the button width stable and show a spinner in the label color | [Assumption] |
| Empty | Short explanation and one primary action naming the next step. The supergraphic is optional | [Assumption] built on [PDF] tone |
| Error | Fehler, only as status. The message says what happened and how to fix it | [PDF] / [Assumption] |
| Success | Bestätigt, only as status | [PDF] |

## 8. Voice & copy

- **[PDF]** Matter-of-fact, friendly, clear. Say what happens next instead of selling. Examples: „Slot buchen", „Identität bestätigen".
- **[PDF-observed]** The brand language is German.
- **[Assumption]** UI copy is German. Use "Sie" or "du" consistently (not yet decided, see 9). Action names stay the same through a flow (button „Slot buchen" leads to toast „Slot gebucht").
- **[Assumption]** Mock data uses realistic German names, addresses, dates (DD.MM.YYYY, 24 h) and EUR amounts (`1.250 €`).

## 9. Open questions

1. Logo assets: resolved by tracing the PDF vectors (see 4). Official SVG/PNG files would still be welcome for the favicon and app icons.
2. Copy: German or English UI? Formal "Sie" or informal "du"?
3. Audience: the brief says B2B SaaS, but the PDF describes private landlords. Which personas do the 10 screens serve (landlord, applicant, admin)?
4. The 10 screens: list, priority, and which ones are landlord-facing or applicant-facing.
5. Is dark mode required? The PDF defines no dark UI theme.
6. Data visualization palette: the PDF defines none, and functional colors may not be used for charts. Proposed: Blau, Lavendel, Nachtblau and Schiefer tints. Needs confirmation.
7. Spacing, radius, type sizes and shadows are all assumptions (section 5). Confirm them, or treat them as the demo's de-facto standard.

## 10. Screens

Product context from the founders' system notes (`System Für 1. Prototypen.pdf`, outside the repo): two roles. Landlord area at `app.govizmo.de/p/…`, applicant area at `app.govizmo.de/u/…`. Demo routes mirror this.

| # | Route | Role | Status |
|---|---|---|---|
| 0 | `/` | Landlord | Built. "Meine Inserate": open listings (online and draft) with applications, slots and smartlock state, quick links to applications, slots, criteria and manage. Finished listings below |
| 1 | `/p/inserate/neu` | Landlord | Built. Six-step wizard (Wohnung, Miete und Vertrag, Besichtigungen, Bewerberkriterien, Fotos, Prüfen und erstellen) with step status, validation on "Weiter" and a completeness checklist. Optional AI prefill from a pasted listing text (fields marked "please check"). Listing photos (public, first = cover) and at least 3 reference photos (private). Price 42 €, button "Zahlungspflichtig erstellen" (§ 312j BGB). Success state with application link (`app.govizmo.de/u/bewerben/<slug>`) and the Nuki + Huawei LTE-stick DHL shipment |
| – | `/p/inserate/<slug>` | Landlord | Built. Manage an online listing: tabs Überblick / Besichtigungsslots (`#slots`) / Anforderungen (`#kriterien`), plus "Inserat beenden" with reason and consequences |
| 3 | `/u/bewerben/<code>` | Applicant | Built. Public application page behind the listing link, **mobile first**. Listing facts (exact address only after booking) and the landlord's criteria are shown openly. Five steps: Kontakt (name and e-mail required, phone required only for call/SMS contact), Haushalt und Einzug, Beruf und Einkommen (optional documents, guarantee), Über Sie (free text plus extras, live AGG hint), Prüfen und absenden (two consents). Ends with a confirmation and next steps |
| 4 | `/u/einladung/<token>` | Applicant | Built. Personal invitation (Clara Richter). Four steps on one page with a sticky book button: (1) pick a slot from the landlord's pattern, taken slots visible but disabled, reserved for 15 min; (2) identity via Didit (simulated: document choice, address for passports, capture, check); (3) four documents (viewing rules, house rules, liability and deposit, privacy), each readable and individually confirmed; (4) 25 € pre-authorization via Apple Pay, Google Pay or card (no card fields). Success reveals the full address, access steps, a real .ics download and the confirmation e-mail |
| 2 | `/p/inserate/gneisenaustrasse-41/bewerbungen` | Landlord | Built. Applications ranked by match with the landlord's criteria (no exclusion), status tabs, hide-names toggle, detail side panel with per-criterion check, bulk invite (email preview: video tour, slot, Didit ID check, 25 € hold) and neutral decline |

Screen 1 decisions **[Assumption]**: the AI prefill is a regex extractor (`extract.ts`), with no model call. The Nuki Opener is added for buildings with an intercom. Viewing deposit is 25 € (recommended) or 50 €, pre-authorized via Stripe for at most 7 days. Price is 42 € per listing, as given by the founders (October 2026). Occupied flats get accompanied viewings and no shipment.

Criteria decisions **[Assumption]**: the predefined criteria are income, employment, household size, pets, smoking, move-in date and lease length, plus SCHUFA marked "Bald verfügbar" (notes: later). Custom criteria pass a simulated AI check (`features/criteria/agg-check.ts`, pattern-based) that rejects the § 1 AGG grounds (ethnic origin incl. language proxies, religion, gender, sexual identity, age, disability/health) plus family planning and party membership, with an explanation. Accepted custom criteria count as "to clarify" in the ranking.

Manage page decisions **[Assumption]**: slot changes apply to future weeks, booked viewings always stay, and single slots or whole days can be blocked for the next 14 days. Cancelling a booked viewing happens in the applicant list. Ending a listing deactivates the link, informs invited and booked applicants, sends neutral declines and deletes smartlock access.

Screen 2 decisions **[Assumption]**: the match score is 1 point per met criterion and 0.5 for "to clarify" (pets on "nach Absprache"). The match meter uses Nachtblau, Lavendel and Linie, never status colors, because it's data. Status badges map as Neu = neutral, Eingeladen = Hinweis ("action pending"), Slot gebucht = Bestätigt, Abgesagt = Fehler. Declines carry no reason (AGG). The detail view shows salutation and, only if the applicant shared it voluntarily, age. Both are never used for ranking and are hidden with "Namen ausblenden". Legal note: data protection authorities advise against collecting age in the pre-selection phase, so this needs legal review before production. Invitations are valid for 72 hours. Booked applicants show their slot (date resolved relative to today). After a viewing the status becomes "Besichtigt", with the applicant's feedback (interest, comment) and the reference photo comparison ("no findings" or a Hinweis badge with the finding). Extra messages are categorized (Unterlagen, Rückfrage, Terminwunsch, Vorstellung, Nachfrage zum Stand), summarized by AI (mocked text) and counted ("3 gesendete Nachrichten", "0 Nachrichten"). A message can satisfy an existing criterion (e.g. a guarantee covers the income, dog photos settle "Haustiere nach Absprache"). The criterion then counts as met, gets highlighted ("Nachricht" marker with a speech-bubble icon), and ranks higher on ties. There is no separate criterion row. Messages that touch AGG-protected grounds (`protectedGroundsIn`) never affect match or ranking and are labelled as not considered. Viewings are unaccompanied, so nothing is "clarified at the viewing": open points are clarified in advance by message or video call, and custom criteria are asked in the application form. "Videokonferenz vereinbaren" lets the landlord propose up to three times, presets or own date and time. The call itself is a placeholder for later. Relative times ("Heute, 14:21") render client-side only, to avoid hydration mismatches in the static export.

Applicant decisions **[Assumption]**: only AGG- and data-protection-compatible questions. No age, origin, religion, health or family planning. Salutation is optional and only used for addressing e-mails. Every question behind a landlord criterion is required (move-in, pets, smoking, employment, income), everything else is optional. The fixed bottom action bar (48 px buttons) sits in the thumb zone. On touch devices form controls use 16 px text to prevent iOS zoom. Note: the landlord view still shows voluntary ages from older mock applications; the form no longer asks for age.

## 11. Marketing website

`src/app/(site)/`, built from the same tokens and primitives as the app.

- **[Decision]** unslop polish pass (heydamir/unslop, November 2026): key figures in Nachtblau, not Blau (blue stays for actions); section labels like „Pilotprojekt“ are plain Schiefer text, not pills; headings end without a period (the claim keeps its period as in the PDF); decorative icons take the text color (Nachtblau, Schiefer, Lavendel on dark), never Tiefblau; step cards carry only their number, no extra icon; trust icons stand without a tile; section headings name what this product does instead of generic lines.
- **[Assumption]** Extra type tokens for marketing only: `text-copy`, `text-hero`, `text-section`, `text-stage`, `text-lead` and `text-intro` (sizes in the type scale above). Don't use them inside the app.
- **[Decision]** E-mail capture (`components/ui/email-capture.tsx`, previewed on /primitives): one fused control for a single address plus one action. Input (16 px) and primary button share one `rounded-card` field with 4 px padding; the button keeps `rounded-button` (card radius minus 4 px), so inner and outer corners stay concentric. Max width 512 px. `light` (default): white field with a half-opacity Grau ring (Linie is too faint on the Nebel tint), full Grau on hover, 2 px Vizmo Blau ring on focus, error in Fehler red. `dark`: translucent strip on Nachtblau, white focus ring, error in white. Input and button are 40 px high (48 px field, slim like Attio or Personio, so it reads wide, especially on phones). The label is visually hidden (placeholder and surrounding copy name the field). No note below by default; after submit one live line shows the error or the success (`success`, Erfolg check icon), and `loading` disables the button while sending.
- **[Decision]** Homepage hero (owner's request: back to the open, Stripe-inspired light version, with less text): Nebel tint at the top fading to white, running up behind the transparent header. Above the headline one announcement pill links to /pilot (`PilotPill`, Attio/Personio style): `rounded-full`, Linie border on translucent white, a small Nebel „Pilot" tag in Tiefblau, one plain sentence in Nachtblau and a Vizmo Blau arrow, so it stays in the blue family of the button below; no glow, gradient or sparkle. **[Assumption]** The headline says what vizmo is („Die Plattform für Besichtigungen, die sich selbst organisieren", matching the page title; the brand claim belongs to the footer), then one short sentence and the pilot sign-up (`HeroSignup`, e-mail only, id `pilot`, `EmailCapture` light, no hint line). No trust line or second button. On phones the ribbon sits higher (38 % instead of centred), so it starts right under the sign-up. On the right the double chevron as a ribbon of fine strands (`HeroRibbon`, drawn once on load) behind the demo's application list (`HeroVisual`, whose badges appear once after it). A dark Nachtblau hero was tried and rejected by the owner. The pilot section is not repeated on the homepage (it stays as the /pilot page); „Für den Pilot vormerken" further down links to /pilot, like the header button (jumping back up the page felt broken).
- **[Decision]** Chevron edge (signature, owner asked for more identity): at two transitions on the homepage, hero → problem and comparison → trust (on /so-funktioniert: both sides → trust), the section above reaches down into the next as a wide, shallow V edged in Vizmo Blau, with a Lavendel chevron following below it: the double chevron of the mark at page scale (`ChevronEdge`, 5 px strokes, 64/96/160 px tall by breakpoint). The arms start below the section boundary and fade in from transparent at the page edges (horizontal gradient stroke), so the V grows out of the surface instead of looking cut off at the top. Never use it at more transitions, or it turns into a pattern. - **[Decision]** Comparison (Makler, selbst, vizmo) has no boxes: hairline rows under a 2 px Nachtblau rule, and the vizmo column is a square-cut Nachtblau band with white text that rises above the header row. On phones each criterion is a block on a Nachtblau rule with the vizmo line as a Nachtblau strip.
- **[Decision]** Fewer cards, deliberate breaks (owner's request): marketing sections avoid grids of identical rounded cards. Figures in „Handarbeit" sit on a Nachtblau top rule and step down like the chevron (second and third column offset). The five steps are open columns on a 2 px Nachtblau rule with large numbers. „Für Vermieter" and „Für Interessenten" are two open columns split by a hairline, the second set lower. The product section mirrors its rows, and one Nebel block and the screenshot run off the page edge. Cards remain where they hold an interaction (pilot form, pricing).
- **[Decision]** Product section („So sieht vizmo im Alltag aus"): two animated product moments instead of static screenshots (`process-demos.tsx`): applications arrive and re-sort by fit, then the top three are invited; an applicant picks a free slot on a phone, books it and sees the confirmation. They loop slowly only while on screen (`use-loop.ts`), hold their finished state under reduced motion, and carry a visually hidden sentence for screen readers. One real screenshot (Inserate) stays, labelled as a real excerpt.
- **[Assumption]** Section rhythm: white, surface and mist sections alternate, with one Nachtblau section (trust: „Sicher für Ihre Wohnung, fair für Interessenten“) for contrast. Content width is `max-w-6xl`.
- **[Decision]** Cookie banner: a floating, centred card (`max-w-xl`, `rounded-modal`, `shadow-overlay`, 12/24 px from the bottom) instead of an edge strip, so it reads as one deliberate step. "Ablehnen" and "Akzeptieren" are styled identically (secondary), with "Einstellungen" as a tertiary button. After a choice a round cookie button (44 px, white, Linie border, `shadow-overlay`) stays bottom left and reopens the settings, so withdrawing is as easy as consenting; the footer link stays too. "Statistik" switches on Vercel Web Analytics. The settings use `Dialog size="lg"` (672 px, 24 px title, 16 px text, 48 px buttons that stack full width on phones; full screen on phones; the whole dialog scrolls with a pinned footer instead of a small inner scroll area) so they read like the rest of the site; "Notwendig" shows an "Immer aktiv" label instead of a disabled checkbox.
- **[Decision]** Contact is a guided flow (owner's request): topic (five large choices, choosing advances), two to four questions that fit the topic (for example number of apartments and pilot interest for landlords; none for „Etwas anderes", which skips the step), message, name and e-mail, then a review with „Ändern" per row. Progress bar and „Schritt x von y" on top, focus moves to each step's heading. Square-cut 2 px Nachtblau top rule instead of a card.
- **[Decision]** The contact flow and both pilot forms send straight to kontakt@govizmo.de via Web3Forms (`features/site/send-form.ts`, public access key in `NEXT_PUBLIC_WEB3FORMS_KEY`, CSP `connect-src` allows `api.web3forms.com`), with a hidden honeypot (`honeypot.tsx`) against spam. States: sending (button loading), sent (success line or screen), error (retry hint, contact flow names the address). While no key is set, the forms fall back to a mailto e-mail and the success copy says so; the privacy policy switches its paragraph on the same key. `features/site/mailto.ts` strips control characters and caps lengths for both paths.
- **[Decision]** "Ein Blick in vizmo" shows real screenshots of the demo, cropped to the part that matters (`public/product/*.webp`, captured from the static build at 3x with the development nav hidden, WebP q92 with `-sharp_yuv` so text stays crisp on retina screens). Desktop crops span the full content width so their text renders at roughly 1:1; landlord screens also have a `-mobil` crop of the responsive layout, served below 640 px via `<picture>`. Frames use borders only, no shadows. Re-capture them when those screens change.
- **[Decision]** The website doesn't link to the demo (`/p/…`, `/u/…`) yet. Calls to action point to the pilot waitlist (`/#pilot`) and the contact page. The demo routes still exist and are noindex.
- **[Assumption]** Marketing body copy is 16 px (`text-copy`, set on the site layout); hints and captions use `text-body` (14 px), never 12 px. The app keeps its 14 px body.
- **[Decision]** Header logo: black wordmark (`BrandLogo tone="ink"`), as is common on landing pages; the footer keeps Farbe auf Dunkel. Clicking it is a plain `<a href="/">`, so the start page reloads fully. The footer no longer says "Entwickelt und gehostet in Deutschland" (not true for the Vercel-hosted site); the trust section now says „Entwickelt in Osnabrück" and only claims what is true today (processors bound by DPA). Avoid compliance claims as titles („DSGVO-konform", „AGG-konform"); describe what we do instead („Datensparsam nach DSGVO", „Faire Auswahl nach AGG"). /pilot uses the same `HeroSignup` field as the hero, no box, with a one-line privacy note; the contact flow has the same note under „Nachricht senden".
- **[Decision]** Analytics: Vercel Web Analytics (`@vercel/analytics`, `SiteAnalytics` in the site frame) counts page views of the public website without cookies. It loads only after consent to „Statistik" in the cookie banner (`useStatisticsConsent`), so visitors who reject are not counted. The demo (/p, /u) is not tracked. Must be enabled once in the Vercel project (Analytics tab).
- **[Decision]** Fonts are self-hosted: `next/font/google` downloads Poppins and Inter at build time and serves them from `/_next/static/media`, so visitors never connect to Google (LG München I, 3 O 17493/20).
- **[Decision]** Team page `/team` (header, mobile menu, footer under Unternehmen, sitemap): Justus Meister, Jan Witte and Johanna Spratte with round portraits of equal size (`public/team/*.jpg`, 480 px squares; Justus' photo is a square crop of his portrait with the head centered), name, role in Schiefer and one line on their focus. The pilot section keeps "Sie sprechen direkt mit uns, dem Gründerteam." The legal pages still name only Justus Meister.
- **[Decision]** vizmo is in the pre-founding phase: no registered company, so no "GmbH i.G.", register entry or VAT ID anywhere. `company.name` is "vizmo". Imprint and privacy policy name only Justus Meister (provider and responsible under § 18 MStV) with an interim address (Ursulaschule Osnabrück); no phone number. The contact page shows no address. The footer reads "© 2026 vizmo. Alle Rechte vorbehalten."
- **[Decision]** The legal pages are filled in (no placeholders): hosting Vercel (USA, DPF and SCCs), DNS Cloudflare (DNS only), e-mail IONOS, supervisory authority Niedersachsen, no data protection officer (contact: Justus Meister). Have them reviewed legally before launch.
- **[Assumption]** One 404 page (`src/app/not-found.tsx`) for every unknown URL, inside the site frame (header, footer), with links to the start page, contact and main sections. noindex.
- **[Assumption]** Mobile site menu: a full-height panel below the header, opened by a three-line toggle that animates into a cross in one motion (300 ms): the outer lines move to the middle and rotate to 45° while the middle line fades out (150 ms), without squeezing or folding. No motion under `prefers-reduced-motion`. Pressing only greys the lines (`active:text-gray`); the grey tap highlight is disabled globally, since every control has its own pressed state.
- **[Assumption]** The contact page has no cards or shadows: plain fields, details as a divided list. The cookie banner is a flat bottom bar with a top border.
- **[Decision]** Security headers (CSP, HSTS, frame-ancestors none, nosniff, Referrer-Policy, Permissions-Policy) live in `vercel.json`. `script-src` needs `'unsafe-inline'` for Next's inline bootstrap scripts in a static export. Demo routes also get `X-Robots-Tag: noindex`.
- Content sources: pitch deck "Finale V2" (Oktober 2026). Pricing is 39 € plus 45 % of the first cold rent. Note: the demo's listing wizard still shows 42 €.
- **[Decision]** Squircle corners: `rounded-input/button/card/modal` use `corner-shape: squircle` where supported (Chromium 139+), with the radii scaled about 1.7× inside `@supports` so the visual corner size stays the same (6/8/12/16 → 10/14/20/28 px). Other browsers keep plain round corners. `rounded-full` stays circular. Defined in `tokens.css`.
- **[Decision]** Icon set (owner's rules, deviating from the PDF's Nachtblau tile):
  - Browser tab and Google Search: `src/app/icon.svg` (primary) and `favicon.ico` (16/32/48 px fallback), the color mark on a **transparent** background, so it sits on light and dark tabs and in search results. The chevrons keep their brand colors (the PDF forbids recoloring them).
  - iOS home screen and tab overview: `src/app/apple-icon.png`, 180 px, mark on opaque white with 15 % margin on each side, so iOS rounding cuts nothing.
  - Android and PWA: `public/icon-192.png` and `icon-512.png` (`any`) are the mark on a **white circle** with a transparent surround (owner's request: a circle, not a rounded square). `icon-maskable-192.png` and `icon-maskable-512.png` (`maskable`) stay full white squares with 20 % margin, because launchers cut them to their own shape. `background_color` white.
  - The iOS icon cannot be a circle: iOS always cuts its own rounded square and fills transparency with black.
  - Safari pinned tabs: `public/safari-pinned-tab.svg`, the mark in one solid color on transparent, tinted Vizmo Blau via `mask-icon` (color in `src/config/brand-meta.ts`, which mirrors the token and is excluded from `check:tokens` because HTML metadata cannot read CSS variables).
  - All icons are rendered from `src/app/icon.svg`, the traced PDF mark.
- **[Decision]** Footer: LinkedIn link (`company.linkedin`, linkedin.com/company/govizmo) below the e-mail, with LinkedIn's "in" mark as an inline SVG in the text color (lucide has no brand icons); opens in a new tab. Also listed as `sameAs` in the Organization JSON-LD.
- **[Decision]** No page may scroll sideways at any width (checked at 320 to 1920 px): very long heading words carry soft hyphens (no automatic hyphenation, which split short words like „al-lem“), body text uses `break-words`, the site frame has `overflow-x-clip` as a safety net, and the comparison table becomes one card per criterion below 768 px instead of a scrolling table.
- **[Decision]** Below-the-fold images load lazily (`loading="lazy"`). No `content-visibility` on sections: Safari can paint such sections blank for a moment, which reads as flicker. No fade-in or scroll animations.
- **[Decision]** Canonical domain is `https://www.govizmo.de` (`src/config/site-pages.ts`; Vercel redirects the apex `govizmo.de` to www). Standard files: `/sitemap.xml` and `/robots.txt` (generated at build, demo excluded), a canonical URL per page, `/.well-known/security.txt`, Organization/WebSite JSON-LD on the homepage, OG and Twitter cards. The `vizmo-demo-app.vercel.app` host sends `X-Robots-Tag: noindex` so only www.govizmo.de gets indexed.
- **[Decision]** Every header and menu entry has a page of its own: `/so-funktioniert` (steps, screenshots, both sides, trust), `/preise`, `/vision`, `/team`, `/faq`, `/kontakt`, `/pilot` (waitlist with the heading as h1, then the steps). Clicking the entry of the page you're on reloads it; the current entry carries `aria-current="page"`.
- **[Decision]** Dialog: it takes focus itself on open; the close button never shows the blue focus ring and gets the Nebel tint on keyboard focus instead (owner's request).
- **[Decision]** `/preise` is a page of its own (price card, what's included, comparison, pricing questions); the nav links there. The homepage keeps a short pricing section with a link to it. Card and comparison live in `features/site/pricing.tsx`.
- **[Decision]** Mobile menu: a link to another page keeps the menu open until the new page has rendered, then it closes; closing on tap would flash the old page while the next one loads. Links within the current page close it at once.
- The OG image comes from `vizmo-brand-original/04_social-media`. Originally favicons, the manifest and the OG image came from `vizmo-brand-original/03_favicon` and `04_social-media`.
