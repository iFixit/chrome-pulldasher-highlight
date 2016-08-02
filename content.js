(function() {

config.initialize();

// create a <style> tag that we can add rules to. this is useful because the
// these styles will always apply, even if the page manipulates its dom.
var styleElement = document.createElement('style');
document.head.appendChild(styleElement);
var styleSheet = styleElement.sheet;

// keep track of which tabs map to which urls
var tabIdToUrl = {};
// mirror of cssRules that we can do indexOf on
var rules = [];

function createRule(tab) {
   // don't add duplicate rules
   if (tabIdToUrl[tab.id] == tab.url) {
      return;
   }

   var styles = config.getStylesFromUrl(tab.url);

   tabIdToUrl[tab.id] = tab.url;

   styles.forEach(function(style) {
      styleSheet.insertRule(style, styleSheet.cssRules.length);
      rules.push(style);
   });
}

function removeRule(tab) {
   if (!tabIdToUrl[tab.id]) {
      return;
   }

   // get its old url and use it to find the style rule
   var url = tabIdToUrl[tab.id];
   var styles = config.getStylesFromUrl(url);
   var index = rules.indexOf(styles[0]);

   if (index == -1) {
      return;
   }

   delete tabIdToUrl[tab.id];

   styles.forEach(function() {
      styleSheet.deleteRule(index);
      rules.splice(index, 1);
   });

   // if multiple tabs create the same style rule, this only removes one of
   // them, so that all tabs have to be closed before the style is gone.
}

chrome.runtime.onMessage.addListener(function(request) {
   switch (request.type) {
   case config.prefix + 'create':
      request.tabs.forEach(createRule);
      break;
   case config.prefix + 'remove':
      request.tabs.forEach(removeRule);
      break;
   }
});

})();
