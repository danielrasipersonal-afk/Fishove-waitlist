// Näkymät, testin eteneminen ja lomakkeen tapahtumat.
const byId = id => document.getElementById(id);
const sections = Array.from(document.querySelectorAll('main > section'));
const keys = 'abcd';
let answers = [];
let revealTimer;
let selectionTimer;
let selectionPending = false;
let emailMeasure;
let waitlistReturn = 'menu';
let manifestReturn = 'menu';
let introTimer;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function finishIntro() {
  if (document.body.dataset.view !== 'home') return;
  if (reducedMotion.matches) { show('menu'); return; }
  document.body.classList.add('intro-leaving');
  introTimer = setTimeout(() => show('menu'), 380);
}

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

// Balance real word widths after fonts load. Prefer three words on every row;
// always keep three on the second row without shrinking the text.
function balanceCardCopy() {
  if (document.body.dataset.view !== 'quiz') return;
  for (const copy of byId('cards').querySelectorAll('.card-copy')) {
    const style = getComputedStyle(copy);
    const width = copy.clientWidth;
    const signature = `${width}:${style.fontSize}:${style.letterSpacing}:${document.fonts.status}`;
    if (!width || copy.dataset.balance === signature) continue;
    const words = Array.from(copy.querySelectorAll('.copy-word'));
    const measure = document.createElement('span');
    measure.textContent = ' ';
    measure.style.cssText = 'white-space:pre;display:inline-block';
    copy.append(measure);
    const space = parseFloat(getComputedStyle(measure).width);
    measure.remove();
    const widths = words.map(word => parseFloat(getComputedStyle(word).width));
    function findRows(strict) {
      const memo = new Map();
      function solve(start, rowIndex) {
        if (start === words.length) return { cost: 0, ends: [] };
        const key = `${start}:${rowIndex}`;
        if (memo.has(key)) return memo.get(key);
        const minimum = strict || rowIndex === 1 ? 3 : 2;
        let best = { cost: Infinity, ends: [] };
        let lineWidth = 0;
        for (let end = start; end < words.length; end++) {
          lineWidth += widths[end] + (end > start ? space : 0);
          if (lineWidth > width - 1) break;
          const count = end - start + 1;
          if (count < minimum || (rowIndex === 0 && end === words.length - 1)) continue;
          const next = solve(end + 1, rowIndex + 1);
          const cost = (width - lineWidth) ** 2 + (count < 3 ? 3000 : 0) + next.cost;
          if (cost < best.cost) best = { cost, ends: [end + 1, ...next.ends] };
        }
        memo.set(key, best);
        return best;
      }
      return solve(0, 0);
    }
    let balanced = findRows(true);
    if (!Number.isFinite(balanced.cost)) balanced = findRows(false);
    const rows = [];
    if (Number.isFinite(balanced.cost)) {
      let start = 0;
      for (const end of balanced.ends) {
        const row = document.createElement('span');
        row.className = 'copy-row';
        words.slice(start, end).forEach((word, index) => {
          if (index) row.append(' ');
          row.append(word);
        });
        rows.push(row, document.createTextNode(' '));
        start = end;
      }
    } else {
      words.forEach((word, index) => { if (index) rows.push(document.createTextNode(' ')); rows.push(word); });
    }
    copy.replaceChildren(...rows);
    copy.dataset.balance = signature;
  }
}

function show(view) {
  if (!byId(view)) return;
  clearTimeout(introTimer);
  document.body.classList.remove('intro-leaving');
  clearTimeout(revealTimer);
  cancelSelection();
  siteMotion.stop();
  document.body.dataset.view = view;
  for (const section of sections) section.hidden = section.id !== view;
  if (view === 'quiz') balanceCardCopy();
  byId('footer').hidden = ['home', 'menu', 'manifest'].includes(view);
  byId('main-footer').hidden = !['home', 'menu'].includes(view);
  byId('main-footer-tag').textContent = view === 'menu' ? '2 months for free, tokens & offers' : 'love, in all its little forms.';
  byId('nav-text').textContent = view === 'home' ? 'HOME PAGE' : ['menu', 'result', 'waitlist'].includes(view) ? 'WAITLIST' : view === 'manifest' ? 'MANIFEST' : 'LOVER TEST';
  const landing = ['home', 'menu', 'waitlist', 'result'].includes(view);
  byId('nav-link').dataset.action = landing ? 'waitlist' : 'menu';
  byId('nav-link').setAttribute('aria-controls', landing ? 'waitlist' : 'menu');
  byId('nav-link').setAttribute('aria-label', landing ? 'Join the waitlist' : 'Return to main page');
  byId('footer-text').textContent = view === 'waitlist' ? 'App made for love. Join now' : 'What kind of lover Are YOU?';
  if (view === 'waitlist') byId('wait-status').textContent = '';
  if (view === 'waitlist') centerEmail();
  window.scrollTo(0, 0);
  // Avoid opening the phone keyboard just by navigating to a page.
  const target = byId(view).querySelector('h1');
  target?.focus({ preventScroll: true });
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
    // Only the fixed question data provides markup. Preserve emphasis per word.
    const source = document.createElement('span');
    source.innerHTML = copy.replaceAll('<br>', ' ');
    const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
    let word;
    while (walker.nextNode()) {
      const accent = walker.currentNode.parentElement.closest('em');
      for (const text of walker.currentNode.textContent.split(/(\s+)/).filter(Boolean)) {
        if (/^\s+$/.test(text)) { word = undefined; continue; }
        if (!word) {
          word = document.createElement('span');
          word.className = 'copy-word';
          if (description.childNodes.length) description.append(' ');
          description.append(word);
        }
        const fragment = document.createElement('span');
        if (accent) fragment.className = 'accent';
        fragment.textContent = text;
        word.append(fragment);
      }
    }
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
  if (action === 'home' || action === 'menu') show('menu');
  if (action === 'manifest') { manifestReturn = document.body.dataset.view === 'home' ? 'menu' : document.body.dataset.view; show('manifest'); }
  if (action === 'waitlist') {
    if (document.body.dataset.view !== 'waitlist') {
      waitlistReturn = document.body.dataset.view === 'home' ? 'menu' : document.body.dataset.view;
      byId('email').value = byId('menu-email').value;
    }
    show('waitlist');
  }
  if (action === 'back') {
    const view = document.body.dataset.view;
    if (view === 'quiz' && answers.length) { answers.pop(); renderQuestion(); }
    else if (view === 'reveal' || view === 'result') { answers.pop(); renderQuestion(); }
    else show(view === 'waitlist' ? waitlistReturn : view === 'manifest' ? manifestReturn : 'menu');
  }
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

async function submitWaitlist(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('[role="status"]');
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
      body: JSON.stringify({ email: form.elements.email.value.trim() })
    });
    if (!response.ok) throw new Error('Waitlist request failed');
    form.reset();
    centerEmail();
    status.textContent = 'You’re on the list. Thanks for joining!';
  } catch {
    status.textContent = 'We couldn’t add your email. Please try again.';
  } finally {
    button.disabled = false;
  }
}
byId('waitlist-form').addEventListener('submit', submitWaitlist);
byId('menu-form').addEventListener('submit', submitWaitlist);

for (const [index, [title, number, paragraphs]] of manifestChapters.entries()) {
  const chapter = document.createElement('section');
  chapter.className = 'manifest-chapter';
  const heading = document.createElement('div');
  heading.className = 'chapter-heading';
  const h2 = document.createElement('h2');
  h2.id = `chapter-${index}`;
  h2.textContent = title;
  chapter.setAttribute('aria-labelledby', h2.id);
  const label = document.createElement('span');
  label.className = `chapter-number${index === 0 ? ' chapter-note' : ''}`;
  label.textContent = number;
  if (/^0[1-4]$/.test(number)) {
    const image = document.createElement('img');
    image.src = `assets/icons/chapter-${number}.png`;
    image.alt = number;
    image.className = 'chapter-icon';
    label.replaceChildren(image);
  }
  heading.append(h2, label);
  chapter.append(heading);
  for (const text of paragraphs) {
    const p = document.createElement('p');
    p.textContent = text;
    chapter.append(p);
  }
  byId('manifest-body').append(chapter);
}
const signature = document.createElement('p');
signature.className = 'manifest-signature';
for (const text of ['The Fishove Team', 'Fishove — The Brand of Love.']) {
  const span = document.createElement('span');
  span.textContent = text;
  signature.append(span);
}
byId('manifest-body').append(signature);

window.addEventListener('pagehide', () => {
  clearTimeout(introTimer);
  clearTimeout(revealTimer);
  cancelSelection();
  siteMotion.stop();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  if (document.body.dataset.view === 'home') show('menu');
  else if (document.body.dataset.view === 'reveal') show('result');
  else siteMotion.enter(byId(document.body.dataset.view));
});
window.scrollTo(0, 0);
byId('email').addEventListener('input', centerEmail);
byId('email').addEventListener('change', centerEmail);
window.addEventListener('resize', centerEmail);
new ResizeObserver(balanceCardCopy).observe(byId('cards'));
new ResizeObserver(centerEmail).observe(byId('waitlist-form'));
document.fonts.ready.then(() => { centerEmail(); balanceCardCopy(); });
siteMotion.boot();
if (reducedMotion.matches) show('menu');
else introTimer = setTimeout(finishIntro, 2800);
reducedMotion.addEventListener('change', event => {
  if (event.matches && document.body.dataset.view === 'home') show('menu');
});
