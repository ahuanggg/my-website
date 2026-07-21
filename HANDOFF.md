# AndyOS Redesign — Knowledge Transfer / Handoff

_Last updated: 2026-07-20. Work lives on `desktop-os`, with a follow-up branch `xp-apps-refresh` on top of it (graphical Snake, Minesweeper, Bliss wallpaper, Web3Forms contact form). Nothing is pushed or deployed yet._

## What this project was

andyhuangling.com used to be a single fake-terminal React component. We rebuilt it into **AndyOS**: a retro Windows XP-style desktop OS in the browser. Desktop icons open real windows (drag, resize from 8 edges, minimize, maximize, close, z-order), with a taskbar, Start menu, and boot splash. On screens under 768px it becomes a "phone OS" (icon grid home screen, apps fullscreen, back/home/close nav). The old terminal survives unchanged as the "Command Prompt" app.

The full design rationale is in `DESKTOP_OS_PLAN.md` (committed to the repo, produced by three Opus planning agents before implementation).

## Status: everything below is DONE and verified

- **25/25 jest tests pass** (5 suites), `npm run build` compiles clean (~80KB gzipped JS).
- Manually verified in a live browser: window drag (with bounds clamping), 8-direction resize, minimize/maximize/restore, multi-window z-order and click-to-front, Start menu + click-away close + Shut Down easter egg, terminal commands, theme scoping, Escape-to-close, phone↔desktop live mode switching with open windows surviving the flip, Resume app swapping PDF-iframe↔HTML by mode, Projects video `preload=none`/`playsInline`, boot-once-per-session flag. Zero console errors.
- **NOT done:** pushing the branch, opening the PR, merging (merge auto-deploys the live site), and Andy's manual QA on real devices (iOS Safari / Android Chrome). These were intentionally left for the owner.

## Architecture in 60 seconds

```
App (src/App.js)
└─ WindowManagerProvider          Context + useReducer, device-agnostic window state
   ├─ BootScreen                  once/session via sessionStorage 'osBooted'
   └─ useOSMode() === 'phone' ? PhoneShell : Desktop
       Desktop: icon grid + Window×N + Taskbar/StartMenu     (src/os/)
       PhoneShell: status bar + home grid / fullscreen app   (src/os/phone/)
```

Key decisions (all deliberate — don't casually undo):

1. **Pure reducer** in `src/os/windowManager.js` — no React, no `Date.now()`/random inside (StrictMode double-invokes reducers). Window = `{id, appId, title, icon, x, y, w, h, z, state: normal|minimized|maximized, prev}`. Z-order is a monotonic `zCounter`; FOCUS bumps the window to `++zCounter`. Spawn positions are computed **in the reducer** (cascade + clamp) so windows opened in phone mode have valid geometry when the user rotates into desktop mode.
2. **App registry** `src/os/apps/registry.js` is the single shell↔apps contract: `APPS = {appId: {title, icon, component, defaultSize, minSize, singleton}}` + `DESKTOP_ICONS`. The shell never hardcodes app knowledge. All apps are singletons.
3. **Drag/resize** (`src/os/useDragResize.js`): pointer events + `setPointerCapture`. During a gesture we write `left/top/width/height` directly to the DOM node inside rAF; React state gets **one** MOVE/RESIZE dispatch on pointerup. This is the perf-critical piece — do not convert it to per-move setState.
4. **Focus contract**: `useWindowFocus()` (`src/os/WindowContext.js`) tells an app whether its window is focused. Terminal's global keydown-grab and Snake's key/touch listeners are gated on it — this is what stops a background window from stealing keystrokes. It safely returns `true` outside a provider (standalone tests).
5. **Content single-sourced** in `src/data/profile.js` (plain data: about/experience/skills/projects/socials/resumeUrl; bullets use `**tech**` markers). `src/components/content.js` is now just an adapter that regenerates the terminal's accent-colored HTML from that data; GUI apps read profile.js directly. Edit content in profile.js only.
6. **Terminal themes are window-scoped**: the `theme` command sets `data-theme` on `.terminal-container` (not `<html>`), and App.css selectors are scoped to match. OS chrome uses its own `--xp-*` vars in `src/os/os.css`.
7. **Minimized windows stay mounted** (`display:none`) so app state (terminal history, game score) survives minimize.
8. **Phone mode** ignores x/y/w/h and renders the highest-z non-minimized window fullscreen (`topmost()` helper); Home = MINIMIZE (state survives), Close = CLOSE. Same reducer, different renderer.

## Problems we hit and how we fixed them

| Problem | Fix |
|---|---|
| Terminal had a global keydown listener that force-focused its input on ANY keypress (old `Terminal.js:367`) — would fight every other window | Gated the effect on `useWindowFocus()` and skipped it entirely on coarse pointers (touch keyboards would pop uninvited) |
| Snake uses Escape to quit, but the shell also closes the focused window on Escape → one press would do both | Snake now `preventDefault()`s Escape and registers its keydown in the **capture phase** so it consumes the key before the shell's bubble-phase handler checks `e.defaultPrevented`. Shell also ignores Escape when target is an input/textarea |
| `userEvent.dblClick` (v13 installed) didn't trigger React `onDoubleClick`; also `userEvent.setup()` doesn't exist in v13 | Tests use `fireEvent.dblClick`/`fireEvent.click` instead. If you upgrade to user-event v14, `setup()` becomes available |
| jsdom has no `matchMedia` or `ResizeObserver` | `matchMedia` mock added to `src/setupTests.js` (default: desktop, fine pointer); Desktop guards ResizeObserver and falls back to window resize |
| Old `App.test.js` asserted the terminal booted at root — guaranteed CI failure (CI runs tests before deploy) | Rewritten to assert the desktop shell; terminal boot has its own `src/components/Terminal.test.js`. The removed `.terminal-header` ("Andy's Terminal") no longer exists — the window title bar replaced it |
| Emulated browser viewports (the preview pane) resize without firing the `mql.change` event, and a reload mid-resize can give a stale initial `matchMedia` reading | `useOSMode` listens to BOTH `mql change` and window `resize`, and re-checks once on mount. Real browsers were fine; the fallback is cheap insurance |
| `setPointerCapture` can throw on synthetic/exotic pointer events | Wrapped in try/catch — capture is an optimization, drag still works without it |
| Graphical Snake's rAF loop uses a time accumulator; rAF stops firing while the browser tab is hidden, so on return `time - lastTime` was minutes and the accumulator drained hundreds of steps in one frame — instant death on tab-switch | Frame delta clamped to `MAX_FRAME_MS` (250ms) in `SnakeGame.js`. Any accumulator loop added later needs the same clamp |
| Contact form's `<input type='email'>` let the browser's native constraint validation block submit, so React's `onSubmit` never fired — the custom `EMAIL_RE` check and the XP-styled inline errors were unreachable, and visitors got a modern native bubble inside a fake XP window | `noValidate` on the `<form>`; our validation is the authority |
| Changing `sendEmail`'s signature broke a second, non-obvious caller — the terminal's `run sendemail.js <msg>` command | `Terminal.js` updated to the object signature and to read `result.message`. Remember the contact form is **not** the only consumer of `sendemail.js` |
| sessionStorage key collision: shell boot vs terminal boot both wanted `booted` | Split: shell owns `osBooted`, terminal renamed to `terminalBooted` |
| Browser-pane screenshots timed out the whole session (environment quirk, not an app bug) | Verified everything via DOM inspection / JS execution instead. **Nobody has visually eyeballed the XP styling yet** — that's the first thing Andy should do with `npm start` |

## Things a newcomer should know before touching this

- **CRA (react-scripts 5), React 18, StrictMode ON, plain CSS, zero added dependencies** — the hand-rolled window manager is a deliberate portfolio flex. Don't add react-rnd/etc.
- **Pushing to `main` deploys the live site** (GitHub Actions → GitHub Pages, custom domain via `public/CNAME` — never delete that file). CI runs `npm test -- --watchAll=false` first; a red test blocks deploy. Repo convention is PR-based merges.
- `touch-action: none` on `.win-titlebar` and `.win-resize` in os.css is **required** — removing it silently breaks touch dragging mid-gesture.
- Deleted as part of this work: `background.png` (4.1MB), `leaf1-3.png` + `leaf.js` (leaf animation retired), root `ANDY_HUANG_LING_RESUME_2024.pdf`, `src/logo.svg`. `public/resume.pdf` is the served resume; `chatroom.mp4` stays (Projects demo).
- **The wallpaper is drawn, not photographed.** `src/os/Wallpaper.js` is a hand-built SVG homage to XP's "Bliss" (Charles O'Rear's photo, licensed to Microsoft) — sky gradient, blurred-ellipse clouds, one bezier hill. Deliberately not the real image: it's copyrighted, and the repo has stayed binary-free since `background.png` was deleted. A 1600x900 viewBox with `xMidYMid slice` makes it behave like `background-size: cover`. Both `Desktop.js` and `PhoneShell.js` render it.
- The phone shell is a **flex container**, and flex items with a non-`auto` z-index get a real stacking context even at `position: static`. That's why `.phone-statusbar/-home/-app-title/-app-body/-navbar` carry explicit `z-index: 1` — without it the wallpaper paints over the entire UI.
- `sendemail.js` posts to **Web3Forms** with plain `fetch` (no SDK, no backend — the site is static). `WEB3FORMS_ACCESS_KEY` is public by design, same rationale the old EmailJS keys had; rotate it at web3forms.com if it ever attracts spam. `sendEmail` always resolves with `{ok, message, error}` — never throws — so callers branch on `.ok`. Guestbook is localStorage per-browser (UI says so honestly).
- Known cosmetic nit: window borders (3px) can overhang the desktop edge by ~6px when dragged fully right/down — clamping uses the content box. Harmless, XP-ish, fix in `useDragResize` bounds math if it bothers anyone.
- CRA prints a babel-preset deprecation warning on every build — pre-existing, ignorable, or silence it by adding `@babel/plugin-proposal-private-property-in-object` to devDependencies.

## Launch checklist (what's left)

1. `npm start`, look at it with human eyes (XP styling was verified structurally, not visually).
2. QA on a real phone: terminal tap-to-type, Snake swipe, resume HTML fallback, form focus without zoom, safe-area padding.
3. `git push -u origin desktop-os` → open PR → merge → watch the Actions run → confirm andyhuangling.com (+ that the domain still resolves).
4. Send yourself one message through Contact Andy to confirm Web3Forms delivery end-to-end (nobody has actually posted to the live endpoint yet).
5. Post-MVP parked ideas: dad-joke app (`joke.js` is ready, ~1-2 hrs), phone task switcher, more games in the launcher.

## File map (new code)

```
src/data/profile.js            all portfolio content (edit here!)
src/os/windowManager.js        reducer + topmost() + spawnRect()   [tested]
src/os/WindowManagerContext.js provider, openApp(), boundsRef
src/os/WindowContext.js        useWindowFocus()
src/os/useDragResize.js        pointer drag/resize hook
src/os/useOSMode.js            phone/desktop matchMedia hook
src/os/Desktop.js|DesktopIcon.js|Window.js|Taskbar.js|StartMenu.js|Clock.js|BootScreen.js
src/os/Wallpaper.js            SVG "Bliss" homage, shared by desktop + phone shells
src/os/os.css                  XP chrome (bevels, gradients, --xp-* vars)
src/os/apps/registry.js        the app contract
src/os/apps/chrome.js          shared <Tabs>/<Toolbar>/<StatusBar> + **bold** renderer
src/os/apps/app-chrome.css     shared XP app styling
src/os/apps/*App.js            Terminal, About, Projects, Resume, Games, Contact, Guestbook
src/os/apps/games/             SnakeGame (canvas), Minesweeper + minesweeperLogic (pure)  [tested]
                               GamesApp is just a launcher; components/Snake.js is the
                               SEPARATE ASCII snake the terminal still runs
src/os/phone/                  PhoneShell/Home/App/StatusBar + phone.css  [tested]
```
