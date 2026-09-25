// 2Gaff homepage behaviour. Loaded as a file because the site's content policy blocks inline scripts.
(function () {
  'use strict';

  // 1. Hand app traffic to the app. Joining links (?join=), Google/Apple sign-in returns and people
  //    who are already signed in belong in the app, which lives at /app.
  var APP = '/app';
  try {
    var search = new URLSearchParams(window.location.search);
    var hash = window.location.hash || '';
    var appParam = ['join', 'code', 'error', 'error_description', 'signin', 'start'].some(function (k) {
      return search.has(k);
    });
    var authHash = /access_token=|refresh_token=|error_description=/.test(hash);
    var signedIn = false;
    if (!search.has('home')) {
      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i) || '';
        if (/^sb-.+-auth-token$/.test(key) && window.localStorage.getItem(key)) { signedIn = true; break; }
      }
    }
    if (appParam || authHash || signedIn) {
      window.location.replace(APP + window.location.search + hash);
      return;
    }
  } catch (e) { /* storage can be blocked; the homepage still works */ }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Mobile menu.
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // 3. Hero video: the messages, scene labels and progress lines follow the video's own time.
  var v = document.querySelector('.hero-video');
  if (v) {
    var starts = [0, 5.5, 10.5, 16.5], end = 22.5;
    var chips = [].slice.call(document.querySelectorAll('.hero .chip'));
    var labs = [].slice.call(document.querySelectorAll('.hero .lab'));
    var fills = [].slice.call(document.querySelectorAll('.hero .fill'));
    var btn = document.querySelector('.hero .pause');
    var PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var render = function (t) {
      var n = 0;
      starts.forEach(function (s, k) { if (t >= s) n = k; });
      var stop = starts[n + 1] || end;
      chips.forEach(function (c, k) { c.classList.toggle('on', k === n); });
      labs.forEach(function (l, k) { l.classList.toggle('on', k === n); });
      fills.forEach(function (f, k) {
        var p = k < n ? 1 : k === n ? Math.min(1, (t - starts[n]) / (stop - starts[n])) : 0;
        f.style.transform = 'scaleX(' + p + ')';
      });
    };
    if (reduce) {
      v.removeAttribute('autoplay');
      v.pause();
      render(0);
      if (fills[0]) fills[0].style.transform = 'scaleX(1)';
      if (btn) btn.hidden = true;
    } else {
      var userPaused = false;
      var play = function () { if (!userPaused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } };
      (function tick() { render(v.currentTime || 0); window.requestAnimationFrame(tick); })();
      ['timeupdate', 'seeked', 'loadedmetadata'].forEach(function (ev) {
        v.addEventListener(ev, function () { render(v.currentTime || 0); });
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) play(); else v.pause(); });
        }, { threshold: 0.2 }).observe(v);
      }
      document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); else play(); });
      if (btn) btn.addEventListener('click', function () {
        userPaused = !userPaused;
        if (userPaused) v.pause(); else v.play();
        btn.setAttribute('aria-pressed', String(userPaused));
        btn.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
        btn.innerHTML = userPaused ? PLAY : PAUSE;
      });
    }
  }

  // 4. Sections ease in as they scroll into view.
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('shown'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // 5. Footer year.
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
