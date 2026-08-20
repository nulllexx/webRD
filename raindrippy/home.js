/* /raindrippy/home.js - landing page only.
 *
 * Two independent widgets, both of which must degrade quietly: the page is
 * routinely opened without the API reachable (local preview, API outage), and
 * neither of these is important enough to shout about in the console.
 */

/* ---------------------------------------------------------- live status --- */

(function liveStatus() {
    const pill = document.getElementById('rd-status-pill');
    const label = document.getElementById('rd-status-text');
    if (!pill || !label) return;

    // Local preview hook: /raindrippy/index.html?mock=1 reads a fixture.
    const useMock = new URLSearchParams(location.search).has('mock');
    const url = useMock ? '/_mock/status.json' : '/api/status/status';

    const options = {};
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        options.signal = AbortSignal.timeout(4000);
    }

    fetch(url, options)
        .then(res => {
            if (!res.ok) throw new Error('status ' + res.status);
            return res.json();
        })
        .then(data => {
            const incidents = Array.isArray(data.incidents) ? data.incidents : [];

            if (incidents.length === 0) {
                pill.dataset.impact = 'minimal_outage';
                label.textContent = 'All systems operational';
                return;
            }

            // Worst impact wins, same rule the status page uses.
            const worst = incidents.reduce((acc, x) => {
                if (x.impact === 'full_outage') return 'full_outage';
                if (x.impact === 'partial_outage' && acc !== 'full_outage') return 'partial_outage';
                return acc;
            }, 'minimal_outage');

            pill.dataset.impact = worst;
            label.textContent = incidents.length === 1
                ? (incidents[0].title || 'Active incident')
                : incidents.length + ' active incidents';
        })
        .catch(err => {
            pill.dataset.impact = 'unknown';
            label.textContent = 'Status unavailable';
            console.debug('status pill unavailable:', err.message);
        });
})();

/* -------------------------------------------------------- ddosprot source -- */

(function sourceViewer() {
    const viewer = document.getElementById('codeViewer');
    const toggle = document.getElementById('toggleBtn');
    const block = document.getElementById('code-block');
    if (!viewer || !toggle || !block) return;

    // sol_content/ is served from the webserver only - it is gitignored, so
    // this 404s during local preview. Say so instead of showing an empty box.
    fetch('sol_content/viewer/ddosprot.txt')
        .then(res => {
            if (!res.ok) throw new Error('source ' + res.status);
            return res.text();
        })
        .then(code => {
            block.textContent = code;
            if (window.hljs) window.hljs.highlightElement(block);
        })
        .catch(err => {
            block.textContent = 'Source unavailable right now - download the zip instead.';
            console.debug('ddosprot source unavailable:', err.message);
        });

    toggle.addEventListener('click', () => {
        const minimized = viewer.classList.toggle('minimized');
        toggle.innerHTML = minimized ? '&#9660;' : '&#9650;';
        toggle.setAttribute('aria-label', minimized ? 'Maximize code block' : 'Minimize code block');
        toggle.setAttribute('aria-expanded', String(!minimized));
    });
})();
