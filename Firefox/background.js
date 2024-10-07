chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'saveJobApplication') {
        saveToSpreadsheet(request.data, sendResponse);
        return true; // Keep the message channel open for async response
    }
});

function saveToSpreadsheet(data, sendResponse) {
    const {
        authToken,
        spreadsheetId,
        company,
        title,
        url,
        datetime,
        description,
        status
    } = data;

    if (!authToken) {
        sendResponse({success: false, error: 'Authentication token is missing'});
        return;
    }

    const range = 'Sheet1!A1:G1';
    const values = [[
            company,
            title,
            url,
            datetime,
            description,
            status
        ]];

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({values})
    }).then(response => response.json()).then(result => sendResponse({success: true})).catch(error => sendResponse({success: false, error: error.message}));
}

