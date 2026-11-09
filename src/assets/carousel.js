document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.step-carousel').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    if (!slides.length) return;
    const indicators = [...carousel.querySelectorAll('.indicator')];
    const count = carousel.querySelector('.current-slide');
    const status = carousel.querySelector('.carousel-status');
    const pause = carousel.querySelector('.carousel-pause');
    let current = 0, timer;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let playing = carousel.dataset.autoplay === 'true' && !reduceMotion;
    const stop = () => { clearInterval(timer); timer = undefined; };
    function show(index, announce = false) {
      current = (index + slides.length) % slides.length;
      carousel.querySelector('.carousel-slides').style.transform = `translateX(-${current * 100}%)`;
      slides.forEach((slide, i) => { slide.classList.toggle('active', i === current); slide.setAttribute('aria-hidden', String(i !== current)); slide.inert = i !== current; });
      indicators.forEach((button, i) => { button.classList.toggle('active', i === current); button.setAttribute('aria-current', String(i === current)); });
      count.textContent = String(current + 1);
      if (announce) status.textContent = `Slide ${current + 1} of ${slides.length}: ${slides[current].querySelector('img').alt}`;
    }
    function start() { stop(); if (playing && slides.length > 1) timer = setInterval(() => show(current + 1), Math.max(2000, Number(carousel.dataset.interval) || 5000)); }
    function move(delta) { stop(); show(current + delta, true); }
    carousel.querySelector('.next').addEventListener('click', () => move(1));
    carousel.querySelector('.prev').addEventListener('click', () => move(-1));
    indicators.forEach((button, i) => button.addEventListener('click', () => { stop(); show(i, true); }));
    carousel.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } });
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', () => { if (!carousel.contains(document.activeElement)) start(); });
    let startX;
    carousel.addEventListener('touchstart', event => { startX = event.changedTouches[0].screenX; }, {passive:true});
    carousel.addEventListener('touchend', event => { const delta = event.changedTouches[0].screenX - startX; if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1); }, {passive:true});
    if (pause) { pause.hidden = carousel.dataset.autoplay !== 'true'; pause.textContent = playing ? 'Pause slides' : 'Play slides'; pause.addEventListener('click', () => { playing = !playing; pause.textContent = playing ? 'Pause slides' : 'Play slides'; playing ? start() : stop(); }); }
    show(0); start();
  });
});
