/* /js/toast.js — the one transient message on BakoSMP pages.
 *
 * Exposes window.toast(message, ok). Builds its own node on first use, so a
 * page only has to load this file; there is no markup to remember to copy.
 *
 * Use it for something that happened and needs no follow-up ("Skin uploaded").
 * Anything the visitor may need to re-read — a validation error, a server
 * message with detail in it — belongs in a .note next to the form instead,
 * where it stays put.
 */
(function () {
    var box = null;
    var text = null;
    var timer = null;

    function build() {
        box = document.createElement('div');
        box.id = 'toast';
        box.setAttribute('role', 'status');
        box.setAttribute('aria-live', 'polite');

        box.innerHTML =
            '<svg class="tick" width="16" height="16" viewBox="0 0 24 24" fill="none"' +
            ' stroke="currentColor" stroke-width="2.6" stroke-linecap="round"' +
            ' stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>' +
            '<span></span>';

        text = box.querySelector('span');
        document.body.appendChild(box);
    }

    window.toast = function (message, ok) {
        if (!box) { build(); }

        text.textContent = message;
        box.classList.toggle('bad', ok === false);

        // A failure keeps the icon but turns it red, rather than dropping it and
        // letting the pill reflow mid-animation.
        box.classList.add('up');

        clearTimeout(timer);
        timer = setTimeout(function () { box.classList.remove('up'); }, 4200);
    };
})();
