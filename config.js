config = {
   // prefix for chrome.tabs events from this extension
   prefix: 'highlight-pulldasher-',

   // domain to listen for whenever tabs change
   domainAbout: 'github.com',

   // domain to send events from domainAbout to
   domainTo: 'pulldasher.cominor.com',

   // css style rule for a url that is open in another tab
   getStylesFromUrl: function(url) {
      // truncate anything after /pull/*/ since any url is the same pull
      url = url.replace(/(pull\/\d+)[\/#].*$/, '$1');

      // select all links pointing to that url and give them a background
      return [
         '.css-day_theme a[href="' + url + '"]{background-color:#FDF6E3}',
         '.css-night_theme a[href="' + url + '"]{background-color:#1C2937}'
      ];
   },

   // called to initialize the page on the content script, in case anything is
   // needed for getStylesFromUrl to work properly.
   initialize: function() {
      var lastClass = null;

      // put a class on body every time the theme changes
      var setThemeClass = function() {
         if (lastClass) {
            document.body.classList.remove(lastClass);
         }

         var themeClass = null;

         // get it from the element clicked, or from a <link> element
         if (this.getAttribute && this.getAttribute('data-css')) {
            themeClass = 'css-' + this.getAttribute('data-css');
         } else {
            themeClass = document.querySelector('link.active-theme')
                                 .getAttribute('href')
                                 .replace(/^.*\/([^\/]+)\.css$/, 'css-$1');
         }

         lastClass = themeClass;
         document.body.classList.add(themeClass);
      };

      document.querySelectorAll('[data-css]').forEach(function(element) {
         element.addEventListener('click', setThemeClass);
      })

      // set initial theme
      setThemeClass();
   }
};
