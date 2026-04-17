const form = document.getElementById('loginForm');
const statusP = document.getElementById('loginStatus');

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
                statusP.style.color = 'red';
                statusP.textContent = 'You logged in as a regular user!';
                setTimeout(() => { statusP.textContent = ''; }, 3000);
            }
        } else if (res.status === 401) {
            statusP.style.color = 'red';
            statusP.textContent = data.error || 'Invalid username or password.';
            setTimeout(() => { statusP.textContent = ''; }, 3000);
        } else if (res.status === 403) {
            statusP.style.color = 'orange';
            statusP.textContent = data.error || 'Access denied: Admins only.';
        } else if (res.status === 400) {
            statusP.style.color = 'orange';
            statusP.textContent = 'Please fill in all fields.';
        } else {
            statusP.style.color = 'red';
            statusP.textContent = 'Something went wrong. Try again later.';
        }
    } catch (err) {
        statusP.style.color = 'red';
        statusP.textContent = 'Network error. Check your connection.';
        console.error(err);
    }
});
