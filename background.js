(function() {

function isDomain(url, domain) {
   return url.startsWith('http://' + domain + '/')
       || url.startsWith('https://' + domain + '/')
       || url == 'http://' + domain
       || url == 'https://' + domain;
}

// send `message` to all tabs on domain config.domainTo
function sendMessageToAll(message) {
   chrome.tabs.query({
      url: '*://' + config.domainTo + '/*'
   }, function(tabs) {
      if (tabs && tabs.length) {
         tabs.forEach(function(tab) {
            chrome.tabs.sendMessage(tab.id, message);
         });
      }
   });
}

function createMessageFromTabs(method, tabs) {
   return {
      type: config.prefix + method,
      tabs: tabs.map(function(tab) {
         // filter out tab info they don't need to know
         return {
            id: tab.id,
            url: method != 'remove' ? tab.url : null
         };
      })
   };
}

function remove(tabId) {
   sendMessageToAll(createMessageFromTabs('remove', [{id: tabId}]));
}

function update(tabId, changeInfo, tab) {
   // if a url changed, send a message to remove its old information
   if (changeInfo.url) {
      remove(tabId);

      // if the new url is on domainAbout, send a message about it
      if (tab.url && isDomain(tab.url, config.domainAbout)) {
         sendMessageToAll(createMessageFromTabs('create', [tab]));
      }
   }

   // if a tab goes to the domainTo domain, send it all of the initial
   // information about tabs that are already open
   if (tab.url && isDomain(tab.url, config.domainTo)) {
      chrome.tabs.query({
         url: '*://' + config.domainAbout + '/*'
      }, function(tabs) {
         if (tabs && tabs.length) {
            chrome.tabs.sendMessage(tab.id,
             createMessageFromTabs('create', tabs));
         }
      });
   }
}

chrome.tabs.onCreated.addListener(function(tab) {
   // use the same handler as onUpdated, but adapt to its arugment list
   update(tab.tabId, {}, tab);
});
chrome.tabs.onUpdated.addListener(update);
chrome.tabs.onRemoved.addListener(remove);

})();
