/* /js/session.js — who is looking at the page.
 *
 * Asks /api/logged-in once and shares the answer two ways:
 *
 *   window.session   a Promise for { loggedIn, username }, so a page that
 *                    needs the answer (settings, getData) can await it instead
 *                    of firing a second identical request.
 *
 *   the topbar       reveals either the "Signed in as …" chip or the "Log in"
 *                    button, whichever is true. Both start hidden, so a
 *                    signed-out visitor never sees the wrong one flash.
 *
 * Markup it looks for, all optional:
 *   <a class="who" id="who" href="/settings.html" hidden>…<strong id="who-name"></strong></a>
 *   <a class="btn btn-quiet btn-sm" id="signin" href="/login.html" hidden>Log in</a>
 */
window.session = (function () {
    return fetch('/api/logged-in', { method: 'GET', credentials: 'include' })
        .then(function (response) {
            if (!response.ok) { return { loggedIn: false }; }
            return response.json();
        })
        .then(function (data) {
            return {
                loggedIn: data.loggedIn === true,
                // The endpoint does not promise a name. Take one if it is
                // there, and say plain "Signed in" if it is not.
                username: data.username || data.user || null
            };
        })
        .catch(function () {
            // No answer is not the same as "signed out", but the topbar has to
            // show something. A login link is the harmless guess: the worst
            // case is a signed-in visitor being offered a page they can skip.
            return { loggedIn: false, unknown: true };
        });
})();

document.addEventListener('DOMContentLoaded', function () {
    var chip = document.getElementById('who');
    var signin = document.getElementById('signin');
    if (!chip && !signin) { return; }

    window.session.then(function (me) {
        if (me.loggedIn && chip) {
            var name = chip.querySelector('#who-name');
            if (me.username && name) {
                name.textContent = me.username;
            } else if (name) {
                // Drop the "Signed in as " lead-in along with the empty name.
                chip.textContent = '';
                chip.appendChild(Object.assign(document.createElement('span'), { className: 'head' }));
                chip.appendChild(document.createTextNode('Signed in'));
            }
            chip.hidden = false;
        } else if (signin) {
            signin.hidden = false;
        }
    });
});
