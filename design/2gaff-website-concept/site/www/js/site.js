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
      // Redraw every frame only while the video plays; paused or hidden, the events below suffice.
      var ticking = null;
      var tick = function () { render(v.currentTime || 0); ticking = v.paused ? null : window.requestAnimationFrame(tick); };
      v.addEventListener('play', function () { if (!ticking) ticking = window.requestAnimationFrame(tick); });
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

  // 4a. The moving strips and stickers only animate while they are on screen.
  if ('IntersectionObserver' in window) {
    var movers = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('paused', !e.isIntersecting); });
    });
    [].slice.call(document.querySelectorAll('.marquee, .hero, #everyday, #teams, .closing')).forEach(function (el) { movers.observe(el); });
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

  // 5. Smooth scrolling. Mouse wheels glide to a stop (trackpads keep their native glide), and links within the page
  //    ease to their section below the sticky header. Touch screens keep native scrolling, and
  //    visitors who ask for less motion get ordinary scrolling.
  var header = document.querySelector('.site-header');
  var headerOffset = function () { return (header ? header.offsetHeight : 0) + 16; };
  var maxScroll = function () { return document.documentElement.scrollHeight - window.innerHeight; };
  var clamp = function (n) { return Math.max(0, Math.min(maxScroll(), n)); };
  var jump = function (y) { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); };

  if (!reduce) {
    document.documentElement.style.scrollBehavior = 'auto';
    var target = window.scrollY, current = window.scrollY, frame = null, glide = null;

    var step = function () {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.5) { current = target; jump(current); frame = null; return; }
      jump(current);
      frame = window.requestAnimationFrame(step);
    };
    var start = function () { if (!frame) frame = window.requestAnimationFrame(step); };

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('wheel', function (e) {
        if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        // Trackpads send small pixel steps and already glide natively; only smooth mouse wheels.
        if (e.deltaMode === 0 && Math.abs(e.deltaY) < 50 && !frame) return;
        e.preventDefault();
        if (glide) { window.cancelAnimationFrame(glide); glide = null; }
        if (!frame) { target = current = window.scrollY; }
        var d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
        target = clamp(target + d);
        start();
      }, { passive: false });
    }
    // Keyboard, scrollbar and find-in-page scrolling take over from any glide in progress.
    window.addEventListener('scroll', function () { if (!frame && !glide) target = current = window.scrollY; }, { passive: true });

    // Links within the page: ease over about 0.9 s, then move focus for keyboard users.
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var id = link.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (frame) { window.cancelAnimationFrame(frame); frame = null; }
      if (glide) window.cancelAnimationFrame(glide);
      var from = window.scrollY;
      var to = clamp(el.getBoundingClientRect().top + from - (id === 'main' ? 0 : headerOffset()));
      var duration = Math.min(1100, 450 + Math.abs(to - from) * 0.25), t0 = null;
      var run = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min(1, (now - t0) / duration);
        jump(from + (to - from) * ease(p));
        if (p < 1) { glide = window.requestAnimationFrame(run); return; }
        glide = null; target = current = to;
        if (history.replaceState) history.replaceState(null, '', '#' + id);
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      };
      glide = window.requestAnimationFrame(run);
    });
  }

  // 6. Footer year.
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
