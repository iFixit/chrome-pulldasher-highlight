var constStyle = '{background-color:#A9DBFF}';

var styleEl = document.createElement('style');
document.head.appendChild(styleEl);
var styleSheet = styleEl.sheet;

var rules = [];
var tabs = {};

function createRule(tab, rule) {
   if(tabs[tab.id+'_'+tab.url]) {
      return;
   }

   rules.push(tab.id+'_'+tab.url);
   styleSheet.insertRule(rule, styleSheet.cssRules.length);
   tabs[tab.id+'_'+tab.url] = true;
}

function removeRule(tab, rule) {
   var index = rules.indexOf(tab.id+'_'+tab.url);
   if (index == -1) {
      return;
   }

   delete tabs[tab.id+'_'+tab.url];
   rules.splice(index, 1);
   styleSheet.deleteRule(index);
}

chrome.runtime.onMessage.addListener(function(request) {
   if (request && request.type && request.type.startsWith
    && request.type.startsWith('pulldasher-')) {

      var method = request.type == 'pulldasher-remove' ? removeRule : createRule;

      request.tabs.forEach(function(tab) {
         method(tab, '.pull[href="' + tab.url + '"]' + constStyle);
      });
   }
});
