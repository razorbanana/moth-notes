# moth-notes

sticky notes for desktop. notes live on your disk, not someone's server. that's the whole point.

## what it is

you open it, you get a note. you write stuff. you close it. notes are still there next time. no accounts, no sync, no internet. just a file on your machine.

bonus: you can dump everything to a JSON backup or export individual notes as markdown/text. useful when you want to move machines or just not lose things.

## how electron works (you'll need this)

electron bundles chromium + node.js into one app. two worlds running at the same time:

- **main process** — node.js. one per app. this is where you create windows, touch the filesystem, talk to the OS. think of it as the backend.
- **renderer process** — chromium. one per window. this is where HTML/CSS/JS runs. it's basically a browser tab. no direct filesystem access (on purpose).
- **preload script** — runs before the renderer loads, has access to both worlds. you use it to expose a safe, narrow API to the renderer via `contextBridge`. this is the bridge.
- **IPC** — how the two worlds talk. renderer says "save this note", main process does the actual file write, sends back "ok". never let the renderer touch the disk directly.

the security setup that matters: `contextIsolation: true`, `nodeIntegration: false`. always. non-negotiable. if you see code doing it differently, it's wrong.

## structure

```
src/main/       main process — window management, IPC handlers, file I/O
src/preload/    contextBridge — the only safe channel to renderer
src/renderer/   HTML + CSS + JS — the actual UI
assets/         icons (icon.ico for win, icon.icns for mac, icon.png for linux)
```

## data

notes go in `app.getPath('userData')`. electron resolves this per OS:

```
windows  →  %APPDATA%\moth-notes\
mac      →  ~/Library/Application Support/moth-notes/
linux    →  ~/.config/moth-notes/
```

never hardcode a path. always `app.getPath('userData')`. that's the rule.

## what to build

- [ ] create / edit / delete notes
- [ ] drag, resize, pick a color
- [ ] always-on-top toggle
- [ ] notes survive restart (persist to disk)
- [ ] backup: one JSON file with all notes
- [ ] export: single note → plain text or markdown
- [ ] system tray (app stays alive when you close windows)

## commits

format: `type(scope): description`

```
feat(notes): add color picker to note header
fix(storage): handle missing userData directory on first launch
chore(deps): bump electron to 35.1.0
refactor(ipc): extract note save handler into separate module
```

types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`

scope = the module/area being changed (`notes`, `storage`, `ipc`, `tray`, `renderer`, `build`, `deps`)

optional body: blank line after description, then free text for extra context.

enforced by commitlint + husky on every commit. scope is required.

## run and build

```bash
npm install
npm run dev          # opens app in dev mode
npm run build:win    # produces .exe installer → dist/
npm run build:mac    # .dmg
npm run build:linux  # .AppImage
```

electron-builder handles the packaging. it reads the `build` config in package.json and produces real installable files. that's how you go from source code to something a normal person can double-click.

## Agent skills

### Issue tracker

Issues live in GitHub Issues at `razorbanana/moth-notes`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` + `docs/adr/` at root. See `docs/agents/domain.md`.
