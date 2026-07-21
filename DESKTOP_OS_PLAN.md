# AndyOS — Retro Windows XP/98 Desktop Redesign Plan

## Context

andyhuangling.com is currently a single fake-terminal React app ([App.js](src/App.js) renders one `<Terminal />`). The next major upgrade turns the site into a **fake desktop OS**: a Windows XP/98-style desktop with clickable icons (Terminal, Resume, Projects, About, Games, Contact, Guestbook) that open real windows you can drag, resize, minimize, maximize, and close — plus a taskbar, Start menu, and boot screen. On phones, the site becomes a "phone OS": icon grid home screen, apps open fullscreen with home/back controls.

This plan was produced with three Opus planning agents (window manager/shell, apps, mobile/polish) after a codebase exploration. Key finding: **everything needed already exists as portable pieces** — the terminal ([Terminal.js](src/components/Terminal.js), ~421 lines), Snake ([Snake.js](src/components/Snake.js)), all portfolio content as data ([content.js](src/components/content.js)), EmailJS contact, localStorage guestbook — so this is mostly building a window-manager shell around existing components.

### Owner decisions (locked)
- **Aesthetic:** retro Windows XP/98 — beveled buttons, gradient title bars, classic taskbar + Start button, boot splash.
- **Drag/resize:** hand-rolled with pointer events. **Zero new npm dependencies.**
- **Mobile:** phone-OS mode (icon grid, fullscreen apps, home/back bar) below 768px.
- **Scope:** full replacement — the desktop IS the site; the terminal becomes one app.

### Current-state facts that shape the plan
- CRA (react-scripts 5), React 18, plain CSS, no router in use, no state library. `React.StrictMode` is on (reducers must stay pure; effects idempotent).
- Themes via CSS vars on `[data-theme]` in [App.css](src/App.css) (`--accent-1` orange, `--accent-2` blue, `--terminal-bg`…).
- [Terminal.js:367-379](src/components/Terminal.js:367) has a **global keydown listener that force-focuses its input on any keypress** — must be scoped to window focus. [Snake.js](src/components/Snake.js) also attaches global key/touch listeners.
- `.terminal-container` is hardcoded `70vh × 60vw` in App.css — the anti-pattern every app must avoid (apps must be fluid: 100%/100%).
- Deploy: GitHub Actions → GitHub Pages on push to `main`; **CI runs `npm test` first**, and [App.test.js](src/App.test.js) asserts the old terminal boots — it WILL fail once App.js renders the desktop, so it must be rewritten in the same change (launch blocker).
- Assets: `public/background.png` is **4.1MB** (de-bloat), `chatroom.mp4` 4.3MB (must not preload), `manifest.json` is a broken CRA stub, `public/CNAME` must survive (custom domain).

---

## Architecture Overview

```
App
└─ WindowManagerProvider                  (Context + useReducer — device-agnostic)
   ├─ BootScreen                          (once per session, sessionStorage 'osBooted')
   └─ mode === 'phone' ? PhoneShell : Desktop     (useOSMode: matchMedia max-width 768px)
      Desktop                             PhoneShell
      ├─ DesktopIconGrid → DesktopIcon×N  ├─ PhoneStatusBar (clock, fake battery/signal)
      ├─ WindowLayer → Window×N           ├─ PhoneHome (icon grid from registry)
      │   └─ <AppComponent/>              └─ PhoneApp (fullscreen focused app + nav bar)
      └─ Taskbar → StartButton/StartMenu,
                   TaskbarButton×N, Clock
```

**Core decisions:**
1. **State:** single pure reducer in `src/os/windowManager.js` (no React) + `WindowManagerProvider` context. Window model: `{id, appId, title, icon, x, y, w, h, z, state: normal|minimized|maximized, prev}`. Actions: `OPEN, CLOSE, FOCUS, MINIMIZE, MAXIMIZE, RESTORE_AND_FOCUS, MOVE, RESIZE`. Z-order via a monotonic `zCounter` — FOCUS bumps to `++zCounter`, no normalization needed. **Reducer must assign default x/y/w/h at OPEN** (cascade spawn: `40 + 24*openCount`) so phone→desktop mode flips are clean.
2. **App registry:** `src/os/apps/registry.js` — `APPS = { appId: {title, icon (emoji), component, defaultSize, minSize, singleton} }` + `DESKTOP_ICONS` (curated subset). The single contract between shell and apps; shell never hardcodes app knowledge. All apps `singleton: true`.
3. **Focus contract:** `useWindowFocus()` hook (`src/os/WindowContext.js`) tells any app whether its window is focused. Terminal and Snake gate their global listeners with it.
4. **Drag/resize (the perf-critical piece):** pointer events + `setPointerCapture`. During the gesture, write `left/top/width/height` directly to the DOM node inside `requestAnimationFrame` (coalesced via ref) — **no React state updates**. Dispatch a single `MOVE`/`RESIZE` on `pointerup`. Clamp to desktop bounds and `minSize`; 8 resize handles with direction descriptors `{h: -1|0|1, v: -1|0|1}`; west/north edges move x/y with the resize. Double-click title bar toggles MAXIMIZE. `document.body.style.userSelect='none'` during gestures; `touch-action: none` on title bars and handles (required for touch drag).
5. **Content split (do first):** new `src/data/profile.js` holds all portfolio content as plain data (`about`, `experience`, `skills`, `projects`, `socials`, `resumeUrl`). [content.js](src/components/content.js) becomes a thin adapter that regenerates the terminal's HTML strings from that data. GUI apps read `profile.js` directly — no dark-terminal HTML to restyle.
6. **Theme scoping:** terminal's `theme` command switches from `documentElement` to the terminal's own root element (`.terminal-container[data-theme='matrix']` selectors), so themes skin only the terminal window. Shell gets its own parallel `--xp-*` vars (`--xp-face #ece9d8`, `--xp-titlebar-active`, etc.).
7. **XP look in plain CSS:** bevels via stacked inset `box-shadow` (raised: `inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf`), title bar gradient `linear-gradient(180deg,#0058ee,#3f8cf3 8%,#0054e3 40%,#0050ee)` (grey desaturated when unfocused), font stack `Tahoma, 'Segoe UI', Verdana, -apple-system, Roboto, sans-serif` (Tahoma missing on iOS/Android). Wallpaper moves off `body` onto `.desktop` — replace the 4.1MB PNG with a CSS XP-Bliss-style gradient.

---

## New File Layout

```
src/
├─ data/profile.js                 (~80)  All portfolio content as plain data — single source of truth
├─ os/
│  ├─ windowManager.js             (~120) Pure reducer + initialState + topmost() helper. No React.
│  ├─ WindowManagerContext.js      (~90)  Provider, useReducer, memoized action creators
│  ├─ WindowContext.js             (~30)  Per-window {id} context + useWindowFocus()
│  ├─ useDragResize.js             (~180) Pointer drag/resize hook (rAF, clamp, capture)
│  ├─ useOSMode.js                 (~25)  matchMedia phone/desktop hook
│  ├─ Desktop.js                   (~80)  Wallpaper + icon grid + window layer + taskbar
│  ├─ DesktopIcon.js               (~50)  Select/open; one handler shared by dblclick/tap/Enter
│  ├─ Window.js                    (~160) XP chrome: title bar, min/max/close, 8 handles, role="dialog"
│  ├─ Taskbar.js                   (~110) Start button, task buttons (focus/minimize toggle), tray
│  ├─ StartMenu.js                 (~120) App list + GitHub/LinkedIn links + Shut Down easter egg
│  ├─ Clock.js                     (~30)
│  ├─ BootScreen.js                (~60)  XP splash ~2s, sessionStorage 'osBooted', reduced-motion aware
│  ├─ os.css                       (~450) Shell styling: bevels, gradients, taskbar, icons, --xp-* vars
│  ├─ phone/
│  │  ├─ PhoneShell.js / PhoneHome.js / PhoneApp.js / PhoneStatusBar.js / phone.css
│  └─ apps/
│     ├─ registry.js               (~50)  APPS map + DESKTOP_ICONS
│     ├─ chrome.js                 (~80)  Shared <Tabs>, <Toolbar>, <StatusBar>
│     ├─ app-chrome.css            (~150) .xp-app/.xp-btn/.xp-pane/.xp-tabs/.xp-statusbar, light scrollbars
│     ├─ TerminalApp.js, AboutApp.js, ProjectsApp.js, ResumeApp.js,
│     ├─ GamesApp.js, ContactApp.js, GuestbookApp.js
```

Modified: `App.js` (render provider + mode branch), `App.css` (remove vh/vw container sizing + body wallpaper; scope theme selectors), `Terminal.js`, `Snake.js`, `App.test.js`, `setupTests.js` (matchMedia mock), `public/index.html`, `public/manifest.json`.

---

## The Apps

| App | Title | Icon | Default size | What it is |
|---|---|---|---|---|
| `terminal` | Command Prompt | 🖥️ | 640×440 | Existing terminal, all commands intact, dark theme inside its window |
| `about` | About Me | 👤 | 560×520 | Tabbed "System Properties"-style: Bio \| Experience \| Skills |
| `projects` | My Projects | 📁 | 640×460 | Explorer master–detail: project list left, details right (chatroom.mp4 `preload="none" playsInline`, links) |
| `resume` | resume.pdf | 📄 | 700×800 | Toolbar (Download / Open in tab) + PDF iframe; HTML version from profile.js is primary on phone (mobile browsers refuse inline PDFs) |
| `games` | Games | 🎮 | 420×420 | Snake (reused as-is, fixed 24×14 board centered; listeners focus-scoped) |
| `contact` | Contact Andy | ✉️ | 480×460 | Outlook-Express-lite form over existing `sendEmail()`; social buttons; 16px inputs (iOS zoom) |
| `guestbook` | Guestbook | 📖 | 460×480 | GUI over existing localStorage functions; honest "saved in your browser only" note |

**Terminal adaptation specifics:** scope keydown listener (lines 367-379) with `useWindowFocus()`; `.terminal-container` → 100%/100%; remove in-component `.terminal-header` (redundant with window title bar — breaks old test, see Testing); session key `booted` → `terminalBooted` (shell owns `osBooted`); drop the leaf animation from the terminal; on phone, no autofocus — "tap to type" explicit focus + `autoCapitalize="off" autoCorrect="off" spellCheck={false}`; `openTargets` reads from `profile.js.socials`. Snake stays playable in-terminal too (same component, no fork).

**Optional (post-MVP, don't block launch):** Minesweeper in Games (the big nostalgia win but a real 1-1.5 day build), Dad-joke app reusing `joke.js` (1-2 hrs), phone task switcher. ASCII art stays a terminal-only easter egg.

---

## Phone-OS Mode

- **Detection:** `matchMedia('(max-width: 768px)')` in `useOSMode()`, live-updating. Width only — touch laptops get the desktop.
- **Shared state, different rendering:** phone ignores x/y/w/h and shows exactly one app fullscreen — the focused (highest-z, non-minimized) window — else the home grid. Resize/rotation across 768px flips modes with open apps intact.
- **Home = MINIMIZE** (preserves app state), **Close = CLOSE**, reopening a minimized singleton restores it. Bottom nav bar (XP-blue): Back · Home · Close. Status bar: fake signal/battery + live clock, `env(safe-area-inset-*)` padding.
- **Viewport correctness:** `height: 100vh; height: 100dvh` (mobile URL bar), `viewport-fit=cover` meta.

## Accessibility & Polish (MVP-level)
- Desktop icons: real buttons, tabbable, Enter/Space opens; windows `role="dialog"` + `aria-label`, Escape closes focused window; taskbar `role="toolbar"`; reduced-motion respected everywhere (boot, transitions).
- `public/index.html`: theme-color `#3a6ea5`, updated title/description/OG for the OS concept, styled noscript fallback. `manifest.json`: fixed (name, logo.png icon, XP-blue colors).
- Delete dead weight from `public/`: `leaf1-3.png`, `background.png` (replaced by CSS gradient), stray root `ANDY_HUANG_LING_RESUME_2024.pdf`. **Keep `CNAME`.**
- No `React.lazy`/code-splitting — bundle is tiny; the weight was assets, now handled.

---

## Implementation Sequence

**Phase 0 — Docs & branch (~15 min)**
Commit this plan into the repo as `DESKTOP_OS_PLAN.md`. Create a `desktop-os` feature branch (repo history is PR-based and push-to-main auto-deploys live — never build on main).

**Phase 1 — Foundation (~1 day)**
1. `src/data/profile.js` extraction + `content.js` adapter rewrite (terminal output unchanged).
2. `windowManager.js` reducer + `registry.js` + `WindowManagerContext.js` + `WindowContext.js`, with reducer unit tests as they're written.
3. `app-chrome.css` + shared `chrome.js` components.

**Phase 2 — Desktop shell (~2 days)**
4. Static `Window` chrome + `Desktop` rendering windows from state; click-to-focus, min/max/close buttons wired. Z-order visuals.
5. `useDragResize` — title-bar drag first, then 8 handles (the trickiest piece; budget a full day).
6. `Taskbar` + `Clock` + `StartMenu` (+ Shut Down easter egg) + `DesktopIcon` grid.
7. `BootScreen` + the bulk of `os.css` XP polish (this is where the retro credibility lives).

**Phase 3 — Apps (~3 days)**
8. Terminal integration (highest risk — do first): focus scoping, sizing, theme scoping, header removal.
9. About (tabs) → Projects (explorer) → Resume → Contact → Games/Snake → Guestbook.

**Phase 4 — Phone mode + polish (~1.5 days)**
10. `useOSMode` + mode branch + PhoneShell/Home/App/StatusBar + phone.css.
11. Per-app mobile tweaks (resume fallback, terminal tap-to-type, 16px inputs, playsInline video), `touch-action: none`, 100dvh/safe-area.
12. index.html/manifest/meta, asset cleanup, accessibility attrs.

**Phase 5 — Testing & launch (~0.5 day)**
13. Rewrite `App.test.js` (assert desktop shell: Start button + icons render, seeding `osBooted`); add `windowManager.test.js` reducer tests (OPEN/singleton, FOCUS z-order, MINIMIZE focus-fallthrough, MAXIMIZE prev-rect roundtrip, CLOSE); `useOSMode` + PhoneShell tests with a matchMedia mock in `setupTests.js`; focused TerminalApp test (input + welcome, no header assertion).
14. Manual QA, PR to main, watch Actions deploy, verify live on andyhuangling.com.

**Total estimate: ~8 focused days** for the MVP (desktop + 7 apps + phone mode + tests).

---

## Verification

- `npm test -- --watchAll=false` green locally (CI gate — old App.test.js is guaranteed to fail until rewritten).
- `npm run build` clean; `npm start` for live checking during development (browser preview): drag/resize/min/max/close windows, z-order on click, Start menu, taskbar toggle, boot-once-per-session, terminal commands + theme skins + in-terminal Snake, each app opens/works, Escape closes, tab-through icons.
- Resize browser below 768px → phone mode with same apps open; back up → desktop restores geometry.
- Manual QA on real devices before merge: iOS Safari (keyboard behavior in terminal, resume fallback, video playsInline, no zoom on form focus, safe areas), Android Chrome, desktop Chrome/Firefox.
- Merge PR → GitHub Actions deploys → confirm live site + custom domain intact (CNAME).

## Risks / gotchas
- StrictMode double-invokes reducers/effects in dev — keep reducer pure (no Date.now/random inside), pointer effects idempotent.
- Forgetting `touch-action: none` silently breaks touch drag mid-gesture.
- The 4.1MB wallpaper and 4.3MB video are the real perf story, not JS bundle size.
- EmailJS keys are already public in the repo (existing situation, not a regression) — client-side EmailJS keys are designed to be public; leave as-is.
