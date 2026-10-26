# vizmo demo app

Frontend-only demo of **vizmo**, a platform that lets landlords run apartment viewings (applications, identity checks, slot booking) without arranging each appointment themselves. The deliverable is **10 independent screens** that must look like parts of one finished product.

## Sources of truth
- Brand: `docs/vizmo-markenhandbuch.pdf`. Don't re-read it; its content is extracted into the reference below.
- Design reference: `docs/vizmo-design-system.md`. **Read the relevant section before any UI work** (tokens, type, components, states). Rules tagged `[PDF]` are fixed. Rules tagged `[Assumption]` are defaults: if you change one, update that file in the same change.
- Never invent brand specs. If something isn't covered, pick the most restrained option consistent with the doc, then add it there as `[Assumption]`.

## Architecture constraints
- Stack: Next.js 16 (App Router, `output: "export"` → static `/out`), React 19, TypeScript (strict), Tailwind CSS v4, npm. Code lives in `src/`; import alias `@/*`.
- Static export means no server features: no Route Handlers, Server Actions, cookies, rewrites, `next/image` optimization, or dynamic routes without `generateStaticParams`. Before using a Next API, check the bundled docs in `node_modules/next/dist/docs/`, which match the installed version.
- No backend, auth or network calls. All data comes from typed local mock fixtures with realistic German content.
- Tokens: `src/app/tokens.css` (Tailwind `@theme`) is the only place raw values live. Default Tailwind colors, type sizes, radii and shadows are removed, so use the brand utilities only (`bg-blue`, `text-h1`, `rounded-card`, `shadow-overlay`). Change a token there and in the design doc together.
- Layout: `src/components/ui/` holds the primitives (Button/ButtonLink, Input/Textarea/Select, ChoiceChip, Badge, Card/CardHeader, Table, Notice, Progress, StepList, CopyField, Checkbox, Avatar, Segmented, Dialog, Toast). Screen-specific code lives in `src/features/<screen>/`; its route file in `src/app/(app)/` stays thin. `src/components/shell/` holds AppShell, PageHeader and nav. Nav entries live in `src/config/navigation.ts`. Screens inside the shell go under `src/app/(app)/`. `/primitives` previews every primitive; add new variants there.
- Screens compose primitives and never restyle them locally. `className` on a primitive is for layout only (margin, width, grid placement). Import each module directly; no barrel files. Icons come from `lucide-react`.
- Each screen is self-contained: its own route, no cross-screen state, renders in isolation. Shared read-only mock data lives in `src/data/` (listings), cross-screen logic in `src/features/criteria/` (criteria model, editor, AGG check). Screens copy fixture data into local state; nothing writes back.
- Add a dependency only when it removes real work. Note the reason in the commit message.

## Design requirements
- The brand feels calm, precise and reliable, not playful. Blue is reserved for actions and brand. Status colors appear in status indicators only. Use Nachtblau instead of black. Never use Lavendel as text on a light background.
- Fonts: Poppins Bold for headings only. Inter Regular/Medium for everything else.
- Logo: use the asset only and follow the background mapping and minimum sizes in the doc. Never typeset the wordmark.
- Copy follows the PDF tone: name the next step („Slot buchen"). Use sentence case and keep action names consistent across a flow.
- Quality floor: WCAG AA contrast, visible focus, keyboard reachable, `prefers-reduced-motion` respected, works at 375 px and 1440 px. Every screen covers empty, loading and error states where they apply.

## Skills
- `frontend-design`: use it when planning a new screen's layout and composition. Brand tokens, fonts and tone in the design doc **override** its aesthetic freedom. Its value here is layout, hierarchy, copy and avoiding templated patterns, not choosing palettes or typefaces.
- `vercel-react-best-practices`: use it when writing or refactoring React code. Its server/data-fetching rules mostly don't apply, since this app is frontend-only.
- `web-design-guidelines`: run it as the review pass on each finished screen (it fetches current rules from the web).

## Working rules (token efficiency)
- Read only the files and doc sections a task needs. Don't re-read files you just wrote.
- Work on one screen per session or task where possible. Reuse existing primitives before creating new ones.
- Keep this file short. Put detail in `docs/`.

## Verification (before calling a screen done)
1. `npm run verify` passes (lint, typecheck, `check:tokens` for raw colors outside `tokens.css`, static build).
2. Run the screen with `npm run dev` (launch config `dev` in `.claude/launch.json`) and screenshot it at 1440 px and 375 px. Compare against the design doc.
3. Check: focus states work, status colors used only for status.
4. `web-design-guidelines` review on the screen's files. Fix the findings or list them.
5. Report what was verified and what wasn't.
