const form = document.getElementById('loginForm');
const statusP = document.getElementById('loginStatus');

// #loginStatus is an .alert element now - tone comes from a class, not an
// inline colour, so it follows the light/dark theme.
function setStatus(message, tone) {
    statusP.textContent = message || '';
    statusP.className = message ? 'alert alert-' + (tone || 'error') : 'alert';
    statusP.hidden = !message;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            if (data.isAdmin) window.location.href = '/status/dashboard.html'; else { 
                setStatus('You logged in as a regular user!', 'error');
                setTimeout(() => setStatus(''), 3000);
            }
        } else if (res.status === 401) {
            setStatus(data.error || 'Invalid username or password.', 'error');
            setTimeout(() => setStatus(''), 3000);
        } else if (res.status === 403) {
            setStatus(data.error || 'Access denied: Admins only.', 'warn');
        } else if (res.status === 400) {
            setStatus('Please fill in all fields.', 'warn');
        } else {
            setStatus('Something went wrong. Try again later.', 'error');
        }
    } catch (err) {
        setStatus('Network error. Check your connection.', 'error');
        console.error(err);
    }
});
