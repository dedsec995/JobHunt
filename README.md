# JobHunt

This project is a Chrome extension that allows users to track job applications and save them to a Google Spreadsheet. This README provides a step-by-step guide to set up the Google Cloud project and the folder structure for the extension.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Folder Structure](#folder-structure)
3. [Google Cloud Setup](#google-cloud-setup)
4. [Building the Extension](#building-the-extension)
5. [Loading the Extension in Chrome](#loading-the-extension-in-chrome)

## Prerequisites

- A Google account to access Google Cloud Console.
- New Google Spreadsheet.
- A Chrome Browser :)

## Folder Structure

The folder structure for the extension is as follows:

```
job-hunt/
├── manifest.json # Chrome extension manifest file
├── popup.html # HTML file for the popup
├── popup.js # JavaScript file for popup logic
├── background.js # Background script for handling requests
├── styles.css # CSS file for styling the popup
├── icons
    |----icon16.png # Icon for the extension
    |----icon48.png # Icon for the extension
    |----icon128.png # Icon for the extension
└── README.md # This README file
```

## Google Cloud Setup

Follow these steps to set up your Google Cloud project:

1. **Create a New Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Click on the project dropdown in the top menu and select "New Project".
   - Enter a project name (e.g., "Job Application Tracker") and click "Create".

2. **Enable the Google Sheets API**:
   - In the Google Cloud Console, navigate to `APIs & Services` > `Library`.
   - Search for "Google Sheets API" and click on it.
   - Click the "Enable" button.

3. **Create OAuth 2.0 Credentials**:
   - Navigate to `APIs & Services` > `Credentials`.
   - Click on "Create Credentials" and select "OAuth client ID".
   - If prompted, configure the consent screen:
     - Select "External" and click "Create".
     - Fill in the required fields (app name, user support email, etc.) and save.
   - After configuring the consent screen, continue creating the OAuth client ID:
     - Select "Chrome App" as the application type.
     - Enter your extension's ID (you can leave it blank for now).
     - Click "Create".
   - Copy the generated client ID and paste it into the `.env` file in the format:
     ```
     CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
     ```

4. **Set Authorized JavaScript Origins**:
   - In the OAuth 2.0 Client ID settings, add the following URI to the "Authorized JavaScript origins":
     ```
     chrome-extension://YOUR_EXTENSION_ID
     ```
   - Replace `YOUR_EXTENSION_ID` with the actual ID of your extension (you can find this after loading the extension in Chrome).

5. **Add Scopes**:
   - Make sure to include the necessary scopes in your `manifest.json`:
     ```json
     "scopes": [
       "https://www.googleapis.com/auth/spreadsheets"
     ]
     ```

## Building the Extension

Make sure to replace your CLIENT_ID in manifest.json

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click on "Load unpacked" and select your project directory (`job-hunt`).
4. Once load, copy your extension-id from chrome://extensions to google cloud console's client id.
5. Your extension should now be loaded and ready to use!

## License

This project is licensed under the MIT License. See the LICENSE file for details.