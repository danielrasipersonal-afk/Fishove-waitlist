// Animaatiot on erotettu toiminnallisuudesta, jotta liikettä on helppo säätää.
const siteMotion = (() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const ease = 'cubic-bezier(.16, 1, .3, 1)';
  let previousView;
  let submitVisible = false;

  function stop() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  function animate(element, keyframes, { delay = 0, duration = 520 } = {}) {
    if (!element || preference.matches || !element.animate || !element.getClientRects().length) return;
    const animation = element.animate(keyframes, { delay, duration, easing: ease, fill: 'backwards' });
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }

  function rise(element, delay = 0, distance = 32, duration = 680) {
    animate(element, [{ opacity: 0, translate: `0 ${distance}px`, scale: .97 }, { opacity: 1, translate: '0 0', scale: 1 }], { delay, duration });
  }

  function spring(element, delay = 0, distance = 52, tilt = -2, duration = 820) {
    animate(element, [
      { opacity: 0, translate: `0 ${distance}px`, scale: .88, rotate: `${tilt}deg`, offset: 0 },
      { opacity: 1, translate: '0 -5px', scale: 1.012, rotate: `${-tilt * .1}deg`, offset: .72 },
      { opacity: 1, translate: '0 0', scale: 1, rotate: '0deg', offset: 1 }
    ], { delay, duration });
  }

  function enter(section) {
    stop();
    const view = section.id;
    if (view === 'home') {
      section.querySelectorAll('.hero-title span').forEach((line, index) => spring(line, index * 130, 96, index ? 3 : -3, 1000));
      rise(section.querySelector('.intro'), 230, 36);
      spring(section.querySelector('.signup'), 300, 40, 1);
      rise(section.querySelector('.home-bottom > div'), 360, 32);
      spring(section.querySelector('.start-large'), 410, 46, -2, 820);
    } else if (view === 'quiz') {
      rise(section.querySelector('.eyebrow'), 0, 24, 460);
      spring(section.querySelector('.question'), 50, 44, -1.2, 800);
      section.querySelectorAll('.card').forEach((card, index) => spring(card, 90 + index * 85, 60, index % 2 ? 3 : -3, 760));
      rise(section.querySelector('.hint'), 280, 22, 560);
      animate(section.querySelector('.hint-divider'), [{ scale: '1 0' }, { scale: '1 1.04', offset: .75 }, { scale: '1 1' }], { delay: 360, duration: 700 });
    } else if (view === 'reveal') {
      animate(section.querySelector('.display'), [
        { opacity: 0, scale: .55, rotate: '-6deg', translate: '0 22px' },
        { opacity: 1, scale: 1.012, rotate: '.6deg', translate: '0 -4px', offset: .72 },
        { opacity: 1, scale: 1, rotate: '0deg', translate: '0 0' }
      ], { duration: 700 });
    } else if (view === 'result') {
      spring(section.querySelector('.display'), 0, 54, -2.5, 900);
      rise(section.querySelector('.result-tag'), 120, 24);
      rise(section.querySelector('.result-copy'), 220, 28);
      spring(section.querySelector('.result-actions'), 350, 28, 1, 720);
    } else if (view === 'waitlist') {
      // Kenttä kohdistetaan heti app.js:ssä; animaatio ei viivytä kirjoittamista.
      animate(section.querySelector('.email'), [{ opacity: .25 }, { opacity: 1 }], { duration: 500 });
      rise(section.querySelector('.wait-copy'), 120, 28, 680);
      submitVisible = section.querySelector('.email').validity.valid;
      if (submitVisible) spring(section.querySelector('.wait-submit'), 220, 32, -3, 720);
    }

    if (view !== 'home' && (!previousView || previousView === 'home')) {
      rise(document.querySelector('footer'), 180, 20, 650);
      animate(document.querySelector('.footer-rule'), [{ scale: '0 1' }, { scale: '1.025 1', offset: .75 }, { scale: '1 1' }], { delay: 260, duration: 900 });
    }
    if (previousView && previousView !== view) rise(document.getElementById('nav-text'), 0, 3, 220);
    previousView = view;
  }

  function select(card) {
    stop();
    card.classList.add('is-selected');
    const cards = card.closest('.cards');
    cards.classList.add('is-selecting');
    cards.setAttribute('aria-busy', 'true');
    animate(card, [{ scale: .94 }, { scale: 1.02, offset: .55 }, { scale: 1 }], { duration: 170 });
    return preference.matches ? 0 : 170;
  }

  function boot() {
    enter(document.querySelector('main > section:not([hidden])'));
    rise(document.querySelector('header'), 0, -26, 800);
    animate(document.querySelector('.logo svg'), [
      { opacity: 0, scale: .55, rotate: '-120deg' },
      { opacity: 1, scale: 1.08, rotate: '10deg', offset: .75 },
      { opacity: 1, scale: 1, rotate: '0deg' }
    ], { delay: 120, duration: 1000 });
    document.getElementById('email').addEventListener('input', event => {
      const visible = event.currentTarget.validity.valid;
      if (visible && !submitVisible) spring(document.querySelector('.wait-submit'), 0, 26, -3, 620);
      submitVisible = visible;
    });
    const status = document.getElementById('wait-status');
    new MutationObserver(() => {
      if (status.textContent) spring(status, 0, 18, -1, 520);
    }).observe(status, { childList: true, characterData: true, subtree: true });
  }

  preference.addEventListener('change', event => {
    if (event.matches) stop();
  });
  return { boot, enter, select, stop };
})();
