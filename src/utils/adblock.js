const AD_SELECTORS = [
  'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]',
  'iframe[src*="adservice"]',
  'div[class*="ad-"]',
  'div[class*="ad_"]',
  'div[id*="ad-"]',
  'div[id*="ad_"]',
  'div[class*="ads-"]',
  'div[class*="ads_"]',
  'div[class*="advert"]',
  'div[id*="advert"]',
  'div[class*="banner-ad"]',
  'div[id*="banner-ad"]',
  'ins.adsbygoogle',
  'div[id*="google_ads"]',
  'div[data-ad]',
  'div[data-ad-slot]',
  'aside[class*="ad"]',
  'section[class*="ad"]',
  'div[class*="sponsored"]',
  'div[id*="sponsored"]',
  'a[href*="doubleclick.net"]',
  'amp-ad',
  'amp-embed',
  'amp-sticky-ad',
].join(',');

export const AD_BLOCK_SCRIPT = `
(function() {
  'use strict';

  var style = document.createElement('style');
  style.textContent = '${AD_SELECTORS.replace(/'/g, "\\'")} { display:none!important; height:0!important; min-height:0!important; max-height:0!important; overflow:hidden!important; visibility:hidden!important; pointer-events:none!important; }';
  (document.head || document.documentElement).appendChild(style);

  function removeAds() {
    var ads = document.querySelectorAll('${AD_SELECTORS.replace(/'/g, "\\'")}');
    for (var i = 0; i < ads.length; i++) {
      ads[i].remove();
    }
  }

  removeAds();

  var observer = new MutationObserver(function() {
    removeAds();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
true;
`;

export const FULLSCREEN_DETECT_SCRIPT = `
(function() {
  'use strict';

  function notifyFullscreen(isFS) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'fullscreen',
      value: isFS
    }));
  }

  document.addEventListener('fullscreenchange', function() {
    notifyFullscreen(!!document.fullscreenElement);
  });
  document.addEventListener('webkitfullscreenchange', function() {
    notifyFullscreen(!!document.webkitFullscreenElement);
  });

  // Intercept video requestFullscreen to catch programmatic calls
  var origRFS = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen;
  if (origRFS) {
    Element.prototype.requestFullscreen = function() {
      notifyFullscreen(true);
      return origRFS.apply(this, arguments);
    };
    if (Element.prototype.webkitRequestFullscreen) {
      Element.prototype.webkitRequestFullscreen = function() {
        notifyFullscreen(true);
        return origRFS.apply(this, arguments);
      };
    }
  }
})();
true;
`;
