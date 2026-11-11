/* The Vindicators — small, dependency-free helpers */
(function () {
  'use strict';
/* Translation protection: wrap proper names in dynamic text */
var FT_NAMES = ["Lunga vita ai The Vindicators", "Never Rest On One's Laurels", "Money (That's What I Want)", "Can't Take My Eyes Off You", "Il Venerdì di Repubblica", "Peanuts Vendor / Tequila", "Castello degli Ezzelini", "All Around The World", "All Around the World", "Il Mucchio Selvaggio", "Crespano del Grappa", "Francesco Cerisola", "Bassano del Grappa", "Fabiana Giovanetti", "The Scary Melodies", "You Fascinated Me", "Devils In Heaven", "Taverna al Ponte", "Piazza Terraglio", "Devils in Heaven", "Roots Revolution", "Art Music Studio", "Frigidaire Tango", "Barbara Tomasino", "Piazza Matteotti", "J.M. Le Baptiste", "Fernando Viktor", "Don't Kill Time", "Stefano Panzeri", "The Vindicators", "Go Down Records", "That's All Rock", "Sonny Boy Train", "The Fleshtones", "Down Down Down", "Blues Brothers", "Tequila Rapida", "Via G. Mazzini", "Sonny Boy Cock", "Scary Melodies", "Aurelio Pagini", "Rock'n'Recall", "Bill Milhizer", "The Fuzztones", "Paolo Bertoni", "Aldo Chimenti", "Greatest Hits", "Mark Charles", "In Your Eyes", "Teatro Astra", "Mildrey Ruiz", "Teatro Tenda", "I Wonder Why", "Keith Streng", "Shindy Club", "Vindicators", "Mark Brenda", "Terzo Ponte", "Google Maps", "Paul Milanì", "Arezzo Wave", "Charli Out Cazale", "Rockerilla", "Fleshtones", "setlist.fm", "Jean Gin Morello", "Pordenone", "Fuzztones", "Speak Out", "Stewie DC", "Indie-eye", "New York", "Milhizer", "Metallus", "YouTube", "Spotify", "Bassano", "Blow Up", "Capitol", "Vicenza", "Discogs", "Napoli", "Streng", "Rumore", "Rockit", "Casal Gajardo Records", "Naples", "Trento", "59ufo", "Ca'7"];
var FT_NAME_RE = new RegExp('(^|[^\\w])(' + FT_NAMES.map(function (n) { return n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?![\\w])', 'g');
function ftProtectNames(root) {
  var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
  while ((n = w.nextNode())) nodes.push(n);
  nodes.forEach(function (t) {
    if (t.parentNode.closest('[translate="no"]')) return;
    var s = t.nodeValue, m, last = 0, frag = document.createDocumentFragment(), hit = false;
    FT_NAME_RE.lastIndex = 0;
    while ((m = FT_NAME_RE.exec(s))) {
      var start = m.index + m[1].length;
      if (start > last) frag.appendChild(document.createTextNode(s.slice(last, start)));
      var sp = document.createElement('span');
      sp.setAttribute('translate', 'no'); sp.textContent = m[2];
      frag.appendChild(sp); last = start + m[2].length; hit = true;
    }
    if (!hit) return;
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    t.parentNode.replaceChild(frag, t);
  });
}

  var de = document.documentElement;
  de.classList.add('js');
  var IT = (de.lang || 'it').slice(0, 2) === 'it';
  var T = IT
    ? { prev: 'Precedente', next: 'Successiva', close: 'Chiudi', pause: 'Pausa', play: 'Riproduci carosello', go: 'Vai alla foto ', of: ' di ', play1: 'Ascolta', stop: 'Ferma', menu: 'Menu' }
    : { prev: 'Previous', next: 'Next', close: 'Close', pause: 'Pause', play: 'Play slideshow', go: 'Go to photo ', of: ' of ', play1: 'Listen', stop: 'Stop', menu: 'Menu' };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isLocal = location.protocol === 'file:';

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger'), nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
  }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function btn(cls, label, txt) { var b = el('button', cls, txt); b.type = 'button'; b.setAttribute('aria-label', label); return b; }

  /* ---------- dialogs: light dismiss fallback (Safari lacks closedby) ---------- */
  function lightDismissFallback(dialog) {
    if ('closedBy' in HTMLDialogElement.prototype) return;
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var r = dialog.getBoundingClientRect();
      var inside = r.top <= event.clientY && event.clientY <= r.top + r.height &&
                   r.left <= event.clientX && event.clientX <= r.left + r.width;
      if (inside) return;
      dialog.close();
    });
  }
  document.querySelectorAll('dialog').forEach(lightDismissFallback);

  /* ---------- hero crossfade ---------- */
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = [].slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = hero.querySelector('.dots');
    var ctl = hero.querySelector('.hero-ctl');
    var cur = 0, timer = null, paused = false, hovering = false;
    var pb = btn('', T.pause, '❚❚'), pv = btn('', T.prev, '‹'), nx = btn('', T.next, '›');
    var dbtns = slides.map(function (s, i) {
      var d = btn('', T.go + (i + 1) + T.of + slides.length);
      d.addEventListener('click', function () { show(i); restart(); });
      dots.appendChild(d); return d;
    });
    ctl.appendChild(pv); ctl.appendChild(pb); ctl.appendChild(nx);
    function show(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k === cur ? 'false' : 'true'); });
      dbtns.forEach(function (d, k) { d.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() { if (reduce.matches || paused || hovering || timer) return; timer = setInterval(function () { show(cur + 1); }, 6000); }
    function restart() { stop(); start(); }
    pv.addEventListener('click', function () { show(cur - 1); restart(); });
    nx.addEventListener('click', function () { show(cur + 1); restart(); });
    pb.addEventListener('click', function () {
      paused = !paused; pb.textContent = paused ? '▶' : '❚❚';
      pb.setAttribute('aria-label', paused ? T.play : T.pause); paused ? stop() : start();
    });
    hero.addEventListener('mouseenter', function () { hovering = true; stop(); });
    hero.addEventListener('mouseleave', function () { hovering = false; start(); });
    hero.addEventListener('focusin', function () { hovering = true; stop(); });
    hero.addEventListener('focusout', function () { hovering = false; start(); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    reduce.addEventListener && reduce.addEventListener('change', function () { reduce.matches ? (stop(), show(0)) : start(); });
    show(0); start();
  }

  /* ---------- stop-motion hero (photos page) ---------- */
  var sm = document.querySelector('[data-sm]');
  if (sm) {
    var vid = sm.querySelector('video'), sb = sm.querySelector('.sm-ctl button');
    function smSet(on) {
      if (on) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else { vid.pause(); }
      sb.textContent = on ? '❚❚' : '▶';
      sb.setAttribute('aria-label', on ? sb.dataset.pause : sb.dataset.play);
    }
    sb.addEventListener('click', function () { smSet(vid.paused); });
    if (reduce.matches) { vid.removeAttribute('autoplay'); smSet(false); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) vid.pause(); else if (!reduce.matches && sb.textContent === '❚❚') vid.play().catch(function () {}); });
  }

  /* ---------- lightbox ---------- */
  var lb = null, lbItems = [], lbI = 0, lbOpener = null;
  function buildLb() {
    lb = el('dialog', 'lb');
    lb.setAttribute('closedby', 'any');
    lb.setAttribute('aria-label', IT ? 'Foto ingrandita' : 'Enlarged photo');
    var fig = el('figure');
    var img = el('img'); img.alt = '';
    var cap = el('figcaption'); cap.setAttribute('translate','no'); var ct = el('span'); var cn = el('span');
    cap.appendChild(ct); cap.appendChild(cn);
    var x = btn('dlg-x', T.close, '×'), p = btn('nav-b prev', T.prev, '‹'), n = btn('nav-b next', T.next, '›');
    fig.appendChild(img); fig.appendChild(cap); fig.appendChild(p); fig.appendChild(n);
    lb.appendChild(x); lb.appendChild(fig); document.body.appendChild(lb);
    x.addEventListener('click', function () { lb.close(); });
    p.addEventListener('click', function () { go(-1); });
    n.addEventListener('click', function () { go(1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(-1); } else if (e.key === 'ArrowRight') { go(1); }
    });
    lb.addEventListener('close', function () { if (lbOpener && lbOpener.focus) lbOpener.focus(); });
    lightDismissFallback(lb);
    lb._img = img; lb._ct = ct; lb._cn = cn; lb._p = p; lb._n = n;
  }
  function paint() {
    var it = lbItems[lbI];
    lb._img.setAttribute('translate', 'no'); lb._img.src = it.dataset.full; lb._img.alt = it.dataset.alt || '';
    lb._ct.textContent = it.dataset.cap || '';
         ftProtectNames(lb._ct);
    lb._cn.textContent = lbItems.length > 1 ? (lbI + 1) + T.of + lbItems.length : '';
    lb._p.hidden = lb._n.hidden = lbItems.length < 2;
  }
  function go(d) { lbI = (lbI + d + lbItems.length) % lbItems.length; paint(); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lb]');
    if (!t) return;
    e.preventDefault();
    if (!lb) buildLb();
    var g = t.dataset.lb;
    lbItems = [].slice.call(document.querySelectorAll('[data-lb="' + g + '"]'));
    lbI = lbItems.indexOf(t); lbOpener = t; paint(); lb.showModal();
  });

  /* ---------- polaroid rails ---------- */
  document.querySelectorAll('[data-car]').forEach(function (car) {
    var rail = car.querySelector('.rail');
    var items = [].slice.call(rail.children);
    var dwrap = car.querySelector('.dots'), idx = 0;
    var dl = items.map(function (it, i) {
      var d = btn('', T.go + (i + 1) + T.of + items.length);
      d.addEventListener('click', function () { it.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' }); });
      dwrap.appendChild(d); return d;
    });
    function mark(i) { idx = i; dl.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); }); }
    mark(0);
    if ('onscrollsnapchange' in window) {
      rail.addEventListener('scrollsnapchange', function (e) {
        var i = items.indexOf(e.snapTargetInline); if (i > -1) mark(i);
      });
    } else {
      var raf = 0;
      rail.addEventListener('scroll', function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var c = rail.scrollLeft + rail.clientWidth / 2, best = 0, bd = 1e9;
          items.forEach(function (it, k) { var d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - c); if (d < bd) { bd = d; best = k; } });
          mark(best);
        });
      }, { passive: true });
    }
    function step(d) { var i = Math.min(items.length - 1, Math.max(0, idx + d)); items[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' }); }
    var pb = car.querySelector('.car-btn.p'), nb = car.querySelector('.car-btn.n');
    pb && pb.addEventListener('click', function () { step(-1); });
    nb && nb.addEventListener('click', function () { step(1); });
    if (items.length < 2) { dwrap.hidden = true; pb && (pb.hidden = true); nb && (nb.hidden = true); }
  });

  /* ---------- record popups ---------- */
  var au = null;
  function fmt(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function stopAudio(scope) {
    if (au) { au.pause(); au = null; }
    (scope || document).querySelectorAll('.player,.spot,.aplayer').forEach(function (p) { p.remove(); });
    (scope || document).querySelectorAll('.play[aria-pressed=true]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.textContent = '▶'; b.setAttribute('aria-label', T.play1 + ': ' + b.closest('li').querySelector('.nm').textContent); });
  }
  document.querySelectorAll('[data-dlg]').forEach(function (b) {
    var d = document.getElementById(b.dataset.dlg);
    if (!d) return;
    b.addEventListener('click', function () {
      stopAudio();
      var sp = d.querySelector('[data-spotify]');
      if (sp && !d.querySelector('.spot') && !isLocal) {
        var f = el('iframe', 'spot'); f.src = sp.dataset.spotify; f.loading = 'lazy'; f.title = 'Spotify';
        f.allow = 'encrypted-media; clipboard-write'; sp.appendChild(f);
      }
      d.showModal();
    });
    d.addEventListener('close', function () { stopAudio(d); });
    var x = d.querySelector('.dlg-x'); x && x.addEventListener('click', function () { d.close(); });
  });
  document.querySelectorAll('.tracks .play').forEach(function (p) {
    var li = p.closest('li'), id = li.dataset.yt;
    var nmEl = li.querySelector('.nm'); if (nmEl) nmEl.addEventListener('click', function () { p.click(); });
    p.addEventListener('click', function () {
      var dlg = p.closest('dialog');
      if (li.dataset.mp3) {
        var wasOn = p.getAttribute('aria-pressed') === 'true';
        stopAudio(dlg);
        if (wasOn) return;
        var a = new Audio(li.dataset.mp3), box = el('div', 'aplayer');
        var seek = el('input', 'seek'), tm = el('span', 'time');
        seek.type = 'range'; seek.min = 0; seek.max = 1000; seek.value = 0; seek.setAttribute('aria-label', li.querySelector('.nm').textContent);
        tm.textContent = '0:00';
        box.appendChild(seek); box.appendChild(tm); li.appendChild(box);
        a.addEventListener('timeupdate', function () { if (a.duration) { seek.value = a.currentTime / a.duration * 1000; tm.textContent = fmt(a.currentTime) + ' / ' + fmt(a.duration); } });
        seek.addEventListener('input', function () { if (a.duration) a.currentTime = seek.value / 1000 * a.duration; });
        a.addEventListener('ended', function () {
          var nx = li.nextElementSibling, nb = nx && nx.querySelector('.play');
          stopAudio(dlg); if (nb) nb.click();
        });
        au = a; a.play();
        p.setAttribute('aria-pressed', 'true'); p.textContent = '■'; p.setAttribute('aria-label', T.stop);
        return;
      }
      if (isLocal) { window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
      var was = p.getAttribute('aria-pressed') === 'true';
      stopAudio(dlg);
      if (was) return;
      var box = el('div', 'player'), f = el('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = li.querySelector('.nm').textContent;
      f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allowFullscreen = true;
      box.appendChild(f); li.appendChild(box);
      p.setAttribute('aria-pressed', 'true'); p.textContent = '■'; p.setAttribute('aria-label', T.stop);
    });
  });

  /* ---------- click-to-play videos ---------- */
  document.querySelectorAll('.yt').forEach(function (b) {
    var id = b.dataset.id, watch = 'https://www.youtube.com/watch?v=' + id;
    b.addEventListener('click', function () {
      if (isLocal) { window.open(watch, '_blank', 'noopener'); return; }
      var f = el('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
      f.title = b.getAttribute('aria-label');
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allowFullscreen = true;
      b.replaceChildren(f);
    });
    var t = b.parentNode.querySelector('h3 a');
    if (t && !isLocal) t.addEventListener('click', function (e) { e.preventDefault(); if (!b.querySelector('iframe')) b.click(); });
  });
})();

(function(){var f=document.getElementById('cform');if(!f)return;
f.addEventListener('submit',function(e){e.preventDefault();
var v=function(i){return (document.getElementById(i).value||'').trim()};
var sub=v('cf-subject')||'The Vindicators';
var body=v('cf-msg')+'\n\n'+v('cf-name')+'\n'+v('cf-email');
location.href='mailto:The%20Vindicators%20%3Cchichoi60@gmail.com%3E?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body);});})();

/* Year rail: sticky under the header, scroll-spy, overflow arrows */
(function () {
  var tl = document.querySelector('.yrs'), bar = document.querySelector('.top');
  if (!tl || !bar) return;
  function setH() { document.documentElement.style.setProperty('--barh', bar.offsetHeight + 'px'); }
  setH(); window.addEventListener('resize', setH);
  if ('ResizeObserver' in window) new ResizeObserver(setH).observe(bar);
  var links = [].slice.call(tl.querySelectorAll('a'));
  var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  var ol = tl.querySelector('ol'), box = tl.querySelector('.wrap'), raf = 0, lastCur = null;
  var IT = document.documentElement.lang === 'it';
  var aL = document.createElement('button'), aR = document.createElement('button');
  [[aL, -1, 'l', 'M15 4l-8 8 8 8', IT ? 'Anni precedenti' : 'Earlier years'], [aR, 1, 'r', 'M9 4l8 8-8 8', IT ? 'Anni successivi' : 'Later years']].forEach(function (x) {
    var b = x[0]; b.type = 'button'; b.className = 'yrs-arr ' + x[2]; b.setAttribute('aria-label', x[4]);
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + x[3] + '"/></svg>';
    b.addEventListener('click', function () { ol.scrollBy({ left: x[1] * ol.clientWidth * 0.7, behavior: 'smooth' }); });
    box.appendChild(b);
  });
  function arrows() {
    var max = ol.scrollWidth - ol.clientWidth;
    aL.classList.toggle('on', ol.scrollLeft > 4); aR.classList.toggle('on', ol.scrollLeft < max - 4);
    aL.tabIndex = aL.classList.contains('on') ? 0 : -1; aR.tabIndex = aR.classList.contains('on') ? 0 : -1;
  }
  ol.addEventListener('scroll', arrows, { passive: true });
  window.addEventListener('resize', arrows);
  if ('ResizeObserver' in window) new ResizeObserver(arrows).observe(ol);
  function follow() {
    var a = links.filter(function (l) { return l.getAttribute('aria-current') === 'true'; })[0];
    if (!a || a === lastCur) return; lastCur = a;
    var li = a.parentNode, target = li.offsetLeft - (ol.clientWidth - li.offsetWidth) / 2;
    ol.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }
  function mark() {
    raf = 0;
    var line = bar.offsetHeight + tl.offsetHeight + 110, cur = null;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    links.forEach(function (a) { a.setAttribute('aria-current', cur && a.getAttribute('href') === '#' + cur ? 'true' : 'false'); });
    follow();
  }
  function req() { if (!raf) raf = requestAnimationFrame(mark); }
  window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req);
  arrows(); mark();
})();

/* ===== Analytics (Google Analytics 4) with cookie consent =====
   Google's script is requested only after the visitor accepts. The choice is kept in localStorage (vn_consent).
   Events: audio_play, video_start, click_listen, click_social, click_email, generate_lead (contact form). */
(function () {
  var GA_ID = 'G-N73GN6Z2SD';
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
  if (location.protocol === 'file:') return;
  var en = (document.documentElement.lang || 'it').slice(0, 2) === 'en';
  var KEY = 'vn_consent';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  if (get() === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', GA_ID, { page_language: en ? 'en' : 'it' });
  var loaded = false;
  function load() { if (loaded) return; loaded = true; var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s); }
  if (get() === 'granted') load();
  function track(n, p) { try { gtag('event', n, p || {}); } catch (e) {} }

  /* Cookie banner */
  function banner() {
    if (document.querySelector('.vnck')) return;
    var T = en ? { t: 'We use statistics cookies (Google Analytics) only if you accept, to understand how the site is used.', p: 'Privacy policy', u: '/en/privacy', y: 'Accept', n: 'Decline' }
               : { t: 'Usiamo cookie statistici (Google Analytics) solo se accetti, per capire come viene usato il sito.', p: 'Informativa sulla privacy', u: '/privacy', y: 'Accetta', n: 'Rifiuta' };
    var st = document.createElement('style');
    st.textContent = '.vnck{position:fixed;left:16px;bottom:16px;z-index:300;width:min(400px,calc(100vw - 32px));background:#0b0b0b;border:2px solid #FFD500;padding:14px 16px;color:#f3efe4;font:15px/1.45 "Bitter",Georgia,serif;box-shadow:0 10px 40px rgba(0,0,0,.6)}' +
      '.vnck p{margin:0 0 12px}.vnck a{color:#FFD500}.vnck div{display:flex;gap:10px}' +
      '.vnck button{flex:1;padding:9px 12px;font:700 16px/1 "Barlow Condensed","Arial Narrow",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;background:#0b0b0b;color:#f3efe4;border:2px solid #f3efe4}' +
      '.vnck button:hover,.vnck button:focus-visible{background:#FFD500;border-color:#FFD500;color:#000}' +
      '@media(max-width:560px){.vnck{left:12px;right:12px;bottom:12px;width:auto}}';
    document.head.appendChild(st);
    var b = document.createElement('div'); b.className = 'vnck'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookie');
    b.innerHTML = '<p>' + T.t + ' <a href="' + T.u + '">' + T.p + '</a>.</p><div><button type="button" data-v="granted">' + T.y + '</button><button type="button" data-v="denied">' + T.n + '</button></div>';
    b.addEventListener('click', function (e) {
      var bt = e.target.closest && e.target.closest('[data-v]'); if (!bt) return; var v = bt.getAttribute('data-v');
      set(v); if (v === 'granted') { gtag('consent', 'update', { analytics_storage: 'granted' }); load(); } b.remove();
    });
    document.body.appendChild(b);
  }
  if (!get()) banner();
  /* "Change my choice" link on the privacy page */
  document.addEventListener('click', function (e) {
    var r = e.target.closest && e.target.closest('[data-ck-reset]'); if (!r) return;
    e.preventDefault(); try { localStorage.removeItem(KEY); } catch (x) {}
    gtag('consent', 'update', { analytics_storage: 'denied' }); banner();
  });

  /* Events */
  var once = {};
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 100) : ''; }
  var LISTEN = [['spotify', /spotify\.com/], ['deezer', /deezer\.com/], ['apple_music', /music\.apple\.com|itunes\.apple\.com/], ['youtube', /youtube\.com|youtu\.be/], ['soundcloud', /soundcloud\.com/], ['bandcamp', /bandcamp\.com/], ['amazon', /amazon\.|music\.amazon/], ['tidal', /tidal\.com/]];
  var SOCIAL = [['facebook', /facebook\.com/], ['instagram', /instagram\.com/], ['tiktok', /tiktok\.com/], ['x', /twitter\.com|\/\/x\.com/]];
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    /* Records: a track row plays its own mp3 or a YouTube clip */
    var row = (t.closest('.tracks .play') || t.closest('.tracks .nm')) && t.closest('li');
    if (row) {
      var name = txt(row.querySelector('.nm'));
      if (row.dataset.mp3) { if (!once['a' + row.dataset.mp3]) { once['a' + row.dataset.mp3] = 1; track('audio_play', { track: name, player: 'site' }); } }
      else if (row.dataset.yt && !once['v' + row.dataset.yt]) { once['v' + row.dataset.yt] = 1; track('video_start', { video_id: row.dataset.yt, video_title: name }); }
    }
    var yt = t.closest('.yt');
    if (yt) { var v = yt.getAttribute('data-id') || ''; if (v && !once['v' + v]) { once['v' + v] = 1; track('video_start', { video_id: v, video_title: (yt.getAttribute('aria-label') || '').replace(/^[^:]*:\s*/, '').slice(0, 100) }); } }
    var a = t.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/^mailto:/i.test(h)) { track('click_email'); return; }
    if (!/^https?:/i.test(h) || a.hostname === location.hostname) return;
    for (var i = 0; i < LISTEN.length; i++) if (LISTEN[i][1].test(h)) { track('click_listen', { platform: LISTEN[i][0], link_url: h.slice(0, 200) }); return; }
    for (var j = 0; j < SOCIAL.length; j++) if (SOCIAL[j][1].test(h)) { track('click_social', { platform: SOCIAL[j][0] }); return; }
  }, true);
  /* Self-hosted films (home, rehearsal room) */
  document.addEventListener('play', function (e) {
    var v = e.target; if (!v || v.tagName !== 'VIDEO' || !v.controls) return;
    var s = (v.currentSrc || v.getAttribute('poster') || '').split('/').pop().replace(/\.[a-z0-9]+$/i, '');
    if (!once['f' + s]) { once['f' + s] = 1; track('video_start', { video_id: 'site:' + s.slice(0, 80), video_title: (v.getAttribute('aria-label') || '').slice(0, 100) }); }
  }, true);
  /* Contact form (opens the visitor's email app) */
  var cf = document.getElementById('cform');
  if (cf) cf.addEventListener('submit', function () { track('generate_lead', { method: 'email' }); });
})();
