document.addEventListener('DOMContentLoaded', () => {
    fetch('https://bakosmp.go.ro/api/validate', {
        credentials: 'include'
    })
    .then(res => {
    if (res.ok) {
        return res.json();
    } else {
        window.location.href = '/auth.html';
    }
    })
});