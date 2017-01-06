# chrome-pulldasher-highlight

a Chrome extension that highlights Pulldasher pull requests that are open in another Chrome tab

## Development Installation

1. Clone this repository
2. Open "Extensions" in Chrome settings
3. Tick "Enable Developer Mode"
4. Click "Load Unpacked Extension"
5. Select the directory you cloned this repository into

This will allow you to make changes to the source code. You can also pack the extension from Developer Mode.

## About

This extension consists of three scripts. `config.js` is the only script specific to Pulldasher. Otherwise, the extension can be used to add css rules to pages on one domain based on urls visited on one other domain.

* `background.js` watches the browser tabs for url changes. It sends any urls on domainAbout to the content script loaded on domainTo.
* `content.js` runs on the pages on domainTo. It listens for messages from the background script, and adds css rules specified in the config script.
* `config.js` defines which domains to use, and what css rules to use.

