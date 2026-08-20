/* /js/theme.js - shared light/dark theme for the RainDrippy pages.
 *
 * Load it SYNCHRONOUSLY in <head>, before the stylesheet links:
 *     <script src="/js/theme.js"></script>
 * It must not be deferred: the FOUC guard has to set data-theme before the
 * first paint, otherwise a dark-mode visitor gets a white flash on every load.
 *
 * The localStorage keys are deliberately the same ones rdadmin.html uses, so
 * the theme follows you between the public site and the admin dashboard.
 */
(function () {
    var KEY = 'rd-admin-theme';            // rdadmin reads this one first
    var KEY_LEGACY = 'rd-dashboard-theme'; // ...then falls back to this one
    var root = document.documentElement;

    var ICONS =
        '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="4.5"></circle>' +
        '<path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"></path>' +
        '</svg>' +
        '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"></path>' +
        '</svg>';

    function read() {
        try { return localStorage.getItem(KEY) || localStorage.getItem(KEY_LEGACY); }
        catch (err) { return null; }
    }

    function write(theme) {
        try {
            localStorage.setItem(KEY, theme);
            localStorage.setItem(KEY_LEGACY, theme);
        } catch (err) { /* private mode - the theme just won't persist */ }
    }

    function current() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function apply(theme) {
        var dark = theme === 'dark';

        // Mirror rdadmin exactly: REMOVE the attribute for light, never set "light".
        if (dark) { root.setAttribute('data-theme', 'dark'); }
        else { root.removeAttribute('data-theme'); }

        var meta = document.getElementById('metaThemeColor');
        if (meta) { meta.setAttribute('content', dark ? '#0e1116' : '#f4f6f9'); }

        var btn = document.getElementById('themeToggle');
        if (btn) {
            var label = dark ? 'Switch to light mode' : 'Switch to dark mode';
            btn.title = label;
            btn.setAttribute('aria-label', label);
            btn.setAttribute('aria-pressed', String(dark));
        }
    }

    /* ---- 1. FOUC guard. Runs before <body> exists, before the first paint. -- */

    root.classList.add('js');
    apply(read() === 'dark' ? 'dark' : 'light');

    window.RDTheme = { apply: apply, current: current };

    /* ---- 2. Toggle wiring. Needs the DOM. ---------------------------------- */

    document.addEventListener('DOMContentLoaded', function () {
        var host = document.getElementById('topbar');
        if (!host) { return; }

        var btn = document.getElementById('themeToggle');
        if (!btn) {
            // Injected rather than pasted into 14 files. It lands while the
            // topbar is still fading in, so the insertion is invisible.
            btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'themeToggle';
            btn.innerHTML = ICONS;
            host.appendChild(btn);
        }

        apply(current()); // re-run so the fresh button picks up its label

        btn.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark';
            apply(next);
            write(next);
        });

        // Keep other tabs (including rdadmin) in sync.
        window.addEventListener('storage', function (e) {
            if (e.key === KEY || e.key === KEY_LEGACY) {
                apply(read() === 'dark' ? 'dark' : 'light');
            }
        });
    });
})();
