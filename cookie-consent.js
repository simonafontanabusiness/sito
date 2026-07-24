/* Banner cookie — simonafontana.com
   Blocca Google Analytics finché l'utente non acconsente.
   Il consenso è salvato in un cookie di prima parte per 6 mesi. */

(function () {
  var GA_ID = 'G-MPSYE677Q3';
  var COOKIE = 'sf_cookie_consent';
  var DAYS = 180;

  function readConsent() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function writeConsent(value) {
    var d = new Date();
    d.setTime(d.getTime() + DAYS * 24 * 60 * 60 * 1000);
    document.cookie = COOKIE + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function loadAnalytics() {
    if (window.__sfAnalyticsLoaded) return;
    window.__sfAnalyticsLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function injectStyles() {
    if (document.getElementById('sf-cookie-style')) return;
    var css = document.createElement('style');
    css.id = 'sf-cookie-style';
    css.textContent = [
      '.sf-cookie{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;',
      'max-width:640px;margin:0 auto;background:#FFFFFF;color:#1B2436;',
      'border:1px solid rgba(196,93,62,.22);border-radius:14px;',
      'box-shadow:0 16px 50px rgba(27,36,54,.16);padding:1.25rem 1.35rem;',
      "font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;",
      'display:flex;flex-direction:column;gap:1rem;',
      'opacity:0;transform:translateY(14px);transition:opacity .4s ease,transform .4s ease}',
      '.sf-cookie.sf-visible{opacity:1;transform:translateY(0)}',
      '.sf-cookie p{margin:0;font-size:.82rem;line-height:1.65;color:#5C6370}',
      '.sf-cookie a{color:#C45D3E;font-weight:600}',
      '.sf-cookie-actions{display:flex;gap:.6rem;flex-wrap:wrap}',
      '.sf-cookie button{font-family:inherit;font-size:.82rem;font-weight:600;',
      'padding:.65rem 1.3rem;border-radius:9px;cursor:pointer;transition:all .2s ease}',
      '.sf-accept{background:#C45D3E;color:#fff;border:1px solid #C45D3E}',
      '.sf-accept:hover{background:#A84E33;border-color:#A84E33}',
      '.sf-reject{background:transparent;color:#1B2436;border:1px solid rgba(27,36,54,.18)}',
      '.sf-reject:hover{border-color:#1B2436}',
      '@media(min-width:560px){.sf-cookie{flex-direction:row;align-items:center;',
      'justify-content:space-between;gap:1.5rem}.sf-cookie-actions{flex-shrink:0}}'
    ].join('');
    document.head.appendChild(css);
  }

  function showBanner() {
    injectStyles();

    var box = document.createElement('div');
    box.className = 'sf-cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Preferenze sui cookie');

    var text = document.createElement('p');
    text.innerHTML = 'Questo sito usa cookie tecnici necessari al funzionamento e, solo con il tuo consenso, ' +
      'cookie analitici per capire come viene utilizzato. Puoi cambiare idea in qualsiasi momento. ' +
      '<a href="/privacy.html">Informativa privacy</a>';

    var actions = document.createElement('div');
    actions.className = 'sf-cookie-actions';

    var reject = document.createElement('button');
    reject.className = 'sf-reject';
    reject.type = 'button';
    reject.textContent = 'Rifiuta';

    var accept = document.createElement('button');
    accept.className = 'sf-accept';
    accept.type = 'button';
    accept.textContent = 'Accetta';

    function close() {
      box.classList.remove('sf-visible');
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 400);
    }

    reject.addEventListener('click', function () { writeConsent('rejected'); close(); });
    accept.addEventListener('click', function () { writeConsent('accepted'); loadAnalytics(); close(); });

    actions.appendChild(reject);
    actions.appendChild(accept);
    box.appendChild(text);
    box.appendChild(actions);
    document.body.appendChild(box);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { box.classList.add('sf-visible'); });
    });
  }

  /* Permette di riaprire il banner da un link:
     <a href="#" onclick="sfCookiePreferences(); return false;">Preferenze cookie</a> */
  window.sfCookiePreferences = function () {
    if (!document.querySelector('.sf-cookie')) showBanner();
  };

  function init() {
    var consent = readConsent();
    if (consent === 'accepted') { loadAnalytics(); return; }
    if (consent === 'rejected') return;
    showBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
