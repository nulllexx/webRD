async function getProfile() {
  try {
    const response = await fetch('https://bakosmp.go.ro/api/profile', {
      method: 'POST',
      credentials: 'include', // This is CRUCIAL - includes cookies in the request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Username:', data.username);
    return data.username;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}
async function keyHandler() {
    const response = await fetch('https://bakosmp.go.ro/api/get-key', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const apiKey = data.apiKey;
    const keyOutput = document.getElementById('key-output');
    keyOutput.textContent = apiKey;
    const copyButton = document.getElementById('copy-api-key');
    copyButton.hidden = false;
    const hideKeyButton = document.getElementById('hide-key');
    hideKeyButton.hidden = false;
    copyButton.onclick = function() {
        navigator.clipboard.writeText(apiKey).then(() => {
            const copiedMessage = document.getElementById('copied');
            copiedMessage.hidden = false;
            setTimeout(() => {
                copiedMessage.hidden = true;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy API Key:', err);
        });
    };
    hideKeyButton.onclick = function() {
        keyOutput.textContent = '';
        copyButton.hidden = true;
        hideKeyButton.hidden = true;
    };
}
async function fetchUsage() {
    const fetchUsageButton = document.getElementById('fetch-usage');
    console.log('Setting up usage fetch button...');
    fetchUsageButton.onclick = async function() {
        try {
            console.log('Fetching usage information...');
            const usageResponse = await fetch('https://bakosmp.go.ro/api/api-usage', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!usageResponse.ok) {
                throw new Error(`HTTP error! status: ${usageResponse.status}`);
            }
            const usageData = await usageResponse.json();
            console.log('Usage data received:', usageData); // Debug log
            
            const usageInfoDiv = document.getElementById('usage-info');
            
            // Use the correct property names from your API response
            const usageInfo = {
                hourlyLimit: usageData.hourlyLimit,
                remainingRequests: usageData.remainingRequests,
                minutesUntilReset: usageData.minutesUntilReset,
                resetsIn: usageData.resetsIn
            };
            
            usageInfoDiv.className = 'rd-grid rd-grid--3';
            usageInfoDiv.innerHTML = [
                ['API key name', usageData.name],
                ['Hourly limit', usageInfo.hourlyLimit],
                ['Remaining requests', usageInfo.remainingRequests],
                ['Minutes until reset', usageInfo.minutesUntilReset],
                ['Resets in', usageInfo.resetsIn]
            ].map(([label, value]) => `
                <div class="stat">
                    <span class="stat-label">${label}</span>
                    <span class="stat-value">${value ?? '—'}</span>
                </div>`).join('');
        } catch (error) {
            console.error('Error fetching usage:', error);
            const usageInfoDiv = document.getElementById('usage-info');
            usageInfoDiv.className = '';
            usageInfoDiv.innerHTML =
                '<div class="alert alert-error">Failed to fetch usage information. Please try again later.</div>';
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const h3Element = document.getElementById('welcome-text');
    getProfile().then(username => {
        const profileSection = document.getElementById('profile-info');
        if (username) {
            h3Element.textContent = `Welcome, ${username}!`;
            profileSection.hidden = false;
        } else {
            h3Element.innerHTML = `<span class="rd-empty-state">Hey there! Looks like you are not logged in. Please <a href="/auth.html">log in</a> to access your profile.</span>`;
            profileSection.hidden = true;
        }
    });
    const generateApiKeyButton = document.getElementById('generate-api-key');
    generateApiKeyButton.addEventListener('click', function() {
        keyHandler().catch(error => {
            console.error('Error running API func', error);
            document.getElementById('key-output').textContent =
                'Could not fetch your API key. Please try again later.';
        });
    });
    fetchUsage().catch(error => {
        console.error('Error setting up usage fetcher:', error);
    });
});