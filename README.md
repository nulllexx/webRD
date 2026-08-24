# RainDrippy & BakoSMP Website

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Welcome to the official source repository for the **RainDrippy** and **BakoSMP** web ecosystem. This repository contains the frontend implementation for a diverse range of services, including a Minecraft community portal and more.

---

## Live Portals
- **BakoSMP:** [bakosmp.go.ro](https://bakosmp.go.ro/)
- **RainDrippy:** [bakosmp.go.ro/raindrippy](https://bakosmp.go.ro/raindrippy/)

---

## Features

A dedicated platform for the BakoSMP Minecraft server, featuring:
- **Skin Management System:** Full integration with the server API for uploading, viewing, and deleting custom skins.
- **Authentication Portal:** Secure register/login system featuring hardware-based device fingerprinting for account protection.
- **Season Updates:** Centralized hub for news on upcoming world resets, modpacks, and server events.
- **Data Storage:** Publicly accessible storage for server-related assets and player content.

### Status checker

- **Status Dashboard:** Real-time monitoring of various RainDrippy services.

---


## Technical Overview

This project is built as a highly performant static web application with dynamic API integrations.

- **Frontend:** Vanilla HTML5, CSS3 (with custom animations), and JavaScript.
- **Backgrounds:** A small canvas ember field (`js/embers.js`) on the BakoSMP pages — no external library.
- **Security:** Hardware fingerprinting for authentication and `ddosprot` for last line of defense infrastructure protection.
- **API Integration:** Connects to `bakosmp.go.ro/api` for server-side logic (Skins, Auth, etc.).

### BakoSMP design system

Every page under the site root (`index`, `uploads`, `downloads`, `history`, the
account pages, `settings`, `ai`, `redir`) shares one stylesheet: **`main.css`**.

- It is **dark only, on purpose** — that is the server's identity. There is no
  light mode and no theme toggle here, unlike the RainDrippy pages. Every colour
  is painted explicitly rather than inherited from the host, so the page holds up
  whatever the visitor's system theme is set to.
- The palette lives in CSS custom properties on `:root`: `--ground`/`--stone` for
  the cave-rock neutrals, `--flame`/`--ember` for the server's orange, and
  `--live`/`--bad`/`--warn` used **only** for meaning, never as a second accent.
- The same block also aliases RainDrippy's token names (`--bg-panel`, `--accent`,
  …) onto the flame palette. That is what dresses the shared `cookie.css` banner
  correctly on this half of the site; without it the banner falls back to
  RainDrippy's cyan.
- Type is Bricolage Grotesque (display), Public Sans (body) and JetBrains Mono
  (anything numeric or machine-written).
- Pages opt in by loading `main.css` and carrying the shared furniture:
  `<canvas id="embers">`, `<header class="bar">`, the cookie banner, and
  `<footer class="page">`.

Three small scripts back it up, and every page loads all three:

| File | Job |
| --- | --- |
| `js/embers.js` | The drifting motes. Skipped entirely under `prefers-reduced-motion`, and paused while the tab is hidden. |
| `js/session.js` | Asks `/api/logged-in` **once** and exposes the answer as `window.session` (a Promise), so pages that gate on a session reuse it instead of asking again. Also reveals either the "Signed in as…" chip or the "Log in" button in the topbar. |
| `js/toast.js` | `window.toast(message, ok)`. Builds its own node, so there is no markup to copy. Use it for "that worked"; anything worth re-reading belongs in a `.note` beside the form. |

`js/genFP.js` computes the device fingerprint the auth API expects. It sets the
`hwid` cookie on load **and** exports `window.deviceFingerprint()` for the pages
that send the value in a request body. Register, login and finish-signup each
used to carry their own byte-identical copy of that function.

### RainDrippy design system

Every RainDrippy-branded page (`raindrippy/`, `status/`, the API docs, and the
`401`/`403`/`404`/`50x` error pages) shares one stylesheet: **`raindrippy/index.css`**.

- It defines the palette as CSS custom properties (`--bg`, `--accent`, `--text`, …)
  in two blocks: a light `:root` default and a dark `html[data-theme="dark"]` override.
- **`js/theme.js`** loads synchronously in `<head>` on every page. It applies the saved
  theme before the first paint (no flash), and injects the sun/moon toggle into `#topbar`.
  It shares its `localStorage` keys with the admin dashboard, so the theme follows you
  across the whole site.
- Pages opt in with `<body class="rd-page">`. Every rule except the token blocks is
  wrapped in `:where(.rd-page)`, which keeps them out of `rdadmin.html` (that page loads
  this stylesheet and then overrides it with its own inline `<style>`) while adding zero
  specificity, so per-page sheets can still override without `!important`.
  **Never add `!important` to a token, and never write an unguarded element rule.**

### Local Development
To run the project locally for development or testing:
1. Clone the repository.
2. Serve the root directory using any local web server (e.g., `python -m http.server 8000`).
3. Open `http://localhost:8000` in your browser.

The API is not available locally, so the status page and the home page status pill fall
back to their "unavailable" states. To preview them populated, drop fixtures at
`_mock/status.json` and `_mock/incidentHistory.json` and append `?mock=1` to the URL
(`_mock/` is gitignored and never deployed).

---

## Contact

- **RainDrippy Contact:** [raindrippy.contact@protonmail.com](mailto:raindrippy.contact@protonmail.com)
- **Discord:** [Join our Community](https://discord.gg/DMx3m54waD)

---

## License

This project is licensed under the **GNU GPL v3**. See the [LICENSE](LICENSE) file for details.

---
*Maintained by BakoPlayz & RainDrippy Team.*
