chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'saveJobApplication') {
    saveToSpreadsheet(request.data, sendResponse);
    return true; // Indicates that the response is asynchronous
  }
});

function saveToSpreadsheet(data, sendResponse) {
  chrome.identity.getAuthToken({ interactive: false }, function(token) {
    if (chrome.runtime.lastError) {
      sendResponse({ success: false, error: 'Authentication failed' });
      return;
    }

    const { spreadsheetId, position, title, url, datetime, description, status } = data;
    const range = 'Sheet1!A1:G1';
    const values = [[position, title, url, datetime, description, status]];

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    })
    .then(response => response.json())
    .then(result => {
      sendResponse({ success: true });
    })
    .catch(error => {
      sendResponse({ success: false, error: error.message });
    });
  });
}