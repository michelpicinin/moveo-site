/* MOVEO cookie consent — Google Consent Mode v2.
   The Google tag in each page <head> starts with all storage denied.
   This script shows a small banner, saves the visitor's choice and
   updates consent. A "Cookie settings" link is added to the footer
   so visitors can change their mind at any time. */
(function () {
  var KEY = 'moveo_consent_v1';
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var T = {
    de: {
      text: 'Wir verwenden Cookies von Google Analytics, um zu verstehen, wie unsere Website genutzt wird. Sie werden nur mit deiner Zustimmung gesetzt.',
      accept: 'Akzeptieren', reject: 'Ablehnen', settings: 'Cookie-Einstellungen'
    },
    fr: {
      text: 'Nous utilisons des cookies Google Analytics pour comprendre comment notre site est utilisé. Ils ne sont déposés qu’avec votre accord.',
      accept: 'Accepter', reject: 'Refuser', settings: 'Paramètres des cookies'
    },
    en: {
      text: 'We use Google Analytics cookies to understand how our website is used. They are only set with your consent.',
      accept: 'Accept', reject: 'Decline', settings: 'Cookie settings'
    }
  };
  var t = T[lang] || T.en;

  function gtagSafe() {
    if (typeof window.gtag === 'function') window.gtag.apply(null, arguments);
  }
  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function apply(choice) {
    var g = choice === 'granted' ? 'granted' : 'denied';
    gtagSafe('consent', 'update', {
      analytics_storage: g,
      ad_storage: g,
      ad_user_data: g,
      ad_personalization: g
    });
  }

  var banner;
  function hide() { if (banner) { banner.remove(); banner = null; } }
  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML =
      '<p></p><div class="consent-actions">' +
      '<button type="button" class="btn btn-outline" data-c="denied"></button>' +
      '<button type="button" class="btn btn-primary" data-c="granted"></button></div>';
    banner.querySelector('p').textContent = t.text;
    banner.querySelector('[data-c="denied"]').textContent = t.reject;
    banner.querySelector('[data-c="granted"]').textContent = t.accept;
    banner.addEventListener('click', function (e) {
      var c = e.target.getAttribute && e.target.getAttribute('data-c');
      if (!c) return;
      save(c); apply(c); hide();
    });
    document.body.appendChild(banner);
  }

  function addFooterLink() {
    var bottom = document.querySelector('.foot-bottom');
    if (!bottom) return;
    var a = document.createElement('a');
    a.href = '#';
    a.className = 'consent-link';
    a.textContent = t.settings;
    a.addEventListener('click', function (e) { e.preventDefault(); show(); });
    bottom.appendChild(a);
  }

  function init() {
    var stored = read();
    if (stored === 'granted' || stored === 'denied') apply(stored);
    else show();
    addFooterLink();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
