function sendToPulldasher(data) {
	chrome.tabs.query({
		url: '*://pulldasher.cominor.com/*'
	}, function(tabs) {
		tabs.forEach(function(tab) {
			chrome.tabs.sendMessage(tab.id, data);
		});
	});
}

function getGithubUrl(tab) {
	if (!tab.url || !tab.url.startsWith('https://github.com/')) {
		return null;
	}

	tab.url = tab.url.replace(/(pull\/\d+)[\/#].*$/, '$1');
	return tab;
}

function sendUrls(method, tabs) {
	tabs = tabs.map(getGithubUrl).filter(function(tab) {
		return tab.url;
	});

	if (tabs.length > 0) {
		sendToPulldasher({
			type: 'pulldasher-' + method,
			tabs: tabs
		});
	}
}

var tabIdToUrl = {};

function update(tabId, changeInfo, tab) {
	if (changeInfo.url) {
		if (tabIdToUrl[tab.id]) {
			sendUrls('remove', [{id: tabId, url: tabIdToUrl[tab.id]}]);
		}
		tabIdToUrl[tab.id] = tab.url;
		sendUrls('create', [{id: tabId, url: tabIdToUrl[tab.id]}]);
	}

	if(tab.url) {
		var url = tab.url;
		if (url.startsWith('https://pulldasher.cominor.com')
		 || url.startsWith('http://pulldasher.cominor.com')) {
		 	setTimeout(function() {
		 		chrome.tabs.query({url: 'https://github.com/*'}, function(tabs) {
					sendUrls('create', tabs.map(function(tab) {
						tabIdToUrl[tab.id] = tab.url;
						return {id: tab.id, url: tab.url};
					}));
				});
		 	}, 0);
		}
	}
}

chrome.tabs.onUpdated.addListener(update);

chrome.tabs.onCreated.addListener(function(tab) {
	update(tab.tabId, {}, tab);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
	sendUrls('remove', [{id: tabId, url: tabIdToUrl[tabId]}]);
});
