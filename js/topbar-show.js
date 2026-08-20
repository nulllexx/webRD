document.addEventListener('DOMContentLoaded', () => {
    const topbar = document.getElementById('topbar');
    if (!topbar) return; // pages without a topbar shouldn't throw

    // Double rAF: guarantees the browser has painted the initial (hidden) state
    // before we flip the class, so the transition actually runs. More reliable
    // than a setTimeout, which can fire before the first paint on a slow load.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => topbar.classList.add('show'));
    });
});
