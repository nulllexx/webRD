/* RainDrippy profile: the API key tab and the account settings tab.
 *
 * Everything starts from GET /api/account/settings, which says who is signed
 * in (401 if nobody) and what the settings tab shows. The tab is picked from
 * the address (#settings), so other pages and emails can link straight to it.
 */

const API = '/api';
let account = null;

/* ---------------------------------------------------------------- helpers -- */

async function api(path, options) {
    const response = await fetch(API + path, Object.assign({
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    }, options || {}));
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
}

// .alert elements take their tone from a class, so they follow the theme.
function setStatus(el, message, tone) {
    el.textContent = message || '';
    el.className = 'alert rd-status' + (message ? ' alert-' + (tone || 'info') : '');
    el.hidden = !message;
}

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------------------- tabs -- */

const TABS = ['api', 'settings'];

function selectTab(name, focus) {
    if (!TABS.includes(name)) { name = 'api'; }
    for (const tab of TABS) {
        const button = $('tab-' + tab);
        const selected = tab === name;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        $('panel-' + tab).hidden = !selected;
        if (selected && focus) { button.focus(); }
    }
}

function tabFromHash() {
    return window.location.hash === '#settings' ? 'settings' : 'api';
}

function setUpTabs() {
    for (const tab of TABS) {
        $('tab-' + tab).addEventListener('click', () => {
            // replaceState: switching tabs should not fill the back button.
            history.replaceState(null, '', tab === 'api' ? window.location.pathname : '#' + tab);
            selectTab(tab);
        });
    }
    // Arrow keys move between tabs, as a tablist is expected to.
    document.querySelector('.rd-tabs').addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') { return; }
        const current = TABS.findIndex((t) => $('tab-' + t).getAttribute('aria-selected') === 'true');
        const next = TABS[(current + (event.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
        $('tab-' + next).click();
        $('tab-' + next).focus();
    });
    window.addEventListener('hashchange', () => selectTab(tabFromHash()));
    selectTab(tabFromHash());
}

/* ---------------------------------------------------------------- API key -- */

async function keyHandler() {
    const { ok, status, data } = await api('/get-key', { method: 'GET' });
    if (!ok) { throw new Error('HTTP ' + status); }

    const apiKey = data.apiKey;
    const keyOutput = $('key-output');
    const copyButton = $('copy-api-key');
    const hideKeyButton = $('hide-key');

    keyOutput.textContent = apiKey;
    copyButton.hidden = false;
    hideKeyButton.hidden = false;

    copyButton.onclick = () => {
        navigator.clipboard.writeText(apiKey).then(() => {
            $('copied').hidden = false;
            setTimeout(() => { $('copied').hidden = true; }, 2000);
        }).catch((err) => console.error('Failed to copy API key:', err));
    };
    hideKeyButton.onclick = () => {
        keyOutput.textContent = '';
        copyButton.hidden = true;
        hideKeyButton.hidden = true;
    };
}

async function showUsage() {
    const usageInfoDiv = $('usage-info');
    try {
        const { ok, status, data } = await api('/api-usage', { method: 'GET' });
        if (!ok) { throw new Error('HTTP ' + status); }

        usageInfoDiv.className = 'rd-grid rd-grid--3';
        usageInfoDiv.replaceChildren(...[
            ['API key name', data.name],
            ['Hourly limit', data.hourlyLimit],
            ['Remaining requests', data.remainingRequests],
            ['Minutes until reset', data.minutesUntilReset],
            ['Resets in', data.resetsIn]
        ].map(([label, value]) => {
            // Built with textContent: the key's name contains the username.
            const stat = document.createElement('div');
            stat.className = 'stat';
            const l = document.createElement('span');
            l.className = 'stat-label';
            l.textContent = label;
            const v = document.createElement('span');
            v.className = 'stat-value';
            v.textContent = value ?? '—';
            stat.append(l, v);
            return stat;
        }));
    } catch (error) {
        console.error('Error fetching usage:', error);
        usageInfoDiv.className = '';
        usageInfoDiv.innerHTML =
            '<div class="alert alert-error">Failed to fetch usage information. Please try again later.</div>';
    }
}

/* --------------------------------------------------------------- settings -- */

function renderAccount() {
    $('set-username').textContent = account.username;
    $('set-created').textContent = account.createdAt
        ? new Date(account.createdAt.replace(' ', 'T') + 'Z').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : '—';
    $('set-has-password').textContent = account.hasPassword ? 'Set' : 'None (signs in with Google)';
    $('set-google').textContent = account.googleLinked ? 'Linked' : 'Not linked';

    // Email
    const email = $('set-email');
    email.textContent = account.email || 'None yet';
    if (account.email) {
        const badge = document.createElement('span');
        badge.className = 'badge ' + (account.emailVerified ? 'badge-ok' : 'badge-warn');
        badge.textContent = account.emailVerified ? 'Confirmed' : 'Not confirmed';
        email.appendChild(badge);
    }

    const pending = account.pendingEmail;
    $('set-pending-label').hidden = !pending;
    $('set-pending').hidden = !pending;
    $('set-pending').textContent = pending ? pending + ' — open the link we sent to confirm it' : '';

    $('email-input-label').textContent = account.emailVerified ? 'New email address' : 'Email address';
    $('email-remove').hidden = !account.email;
    $('email-password-group').hidden = !account.hasPassword;
    $('email-password').required = account.hasPassword;

    const sendButton = $('email-form').querySelector('button[type="submit"]');
    sendButton.disabled = !account.emailEnabled;
    if (!account.emailEnabled) {
        setStatus($('email-status'), 'Email is not set up on this server yet, so addresses cannot be confirmed.', 'warn');
    }

    // Google
    $('google-lede').textContent = account.googleLinked
        ? (account.hasPassword
            ? 'Your Google account is linked: you can sign in with it or with your password.'
            : 'You sign in with Google. To unlink it, set a password first, so you still have a way in.')
        : 'Link your Google account to sign in with it instead of your password.';
    $('google-link').hidden = account.googleLinked;
    $('google-unlink').hidden = !account.googleLinked;
    $('google-unlink').disabled = !account.hasPassword;
    $('google-password-group').hidden = !account.hasPassword;

    // Password
    $('password-none').hidden = account.hasPassword;
    $('password-form').hidden = !account.hasPassword;

    // The nudge at the top of the page.
    $('email-banner').hidden = account.emailVerified || !account.emailEnabled || !!pending;
}

async function loadAccount() {
    const { ok, status, data } = await api('/account/settings', { method: 'GET' });
    if (!ok) {
        if (status !== 401) { console.error('Could not load account settings:', status, data); }
        return false;
    }
    account = data;
    renderAccount();
    return true;
}

function setUpSettings() {
    $('email-banner-link').addEventListener('click', (event) => {
        event.preventDefault();
        history.replaceState(null, '', '#settings');
        selectTab('settings');
        $('email-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        $('email-input').focus({ preventScroll: true });
    });

    $('email-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = $('email-status');
        const button = event.target.querySelector('button[type="submit"]');

        setStatus(status, 'Sending…', 'info');
        button.disabled = true;
        try {
            const { ok, data } = await api('/account/email', {
                method: 'POST',
                body: JSON.stringify({
                    email: $('email-input').value.trim(),
                    password: $('email-password').value || null
                })
            });
            if (ok) {
                event.target.reset();
                await loadAccount();
                setStatus(status, data.message || 'Check your inbox for a confirmation link.', 'success');
            } else {
                setStatus(status, data.error || 'Could not send the link.', 'error');
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        } finally {
            button.disabled = !(account && account.emailEnabled);
        }
    });

    $('email-remove').addEventListener('click', async () => {
        const status = $('email-status');
        const password = $('email-password').value;
        if (account.hasPassword && !password) {
            setStatus(status, 'Enter your current password above to remove the address.', 'warn');
            $('email-password').focus();
            return;
        }
        if (!window.confirm('Remove your email address? You will not be able to reset your password by email.')) {
            return;
        }
        setStatus(status, 'Removing…', 'info');
        try {
            const { ok, data } = await api('/account/email', {
                method: 'DELETE',
                body: JSON.stringify({ password: password || null })
            });
            if (ok) {
                $('email-form').reset();
                await loadAccount();
                setStatus(status, data.message || 'Email address removed.', 'success');
            } else {
                setStatus(status, data.error || 'Could not remove the address.', 'error');
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        }
    });

    $('password-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = $('password-status');
        const button = event.target.querySelector('button[type="submit"]');
        const next = $('pw-new').value;

        if (next !== $('pw-confirm').value) {
            setStatus(status, 'The new passwords do not match.', 'error');
            return;
        }
        if (next.length < 8) {
            setStatus(status, 'Use at least 8 characters.', 'error');
            return;
        }

        setStatus(status, 'Changing…', 'info');
        button.disabled = true;
        try {
            const { ok, data } = await api('/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword: $('pw-current').value, newPassword: next })
            });
            if (ok) {
                event.target.reset();
                setStatus(status, data.message || 'Password changed.', 'success');
            } else {
                setStatus(status, data.error || 'Could not change the password.', 'error');
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        } finally {
            button.disabled = false;
        }
    });

    // Google-only accounts set a first password through the emailed reset link.
    $('password-set').addEventListener('click', async () => {
        const status = $('password-status');
        if (!account.emailVerified) {
            setStatus(status, 'Add and confirm an email address first, so there is somewhere to send the link.', 'warn');
            return;
        }
        setStatus(status, 'Sending…', 'info');
        try {
            const { ok, data } = await api('/password/forgot', {
                method: 'POST',
                body: JSON.stringify({ identifier: account.username })
            });
            setStatus(status, ok
                ? 'A link is on its way to ' + account.email + '. It expires in 30 minutes.'
                : (data.error || 'Could not send the link.'), ok ? 'success' : 'error');
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        }
    });

    $('data-download').addEventListener('click', async () => {
        const status = $('data-status');
        try {
            const { ok, data } = await api('/account-data', { method: 'GET' });
            if (!ok) {
                setStatus(status, data.error || 'Could not fetch your data.', 'error');
                return;
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'raindrippy-account-data.json';
            link.click();
            URL.revokeObjectURL(url);
            setStatus(status, 'Downloaded.', 'success');
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        }
    });

    $('google-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = $('google-status');
        const password = $('google-password').value;
        if (account.hasPassword && !password) {
            setStatus(status, 'Enter your current password to link Google.', 'warn');
            $('google-password').focus();
            return;
        }
        setStatus(status, 'Taking you to Google\u2026', 'info');
        try {
            const { ok, data } = await api('/auth/oauth/google/link', {
                method: 'POST',
                body: JSON.stringify({ password: password || null, returnTo: 'rd' })
            });
            if (ok && data.url) {
                window.location.href = data.url;
            } else {
                setStatus(status, data.error || 'Could not start linking.', 'error');
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        }
    });

    $('google-unlink').addEventListener('click', async () => {
        const status = $('google-status');
        const password = $('google-password').value;
        if (!password) {
            setStatus(status, 'Enter your current password to unlink Google.', 'warn');
            $('google-password').focus();
            return;
        }
        try {
            const { ok, data } = await api('/account/google', {
                method: 'DELETE',
                body: JSON.stringify({ password })
            });
            if (ok) {
                $('google-form').reset();
                await loadAccount();
                setStatus(status, data.message || 'Google account unlinked.', 'success');
            } else {
                setStatus(status, data.error || 'Could not unlink Google.', 'error');
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
        }
    });

    $('sign-out').addEventListener('click', async () => {
        await api('/purge-logout', { method: 'POST' }).catch(() => {});
        window.location.reload();
    });

    $('sign-out-everywhere').addEventListener('click', async () => {
        if (!window.confirm('Sign out on every device, including this one?')) { return; }
        const { ok, data } = await api('/account/sessions/revoke', { method: 'POST' })
            .catch(() => ({ ok: false, data: {} }));
        if (ok) {
            window.location.reload();
        } else {
            setStatus($('sessions-status'), data.error || 'Could not sign out everywhere. Try again.', 'error');
        }
    });

    $('delete-confirm').addEventListener('input', (event) => {
        $('delete-button').disabled = event.target.value.trim().toUpperCase() !== 'DELETE';
    });

    $('delete-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = $('delete-status');
        if ($('delete-confirm').value.trim().toUpperCase() !== 'DELETE') { return; }

        $('delete-button').disabled = true;
        setStatus(status, 'Deleting your account…', 'info');
        try {
            const { ok, data } = await api('/delete-account', { method: 'DELETE' });
            if (ok) {
                await api('/purge-logout', { method: 'POST' }).catch(() => {});
                setStatus(status, 'Account deleted. Taking you home…', 'success');
                setTimeout(() => { window.location.href = '/raindrippy/index'; }, 2200);
            } else {
                setStatus(status, data.error || 'Could not delete the account.', 'error');
                $('delete-button').disabled = false;
            }
        } catch (err) {
            setStatus(status, 'Could not reach the server. Try again in a moment.', 'error');
            $('delete-button').disabled = false;
        }
    });
}

/* Coming back from Google after linking: ?google=<outcome>. */
const LINK_OUTCOMES = {
    linked: ['Google account linked. You can now sign in with Google.', 'success'],
    taken: ['That Google account is already linked to a different account.', 'error'],
    already: ['This account already has a Google account linked.', 'warn'],
    cancelled: ['Linking was cancelled.', 'warn'],
    session: ['You were signed out before linking finished. Sign in and try again.', 'warn'],
    error: ['Linking failed. Try again in a moment.', 'error']
};

function showLinkOutcome() {
    const params = new URLSearchParams(window.location.search);
    const outcome = LINK_OUTCOMES[params.get('google')];
    if (!outcome) { return; }
    setStatus($('google-link-status'), outcome[0], outcome[1]);
    // Once shown, keep a reload from showing it again.
    history.replaceState(null, '', window.location.pathname + window.location.hash);
}

/* ------------------------------------------------------------------- init -- */

document.addEventListener('DOMContentLoaded', async () => {
    const heading = $('welcome-text');

    setUpTabs();
    setUpSettings();

    $('generate-api-key').addEventListener('click', () => {
        keyHandler().catch((error) => {
            console.error('Error fetching API key:', error);
            $('key-output').textContent = 'Could not fetch your API key. Please try again later.';
        });
    });
    $('fetch-usage').addEventListener('click', showUsage);

    let signedIn = false;
    try {
        signedIn = await loadAccount();
    } catch (err) {
        console.error('Error loading profile:', err);
    }

    if (signedIn) {
        heading.textContent = `Welcome, ${account.username}!`;
        $('profile-info').hidden = false;
        showLinkOutcome();
    } else {
        heading.innerHTML = '<span class="rd-empty-state">Hey there! Looks like you are not logged in. Please <a href="/login.html">log in</a> to access your profile.</span>';
        $('profile-info').hidden = true;
    }
});
