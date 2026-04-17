# RainDrippy & BakoSMP Web Portal

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Welcome to the official source repository for the **RainDrippy** and **BakoSMP** web ecosystem. This repository contains the frontend implementation for a diverse range of services, including a Minecraft community portal, software development showcases, and security solutions.

## 🌐 Live Portals
- **BakoSMP:** [bakosmp.go.ro](https://bakosmp.go.ro/)
- **RainDrippy:** [bakosmp.go.ro/raindrippy](https://bakosmp.go.ro/raindrippy/)

---

## 🚀 Key Features

### 🎮 BakoSMP (Minecraft Community)
A dedicated platform for the BakoSMP Minecraft server, featuring:
- **Skin Management System:** Full integration with the server API for uploading, viewing, and deleting custom skins.
- **Authentication Portal:** Secure register/login system featuring hardware-based device fingerprinting for account protection.
- **Season Updates:** Centralized hub for news on upcoming world resets, modpacks, and server events.
- **Data Storage:** Publicly accessible storage for server-related assets and player content.

### RainDrippy (Software Solutions)
The official home for RainDrippy software projects:
- **ddosprot:** A cross-platform (Linux/Windows) DoS/DDoS protection tool utilizing `libpcap` for real-time traffic monitoring and firewall-based mitigation.
- **Project Showcase:** Information on upcoming titles like the *RainDrippy Launcher*.
- **Integrated Source Viewer:** Web-based syntax-highlighted code viewer for open-source solutions.

### 📊 System Status & Games
- **Status Dashboard:** Real-time monitoring of various RainDrippy services.
- **Game Hosting:** Home to web-based and downloadable games like *Mouse Maze*.

---

## 📂 Project Structure

```text
.
├── raindrippy/       # RainDrippy portal (About, Projects, Solutions)
├── status/           # System status dashboard
├── games/            # Hosted games and downloads
├── content/          # Releases and media assets
├── js/               # Core logic (cookies, fingerprinting, animations)
├── uploads.html      # Minecraft skin upload portal
├── auth.html.bak     # Authentication frontend
└── index.html        # BakoSMP landing page
```

---

## 🛠️ Technical Overview

This project is built as a highly performant static web application with dynamic API integrations.

- **Frontend:** Vanilla HTML5, CSS3 (with custom animations), and JavaScript.
- **Backgrounds:** Interactive particle systems powered by `particles.js`.
- **Security:** Hardware fingerprinting for authentication and `ddosprot` for infrastructure protection.
- **API Integration:** Seamlessly connects to `bakosmp.go.ro/api` for server-side logic (Skins, Auth, etc.).

### Local Development
To run the project locally for development or testing:
1. Clone the repository.
2. Serve the root directory using any local web server (e.g., `python -m http.server 8000`).
3. Open `http://localhost:8000` in your browser.

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing a bug, improving the UI, or adding new features:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📧 Contact

- **RainDrippy Contact:** [raindrippy.contact@protonmail.com](mailto:raindrippy.contact@protonmail.com)
- **BakoSMP Support:** [thisisformehello@gmail.com](mailto:thisisformehello@gmail.com)
- **Discord:** [Join our Community](https://discord.gg/8b3zCqf3)

---

## 📜 License

This project is licensed under the **GNU GPL v3**. See the [LICENSE](LICENSE) file for details.

---
*Maintained by BakoPlayz & RainDrippy Team.*
