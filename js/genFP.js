document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    canvas.toDataURL()
    ].join('|');
    canvas.style.display = 'none';  
    // Hash it for consistency
    let hwid = btoa(fingerprint).substring(0, 32)
    document.cookie = "hwid=" + hwid + "; path=/; max-age=" + (60*60*24*365);
});