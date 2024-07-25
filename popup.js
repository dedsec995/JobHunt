document.addEventListener('DOMContentLoaded', function() {
  const authButton = document.getElementById('auth-button');
  const authContainer = document.getElementById('auth-container');
  const spreadsheetContainer = document.getElementById('spreadsheet-container');
  const formContainer = document.getElementById('form-container');
  const jobForm = document.getElementById('job-form');
  const spreadsheetIdInput = document.getElementById('spreadsheet-id');
  const saveSpreadsheetIdButton = document.getElementById('save-spreadsheet-id');
  const datetimeInput = document.getElementById('datetime');
  const urlInput = document.getElementById('url');
  const statusSelect = document.getElementById('status');

  authButton.addEventListener('click', authenticate);
  saveSpreadsheetIdButton.addEventListener('click', saveSpreadsheetId);
  jobForm.addEventListener('submit', saveJobApplication);

  // Check authentication status on popup open
  checkAuthAndShowForm();

  function checkAuthAndShowForm() {
    chrome.identity.getAuthToken({ interactive: false }, function(token) {
      if (token) {
        authContainer.style.display = 'none';
        chrome.storage.sync.get('spreadsheetId', function(data) {
          if (data.spreadsheetId) {
            showForm();
          } else {
            spreadsheetContainer.style.display = 'block';
          }
        });
      }
    });
  }

  function authenticate() {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        authContainer.style.display = 'none';
        chrome.storage.sync.get('spreadsheetId', function(data) {
          if (data.spreadsheetId) {
            showForm();
          } else {
            spreadsheetContainer.style.display = 'block';
          }
        });
      }
    });
  }

  function saveSpreadsheetId() {
    const spreadsheetId = spreadsheetIdInput.value.trim();
    if (spreadsheetId) {
      chrome.storage.sync.set({ spreadsheetId: spreadsheetId }, function() {
        spreadsheetContainer.style.display = 'none';
        showForm();
      });
    } else {
      alert('Please enter a valid Spreadsheet ID');
    }
  }

  function showForm() {
    formContainer.style.display = 'block';
    setDefaultDateTime();
    setDefaultUrl();
  }

  function setDefaultDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    datetimeInput.value = now.toISOString().slice(0, 16);
  }

  function setDefaultUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        const currentTabUrl = tabs[0].url;
        urlInput.value = currentTabUrl;
      }
    });
  }

  function saveJobApplication(event) {
    event.preventDefault();
    chrome.storage.sync.get('spreadsheetId', function(data) {
      const spreadsheetId = data.spreadsheetId;
      const company = document.getElementById('company').value;
      const title = document.getElementById('title').value;
      const url = document.getElementById('url').value;
      const datetime = document.getElementById('datetime').value;
      const description = document.getElementById('description').value;
      const status = statusSelect.value;

      chrome.runtime.sendMessage({
        action: 'saveJobApplication',
        data: { spreadsheetId, company, title, url, datetime, description, status }
      }, function(response) {
        if (response.success) {
          alert('Job application saved successfully!');
          jobForm.reset();
          setDefaultDateTime(); 
          setDefaultUrl();
          statusSelect.value = 'Applied'; 
        } else {
          alert('Error saving job application: ' + response.error);
        }
      });
    });
  }
});