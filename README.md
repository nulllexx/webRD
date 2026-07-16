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
- **Backgrounds:** Interactive particle systems relying on `particles.js`.
- **Security:** Hardware fingerprinting for authentication and `ddosprot` for last line of defense infrastructure protection.
- **API Integration:** Connects to `bakosmp.go.ro/api` for server-side logic (Skins, Auth, etc.).

### Local Development
To run the project locally for development or testing:
1. Clone the repository.
2. Serve the root directory using any local web server (e.g., `python -m http.server 8000`).
3. Open `http://localhost:8000` in your browser.

---

## Contact

- **RainDrippy Contact:** [raindrippy.contact@protonmail.com](mailto:raindrippy.contact@protonmail.com)
- **Discord:** [Join our Community](https://discord.gg/DMx3m54waD)

---

## License

This project is licensed under the **GNU GPL v3**. See the [LICENSE](LICENSE) file for details.

---
*Maintained by BakoPlayz & RainDrippy Team.*
