// Näkymät, testin eteneminen ja lomakkeen tapahtumat.
const byId = id => document.getElementById(id);
const sections = Array.from(document.querySelectorAll('main > section'));
const keys = 'abcd';
let answers = [];
let revealTimer;
let selectionTimer;
let selectionPending = false;
let emailMeasure;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function centerEmail() {
  const email = byId('email');
  if (!email.getClientRects().length) return;
  if (!emailMeasure) {
    const host = document.createElement('span');
    host.className = 'sr-only';
    host.setAttribute('aria-hidden', 'true');
    emailMeasure = document.createElement('span');
    emailMeasure.className = 'display email';
    emailMeasure.style.cssText = 'width:max-content;max-width:none;margin:0;white-space:pre;visibility:hidden';
    host.append(emailMeasure);
    document.body.append(host);
  }
  // Kenttä seuraa tekstin leveyttä: teksti pysyy keskellä, kohdistin vasemmalla.
  const style = getComputedStyle(email, email.value ? null : '::placeholder');
  emailMeasure.style.letterSpacing = style.letterSpacing;
  emailMeasure.textContent = email.value || email.placeholder;
  const width = Math.min(byId('waitlist-form').clientWidth, Math.ceil(emailMeasure.getBoundingClientRect().width) + 2);
  if (email.style.width !== `${width}px`) email.style.width = `${width}px`;
}

function cancelSelection() {
  clearTimeout(selectionTimer);
  selectionPending = false;
  byId('cards').classList.remove('is-selecting');
  byId('cards').removeAttribute('aria-busy');
  for (const card of byId('cards').querySelectorAll('.is-selected')) card.classList.remove('is-selected');
}

function show(view) {
  if (!byId(view)) return;
  clearTimeout(revealTimer);
  cancelSelection();
  document.body.dataset.view = view;
  for (const section of sections) section.hidden = section.id !== view;
  byId('footer').hidden = view === 'home';
  byId('nav-link').dataset.action = view === 'home' || view === 'waitlist' ? 'waitlist' : 'start';
  byId('nav-text').textContent = view === 'home' ? 'WAITINGLIST' : view === 'waitlist' ? 'WAITLIST' : 'LOVER TEST';
  byId('footer-text').textContent = view === 'waitlist' ? 'App made for love. Join now' : 'What kind of lover Are YOU?';
  if (view === 'waitlist') byId('wait-status').textContent = '';
  if (view === 'waitlist') centerEmail();
  window.scrollTo(0, 0);
  const target = view === 'waitlist' ? byId('email') : byId(view).querySelector('h1');
  target.focus({ preventScroll: true });
  siteMotion.enter(byId(view));
}

function renderQuestion() {
  const { title, hint, choices } = questions[answers.length];
  const questionIndex = answers.length;
  byId('question').replaceChildren(title[0], document.createElement('br'), title[1]);
  byId('hint').textContent = hint;
  const cards = choices.map(([name, copy, type], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    button.setAttribute('aria-keyshortcuts', keys[index]);
    const heading = document.createElement('span');
    heading.className = 'card-title';
    heading.textContent = name;
    const description = document.createElement('span');
    description.className = 'card-copy';
    // The markup comes from the fixed question data above.
    description.innerHTML = copy.split('<br>')
      .map(line => `<span class="copy-line">${line.replaceAll('<em>', '<span class="accent">').replaceAll('</em>', '</span>')}</span>`)
      .join(' ');
    const key = document.createElement('span');
    key.className = 'key';
    key.setAttribute('aria-hidden', 'true');
    key.textContent = keys[index];
    button.append(heading, description, key);
    button.addEventListener('click', () => selectAnswer(type, questionIndex, button));
    return button;
  });
  byId('cards').replaceChildren(...cards);
  show('quiz');
}

function selectAnswer(type, questionIndex, button) {
  if (document.body.dataset.view !== 'quiz' || answers.length !== questionIndex || selectionPending) return;
  selectionPending = true;
  const delay = siteMotion.select(button);
  if (delay) selectionTimer = setTimeout(() => completeAnswer(type, questionIndex), delay);
  else completeAnswer(type, questionIndex);
}

function completeAnswer(type, questionIndex) {
  selectionPending = false;
  if (document.body.dataset.view !== 'quiz' || answers.length !== questionIndex) return;
  answers.push(type);
  if (answers.length < questions.length) {
    renderQuestion();
    return;
  }
  const scores = {};
  for (const answer of answers) scores[answer] = (scores[answer] || 0) + 1;
  // A tied score is decided by the latest answer.
  const bestScore = Math.max(...Object.values(scores));
  const winner = [...answers].reverse().find(answer => scores[answer] === bestScore);
  const [title, tag, copyLines] = profiles[winner];
  byId('result-title').textContent = title;
  byId('result-tag').textContent = tag;
  const resultCopy = copyLines.flatMap((line, index) => {
    const span = document.createElement('span');
    span.className = 'result-line';
    span.textContent = line;
    return index === copyLines.length - 1 ? [span] : [span, document.createTextNode(' ')];
  });
  byId('result-copy').replaceChildren(...resultCopy);
  show('reveal');
  const revealDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 750;
  revealTimer = setTimeout(() => show('result'), revealDelay);
}

document.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'home') show('home');
  if (action === 'waitlist') show('waitlist');
  if (action === 'start') {
    answers = [];
    renderQuestion();
  }
});

document.addEventListener('keydown', event => {
  if (document.body.dataset.view !== 'quiz' || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  const index = keys.split('').indexOf(event.key.toLowerCase());
  if (index !== -1) byId('cards').children[index]?.click();
});

byId('waitlist-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = byId('wait-status');
  status.textContent = '';
  if (!waitlistEndpoint) {
    status.textContent = 'This is a preview. Your email address hasn’t been sent.';
    return;
  }
  const button = event.submitter || form.querySelector('[type="submit"]');
  button.disabled = true;
  status.textContent = 'Sending…';
  try {
    const response = await fetch(waitlistEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: byId('email').value.trim() })
    });
    if (!response.ok) throw new Error('Waitlist request failed');
    form.reset();
    status.textContent = 'You’re on the list. Thanks for joining!';
  } catch {
    status.textContent = 'We couldn’t add your email. Please try again.';
  } finally {
    button.disabled = false;
  }
});

window.addEventListener('pagehide', () => {
  clearTimeout(revealTimer);
  cancelSelection();
  siteMotion.stop();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  if (document.body.dataset.view === 'reveal') show('result');
  else siteMotion.enter(byId(document.body.dataset.view));
});
window.scrollTo(0, 0);
byId('email').addEventListener('input', centerEmail);
byId('email').addEventListener('change', centerEmail);
window.addEventListener('resize', centerEmail);
new ResizeObserver(centerEmail).observe(byId('waitlist-form'));
document.fonts.ready.then(centerEmail);
siteMotion.boot();
