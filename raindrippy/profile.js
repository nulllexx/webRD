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
    copyButton.style.display = 'inline-block';
    const hideKeyButton = document.getElementById('hide-key');
    hideKeyButton.style.display = 'inline-block';
    copyButton.onclick = function() {
        navigator.clipboard.writeText(apiKey).then(() => {
            const copiedMessage = document.getElementById('copied');
            copiedMessage.style.display = 'inline';
            setTimeout(() => {
                copiedMessage.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy API Key:', err);
        });
    };
    hideKeyButton.onclick = function() {
        keyOutput.textContent = '';
        copyButton.style.display = 'none';
        hideKeyButton.style.display = 'none';
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
            
            usageInfoDiv.innerHTML = "";
            usageInfoDiv.innerHTML = `
                <p><strong>API Key Name:</strong> ${usageData.name}</p>
                <p><strong>Hourly Limit:</strong> ${usageInfo.hourlyLimit}</p>
                <p><strong>Remaining Requests:</strong> ${usageInfo.remainingRequests}</p>
                <p><strong>Minutes Until Reset:</strong> ${usageInfo.minutesUntilReset}</p>
                <p><strong>Resets In:</strong> ${usageInfo.resetsIn}</p>
            `;
        } catch (error) {
            console.error('Error fetching usage:', error);
            alert('Failed to fetch usage information. Please try again later.');
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const h3Element = document.getElementById('welcome-text');
    getProfile().then(username => {
        const profileSection = document.getElementById('profile-info');
        if (username) {
            h3Element.textContent = `Welcome, ${username}!`;
            profileSection.style.display = 'block';
        } else {
            h3Element.innerHTML = `Hey there! Looks like you are not logged in. Please <a href="/auth.html">log in</a> to access your profile.`;
            profileSection.style.display = 'none';
        }
    });
    const generateApiKeyButton = document.getElementById('generate-api-key');
    generateApiKeyButton.addEventListener('click', function() {
        keyHandler().catch(error => {
            console.error('Error running API func', error);
            alert('Please try again later.');
        });
    });
    fetchUsage().catch(error => {
        console.error('Error setting up usage fetcher:', error);
    });
});