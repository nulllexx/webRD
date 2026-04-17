# GEMINI.md - RainDrippy & BakoSMP Mandates

This document serves as the foundational mandate for Gemini CLI within the RainDrippy and BakoSMP web portal repository. These instructions take absolute precedence over general defaults.

## 🎯 Core Objectives
- Maintain a high-performance, visually appealing, and secure web portal.
- Ensure seamless integration between the static frontend and the BakoSMP/RainDrippy APIs.
- Preserve the established aesthetic (Vanilla CSS, custom animations, `particles.js`).

## 🛠️ Technical Standards
- **Language:** Stick to Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Styling:** 
    - Use Vanilla CSS for all styling. 
    - Avoid external CSS frameworks (Tailwind, Bootstrap) unless explicitly requested.
    - Maintain consistent spacing, typography, and interactive feedback.
- **JavaScript:** 
    - Prefer clean, modular Vanilla JS.
    - Respect existing logic for hardware fingerprinting (`js/genFP.js`) and cookie management (`js/cookies.js`).
- **Performance:** Keep assets lightweight. Use optimized images and minimize external dependencies.

## 🛡️ Security & Integrity
- **API Keys & Secrets:** NEVER hardcode API keys, tokens, or sensitive credentials in frontend files.
- **Fingerprinting:** Do not modify the core logic of `genFP.js` without a deep understanding of its impact on the authentication system.
- **Privacy:** Adhere to the policies outlined in `raindrippy/privacy-policy.html`.

## 🧪 Development Workflow
- **Validation:** Always verify changes by checking for HTML/CSS validity and ensuring no JS errors are introduced.
- **Testing:** Since this is a static project, manual verification of UI responsiveness and interactive elements is crucial.
- **API Mocking:** When working on features requiring API interaction, verify against the live endpoint `bakosmp.go.ro/api` or mock the expected responses if the API is unavailable.

## 📜 Repository Hygiene
- **License:** All new files must be compatible with the **GNU GPL v3** license.
- **Structure:** Follow the established directory structure:
    - `/raindrippy`: RainDrippy portal logic and assets.
    - `/status`: System status dashboard.
    - `/js`: Core shared JavaScript logic.
    - `/css`: Shared CSS assets.

## 🚀 Proactive Improvements
- If you notice inconsistent styling or redundant JS, propose a refactoring plan before implementation.
- Always aim for "alive" and polished UI components.
