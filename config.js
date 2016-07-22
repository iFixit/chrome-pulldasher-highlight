config = {
   // prefix for chrome.tabs events from this extension
   prefix: 'highlight-pulldasher-',

   // domain to listen for whenever tabs change
   domainAbout: 'github.com',

   // domain to send events from domainAbout to
   domainTo: 'pulldasher.cominor.com',

   // css style rule for a url that is open in another tab
   getStyleFromUrl: function(url) {
      // select all links pointing to that url and give them a background
      return 'a[href="' + url.replace(/(pull\/\d+)[\/#].*$/, '$1')
           + '"]{background-color:#FDF6E3}';
   }
};
