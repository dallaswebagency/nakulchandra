(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  /* Scroll reveal */
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Floating logo */
  [].forEach.call(document.querySelectorAll('[data-logo-anim]'), function (img, i) {
    if (reduce) return;
    img.style.animation = (6 + i * 1.5) + 's ease-in-out infinite ncFloat';
  });

  /* Carousel */
  [].forEach.call(document.querySelectorAll('[data-carousel]'), function (c) {
    var slides = [].slice.call(c.querySelectorAll('[data-slide]'));
    var dots = [].slice.call(c.querySelectorAll('.carousel__dot'));
    var prev = c.querySelector('[data-prev]');
    var next = c.querySelector('[data-next]');
    var i = Math.max(0, slides.findIndex(function (s) { return s.hasAttribute('data-active'); }));
    var timer = null;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        if (k === i) { s.setAttribute('data-active', ''); s.setAttribute('aria-hidden', 'false'); }
        else { s.removeAttribute('data-active'); s.setAttribute('aria-hidden', 'true'); }
      });
      dots.forEach(function (d, k) {
        if (k === i) { d.setAttribute('data-active', ''); d.setAttribute('aria-current', 'true'); }
        else { d.removeAttribute('data-active'); d.setAttribute('aria-current', 'false'); }
      });
    }
    function start() { if (reduce) return; stop(); timer = setInterval(function () { show(i + 1); }, 7000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (prev) prev.addEventListener('click', function () { show(i - 1); start(); });
    if (next) next.addEventListener('click', function () { show(i + 1); start(); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); start(); }); });
    c.addEventListener('mouseenter', stop);
    c.addEventListener('mouseleave', start);
    c.addEventListener('focusin', stop);
    c.addEventListener('focusout', start);
    c.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(i - 1); start(); }
      if (e.key === 'ArrowRight') { show(i + 1); start(); }
    });
    var sx = null;
    c.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    c.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { show(i + (dx < 0 ? 1 : -1)); start(); }
      sx = null;
    });
    show(i);
    start();
  });

  /* Click-to-play video (loads YouTube only on click) */
  [].forEach.call(document.querySelectorAll('[data-video]'), function (frame) {
    var id = frame.getAttribute('data-video-id');
    var btn = frame.querySelector('[data-video-play]');
    if (!id || !btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title = 'Video testimonial';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      frame.replaceChild(f, btn);
    });
  });
})();
