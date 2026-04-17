
document.addEventListener('DOMContentLoaded', () => {
    const topbar = document.getElementById('topbar');

    // Trigger the show class after a tiny delay
    setTimeout(() => {
        topbar.classList.add('show');
    }, 100); // 100ms delay for smooth effect
});