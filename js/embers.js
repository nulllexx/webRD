/* /js/embers.js — the drifting motes behind every BakoSMP page.
 *
 * Replaces the particles.js field the old pages pulled from a CDN. Warm embers
 * rising out of the dark suit a torch-lit page better than a mesh of linked
 * dots, and this is small enough that nothing external has to load.
 *
 * Expects <canvas id="embers" aria-hidden="true"></canvas> somewhere in the
 * page; does nothing at all if it is absent, or if the visitor has asked for
 * reduced motion.
 */
(function embers() {
    var canvas = document.getElementById('embers');
    if (!canvas) { return; }

    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (still.matches) { return; }

    var ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    var w, h, motes, running = true;

    function size() {
        // Cap the device pixel ratio at 2: past that the extra pixels cost
        // real work on phones and buy nothing on a field of soft dots.
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        w = window.innerWidth;
        h = window.innerHeight;

        var count = Math.min(46, Math.round(window.innerWidth / 26));
        motes = [];
        for (var i = 0; i < count; i++) { motes.push(spawn(Math.random() * h)); }
    }

    function spawn(y) {
        return {
            x: Math.random() * w,
            y: y,
            r: 0.6 + Math.random() * 1.7,
            rise: 0.16 + Math.random() * 0.5,
            drift: (Math.random() - 0.5) * 0.28,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.16 + Math.random() * 0.4
        };
    }

    function frame(t) {
        if (!running) { return; }
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < motes.length; i++) {
            var m = motes[i];
            m.y -= m.rise;
            m.x += m.drift + Math.sin((t / 1400) + m.phase) * 0.18;
            if (m.y < -12) { motes[i] = spawn(h + 12); continue; }

            // Fade out as they climb away from the torch.
            var fade = Math.min(1, m.y / (h * 0.75));
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(243, 156, 18, ' + (m.alpha * fade).toFixed(3) + ')';
            ctx.fill();
        }
        requestAnimationFrame(frame);
    }

    // Stop burning a frame budget on a tab nobody is looking at.
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            running = false;
        } else if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    });

    size();
    window.addEventListener('resize', size);
    requestAnimationFrame(frame);
})();
