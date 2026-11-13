/* /js/email-prompt.js — asks a signed-in account with no email address to add one.
 *
 * Password resets go out by email now, so an account without a confirmed
 * address has no way back in if its password is forgotten. This shows a
 * small dialog asking for one, once, and then leaves people alone:
 *
 *   - "Not now" hides it for 14 days (per browser).
 *   - It never shows while a confirmation link is waiting to be opened.
 *   - It never shows if the server has no email set up.
 *
 * /js/session.js loads this for signed-in visitors. A page that manages the
 * address itself (settings) opts out with <body data-no-email-prompt>.
 *
 * Uses the BakoSMP .modal / .field / .note styles from /main.css.
 */
(function () {
    var SNOOZE_KEY = 'emailPromptSnoozedUntil';
    var SNOOZE_DAYS = 14;

    function snoozedUntil() {
        try { return Number(localStorage.getItem(SNOOZE_KEY)) || 0; } catch (e) { return 0; }
    }
    function snooze() {
        try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 864e5)); } catch (e) { /* private mode */ }
    }

    if (document.body && document.body.hasAttribute('data-no-email-prompt')) { return; }
    if (snoozedUntil() > Date.now()) { return; }

    fetch('/api/account/settings', { credentials: 'include' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (me) {
            if (!me || me.emailVerified || me.pendingEmail || !me.emailEnabled) { return; }
            show(me);
        })
        .catch(function () { /* not worth bothering anyone over */ });

    function show(me) {
        var modal = document.createElement('div');
        modal.className = 'modal show';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'emailPromptTitle');

        modal.innerHTML =
            '<form class="modal-card" id="emailPromptForm">' +
                '<h2 id="emailPromptTitle">Add an email address</h2>' +
                '<p>Password resets now go out by email. Add an address so you can get back into your account if you ever forget your password. It is only used for account emails.</p>' +
                '<div class="field">' +
                    '<label for="emailPromptAddress">Email address</label>' +
                    '<input type="email" id="emailPromptAddress" autocomplete="email" required>' +
                '</div>' +
                (me.hasPassword
                    ? '<div class="field">' +
                          '<label for="emailPromptPassword">Your current password</label>' +
                          '<input type="password" id="emailPromptPassword" autocomplete="current-password" required>' +
                      '</div>'
                    : '') +
                '<p class="note" id="emailPromptNote" role="status"></p>' +
                '<div class="actions">' +
                    '<button class="btn btn-primary" type="submit">Send confirmation link</button>' +
                    '<button class="btn btn-quiet" type="button" id="emailPromptLater">Not now</button>' +
                '</div>' +
            '</form>';

        document.body.appendChild(modal);

        var form = modal.querySelector('form');
        var note = modal.querySelector('#emailPromptNote');
        var submit = form.querySelector('button[type="submit"]');
        var later = modal.querySelector('#emailPromptLater');

        function say(message, kind) {
            note.textContent = message;
            note.className = 'note' + (kind ? ' ' + kind : '');
        }
        function close() {
            modal.remove();
            document.removeEventListener('keydown', onKey);
        }
        function dismiss() { snooze(); close(); }
        function onKey(event) { if (event.key === 'Escape') { dismiss(); } }

        later.addEventListener('click', dismiss);
        document.addEventListener('keydown', onKey);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var password = modal.querySelector('#emailPromptPassword');

            say('Sending…', 'busy');
            submit.disabled = true;

            fetch('/api/account/email', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: modal.querySelector('#emailPromptAddress').value.trim(),
                    password: password ? password.value : null
                })
            })
            .then(function (response) {
                return response.json().catch(function () { return {}; }).then(function (data) {
                    if (response.ok) {
                        say((data.message || 'Check your inbox for a confirmation link.') +
                            ' You can change it any time in your settings.', 'ok');
                        submit.hidden = true;
                        later.textContent = 'Done';
                        later.removeEventListener('click', dismiss);
                        later.addEventListener('click', close);
                    } else {
                        say(data.error || 'Could not send the link.', 'bad');
                        submit.disabled = false;
                    }
                });
            })
            .catch(function () {
                say('Could not reach the server. Try again in a moment.', 'bad');
                submit.disabled = false;
            });
        });

        modal.querySelector('#emailPromptAddress').focus();
    }
})();
