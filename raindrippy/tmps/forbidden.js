function generateDeviceFingerprint() {
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
    return btoa(fingerprint).substring(0, 32);
}
function logout() {
    fetch('https://bakosmp.go.ro/api/purge-logout', {
          method: 'POST',
          credentials: 'include'
    }).then(async response => {
        if (response.status === 200) window.location.href = "/auth.html";
    });
}
async function loadBanInfo() {
    try {
    const hwid = generateDeviceFingerprint();        
    const res = await fetch("https://bakosmp.go.ro/api/account-status?hwid=" + encodeURIComponent(hwid), {
        method: "GET",
        credentials: "include"
    });

    if (res.status === 200) {
        // user not banned
        window.location.href = "profile.html";
        return;
    }
    if (res.status === 401) {
        // not logged in
        window.location.href = "login.html";
        return;
    }

    const data = await res.json();

    let headerText, banText;
    switch (data.banInfo.type) {
        case "1d":
        headerText = "Banned for 1 Day";
        banText = "Your account has been disabled for 1 day.";
        break;
        case "3d":
        headerText = "Banned for 3 Days";
        banText = "Your account has been disabled for 3 days.";
        break;
        case "7d":
        headerText = "Banned for 7 Days";
        banText = "Your account has been disabled for 7 days.";
        break;
        case "14d":
        headerText = "Banned for 14 Days";
        banText = "Your account has been disabled for 14 days.";
        break;
        case "perm":
        headerText = "Account Terminated";
        banText = "Your account has been terminated.";
        break;
        case "poison":
        headerText = "Account Terminated";
        banText = "Your account has been terminated, and new account creation has been disabled from this device.";
        break;
        default:
        headerText = "Account Moderated";
        banText = "Your account has been moderated.";
    }
    const container = document.getElementById("ban-container");
    container.innerHTML = `
    <div class="ban-card">
        <div class="ban-header"><strong>${headerText}</strong></div>
        <p class="ban-info" style="color: white;">We've determined that your prior actions have been against our rules & have taken action against your account.</p>
        <p class="ban-info" style="color: white;"><strong>Reviewed:</strong> ${data.banInfo.moderatedTimePDT} (PDT)</p>
        <p class="ban-info" style="color: white;"><strong>Moderator Note:</strong> ${data.banInfo.modNote}</p>
        ${data.banInfo.incriminatory && data.banInfo.incriminatory.length > 0 ? `
        <div class="offending" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <strong style="font-size: large; margin-left: 5%;">Offending Content:</strong><br>
            ${data.banInfo.incriminatory.map(inc => {
            const content = inc.offending?.content || inc.content || '[No content]';
            return `${inc.reason || 'Unknown reason'} →     "${content}"`;
            }).join("<br>")}
        </div>
        ` : ""}
        <p class="warning" style="color: white;">${banText}</p>
        <div id="button-container" style="text-align: center;">
            <button onclick="logout()">Logout</button>
        </div>
    </div>
    `;
    } catch (err) {
    console.error("Failed to load ban info", err);
    document.getElementById("ban-container").innerHTML = "<p>Error loading moderation details.</p>";
    }
}

loadBanInfo();
