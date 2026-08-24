(function () {
    var cached = null;

    window.deviceFingerprint = function () {
        if (cached) { return cached; }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device fingerprint', 2, 2);

        var parts = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            canvas.toDataURL()
        ].join('|');

        cached = btoa(parts).substring(0, 32);
        return cached;
    };

    document.addEventListener('DOMContentLoaded', function () {
        document.cookie = 'hwid=' + window.deviceFingerprint() +
            '; path=/; max-age=' + (60 * 60 * 24 * 365) + '; SameSite=Lax';
    });
})();
